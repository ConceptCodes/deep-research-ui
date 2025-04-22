import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Command, END } from "@langchain/langgraph/web";

import { Nodes } from "../helpers/constants";
import {
  sectionGraderInstructions,
  sectionGraderPrompt,
  sectionWriterInstructions,
  sectionWriterPrompt,
} from "../agent/prompts";
import type {
  SectionStateAnnotation,
  AgentConfigurationAnnotation,
} from "../agent/state";
import { getLLM } from "../helpers/llm";

const outputSchema = z.object({
  grade: z
    .enum(["pass", "fail"])
    .describe("whether the section passes or fails"),
  followUpQueries: z
    .string()
    .array()
    .describe("Follow-up queries to gather missing information"),
});

export const writeSectionNode = async (
  state: typeof SectionStateAnnotation.State,
  config: typeof AgentConfigurationAnnotation.State,
) => {
  const { topic, section, source, searchIterations, researchLoopCount } = state;

  const prompt = sectionWriterPrompt(
    topic,
    section.title,
    section.description,
    source,
    section.content ?? "",
  );

  const llm = getLLM(
    config.configurable.openAiApiKey,
    config.configurable.openAiModel,
  );

  const newText = await llm.invoke([
    new SystemMessage({
      content: sectionWriterInstructions,
    }),
    new HumanMessage({ content: prompt }),
  ]);

  section.content = newText.content as string;

  const grader = llm.withStructuredOutput(outputSchema);

  const systemMessage = sectionGraderInstructions(
    topic,
    section.description,
    section.content,
    1,
  );

  const { grade, followUpQueries } = await grader.invoke([
    new SystemMessage({ content: systemMessage }),
    new HumanMessage({ content: sectionGraderPrompt }),
  ]);

  const hitDepthLimit = searchIterations >= researchLoopCount;

  if (grade === "pass" || hitDepthLimit) {
    return new Command({
      update: { completedSections: [section] },
      goto: END,
    });
  }

  return new Command({
    update: {
      searchQueries: followUpQueries,
      section,
    },
    goto: Nodes.WEB_SEARCH,
  });
};
