import { z } from "zod";
import { ChatDeepSeek } from "@langchain/deepseek";
import { Command, END } from "@langchain/langgraph/web";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

import {
  SECTION_GRADER_INSTRUCTIONS,
  SECTION_WRITER_INPUTS,
} from "../agent/prompts";
import type { SectionState } from "../agent/state";
import { MAX_SEARCH_DEPTH, Nodes, NUMBER_OF_QUERIES } from "../constants";

const feedbackOutputSchema = z.object({
  grade: z
    .enum(["pass", "fail"])
    .describe(
      "Evaluation result indicating whether the response meets requirements ('pass') or needs revision ('fail').",
    ),
  followUpQueries: z
    .array(z.object({ searchQuery: z.string() }))
    .describe("List of follow-up search queries."),
});

export const writeSection = async (state: SectionState) => {
  const { topic, source, section, searchIterations } = state;

  const sectionWriterInputsFormatted = SECTION_WRITER_INPUTS.replace(
    "{topic}",
    topic,
  )
    .replace("{section_name}", section.name)
    .replace("{section_topic}", section.description)
    .replace("{context}", source)
    .replace("{section_content}", section.content);

  const writerModel = new ChatDeepSeek({
    model: "deepseek-chat",
    temperature: 0.3,
    apiKey: state.deepSeekApiKey,
  });

  const llm = new ChatDeepSeek({
    model: "deepseek-chat",
    temperature: 0,
    apiKey: state.deepSeekApiKey,
  });

  const sectionContent = await writerModel.invoke([
    new SystemMessage({ content: sectionWriterInputsFormatted }),
    new HumanMessage({ content: sectionWriterInputsFormatted }),
  ]);

  const _section = {
    ...section,
    content: sectionContent.content as string,
  };

  const sectionGraderMessage =
    "Grade the report and consider follow-up questions for missing information. " +
    "If the grade is 'pass', return empty strings for all follow-up queries. " +
    "If the grade is 'fail', provide specific search queries to gather missing information.";

  const sectionGraderInstructionsFormatted =
    SECTION_GRADER_INSTRUCTIONS.replace("{topic}", topic)
      .replace("{section_topic}", section.description)
      .replace("{section}", JSON.stringify(_section.content))
      .replace("{number_of_follow_up_queries}", NUMBER_OF_QUERIES.toString());

  const reflectionModel = llm.withStructuredOutput(feedbackOutputSchema);

  const feedback = await reflectionModel.invoke([
    new SystemMessage({ content: sectionGraderInstructionsFormatted }),
    new HumanMessage({ content: sectionGraderMessage }),
  ]);

  if (feedback.grade == "pass" || searchIterations >= MAX_SEARCH_DEPTH) {
    return new Command({
      update: {
        completedSections: [_section],
      },
      goto: END,
    });
  } else {
    return new Command({
      update: {
        searchQueries: feedback.followUpQueries,
        section,
      },
      goto: Nodes.SEARCH_WEB,
    });
  }
};
