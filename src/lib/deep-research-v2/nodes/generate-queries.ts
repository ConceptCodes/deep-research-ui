import { z } from "zod";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { ChatDeepSeek } from "@langchain/deepseek";

import type { SectionState } from "../agent/state";
import { QUERY_WRITER_INSTRUCTIONS } from "../agent/prompts";
import { NUMBER_OF_QUERIES } from "../constants";

const queriesSchema = z.object({
  queries: z.array(z.string()).describe("List of search queries."),
});

export const generateQueries = async (state: SectionState) => {
  const { topic, section, deepSeekApiKey } = state;

  const writerModel = new ChatDeepSeek({
    model: "deepseek-chat",
    apiKey: deepSeekApiKey,
    temperature: 0,
  });

  const structuredLlm = writerModel.withStructuredOutput(queriesSchema);

  const systemInstructions = QUERY_WRITER_INSTRUCTIONS.replace("{topic}", topic)
    .replace("{section_topic}", section.description)
    .replace("{number_of_queries}", NUMBER_OF_QUERIES.toString());

  const queriesResult = await structuredLlm.invoke([
    new SystemMessage({ content: systemInstructions }),
    new HumanMessage({
      content: "Generate search queries on the provided topic.",
    }),
  ]);

  return { searchQueries: queriesResult.queries };
};
