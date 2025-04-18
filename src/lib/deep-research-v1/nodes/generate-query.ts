import type { RunnableConfig } from "@langchain/core/runnables";
import { ChatDeepSeek } from "@langchain/deepseek";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";

import { queryWriterInstructions } from "../agent/prompt";
import type { SummaryState } from "../agent/state";

const outputSchema = z.object({
  searchQuery: z.string(),
});

export const generateQuery = async (state: SummaryState, _: RunnableConfig) => {
  const llm = new ChatDeepSeek({
    model: "deepseek-chat",
    apiKey: state.apiKey,
    temperature: 0,
  }).withStructuredOutput(outputSchema);

  const topics = [state.researchTopic, ...(state.subTopics || [])]
    .filter(Boolean)
    .join(", ");

  const result = await llm.invoke([
    new SystemMessage(queryWriterInstructions(topics)),
    new HumanMessage("Generate a query for web search:"),
  ]);
  return result;
};
