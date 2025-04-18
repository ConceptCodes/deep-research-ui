import { z } from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { ChatDeepSeek } from "@langchain/deepseek";

import type { ReportState } from "../agent/state";
import {
  DEFAULT_REPORT_STRUCTURE,
  MAX_TOKENS_PER_SOURCE,
  NUMBER_OF_QUERIES,
} from "../constants";
import { REPORT_PLANNER_QUERY_WRITER_INSTRUCTIONS } from "../agent/prompts";
import { deduplicateAndFormatSources, tavilySearch } from "../utils";

const writerOutputSchema = z.object({
  queries: z
    .string()
    .array()
    .describe("List of search queries generated for report planning."),
});

const plannerOutputSchema = z.object({
  sections: z
    .array(
      z.object({
        name: z.string().describe("Name of the section."),
        description: z.string().describe("Description of the section."),
        plan: z
          .string()
          .describe("Plan for the section, including research and content."),
        research: z.string().describe("Research needed for the section."),
        content: z.string().describe("Content of the section."),
      }),
    )
    .describe("List of sections generated for the report."),
});

export const generateReportPlan = async (state: ReportState) => {
  const feedback = state.feedbackOnReportPlan || null;

  const writerModel = new ChatDeepSeek({
    model: "deepseek-chat",
    temperature: 0,
    apiKey: state.deepSeekApiKey,
  });

  const plannerModel = new ChatDeepSeek({
    model: "deepseek-chat",
    temperature: 0,
    apiKey: state.deepSeekApiKey,
  });

  const writerStructuredLlm =
    writerModel.withStructuredOutput(writerOutputSchema);

  const systemInstructionsQuery =
    REPORT_PLANNER_QUERY_WRITER_INSTRUCTIONS.replace("{topic}", state.topic)
      .replace("{report_organization}", DEFAULT_REPORT_STRUCTURE)
      .replace("{number_of_queries}", NUMBER_OF_QUERIES.toString());

  const results = await writerStructuredLlm.invoke([
    new SystemMessage({ content: systemInstructionsQuery }),
    new HumanMessage({
      content:
        "Generate search queries that will help with planning the sections of the report.",
    }),
  ]);

  const webResults = await Promise.all(
    results.queries.map((query) => tavilySearch(query, state.tavilyApiKey)),
  );

  const sources = deduplicateAndFormatSources(
    webResults,
    MAX_TOKENS_PER_SOURCE,
  );

  const systemInstructionsSections =
    REPORT_PLANNER_QUERY_WRITER_INSTRUCTIONS.replace("{topic}", state.topic)
      .replace("{report_organization}", DEFAULT_REPORT_STRUCTURE)
      .replace("{context}", sources)
      .replace("{feedback}", feedback ?? "");

  const plannerMessage = `Generate the sections of the report. 
Your response must include a 'sections' field containing a list of sections. 
Each section must have: name, description, plan, research, and content fields.`;

  const plannerStructuredLlm =
    plannerModel.withStructuredOutput(plannerOutputSchema);

  const reportSections = await plannerStructuredLlm.invoke([
    new SystemMessage({ content: systemInstructionsSections }),
    new HumanMessage({ content: plannerMessage }),
  ]);

  return { sections: reportSections.sections };
};
