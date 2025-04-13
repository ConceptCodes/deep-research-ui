import type { RunnableConfig } from "@langchain/core/runnables";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatDeepSeek } from "@langchain/deepseek";
import { z } from "zod";

import type { SummaryState } from "../agent/state";
import { reflectionInstructions } from "../agent/prompt";

const outputSchema = z.object({
  followUpQuery: z.string(),
});

export const reflectOnSummary = async (
  state: SummaryState,
  _: RunnableConfig,
) => {
  const llm = new ChatDeepSeek({
    model: "deepseek-chat",
    apiKey: state.apiKey,
    temperature: 0,
  }).withStructuredOutput(outputSchema);

  const { followUpQuery } = await llm.invoke([
    new SystemMessage(reflectionInstructions(state.researchTopic)),
    new HumanMessage(
      `Identify a knowledge gap and generate a follow-up web search query based on our existing knowledge: ${state.runningSummary}`,
    ),
  ]);

  if (!followUpQuery) {
    // Fallback to a placeholder query
    return {
      searchQuery: `Tell me more about ${state.researchTopic} and its subtopics: ${state.subTopics.join(", ")}`,
    };
  }
  return { searchQuery: `Tell me more about ${followUpQuery}` };
};
