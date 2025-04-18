import type { RunnableConfig } from "@langchain/core/runnables";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatDeepSeek } from "@langchain/deepseek";
import { z } from "zod";

import type { SummaryState } from "../agent/state";
import { summarizerInstructions } from "../agent/prompt";

const outputSchema = z.object({
  runningSummary: z.string(),
});

export const summarizeSources = async (
  state: SummaryState,
  _: RunnableConfig,
) => {
  const existingSummary = state.runningSummary;
  const mostRecentWebResearch =
    state.webResearchResults[state.webResearchResults.length - 1];
  let humanMessageContent;

  if (existingSummary) {
    humanMessageContent = `<User Input> \n ${state.researchTopic} \n <User Input>\n\n
<Existing Summary> \n ${existingSummary} \n <Existing Summary>\n\n
<New Search Results> \n ${mostRecentWebResearch} \n <New Search Results>`;
  } else {
    humanMessageContent = `<User Input> \n ${state.researchTopic} \n <User Input>\n\n 
<Search Results> \n ${mostRecentWebResearch} \n <Search Results>`;
  }

  const llm = new ChatDeepSeek({
    model: "deepseek-chat",
    apiKey: state.apiKey,
    temperature: 0,
  }).withStructuredOutput(outputSchema);

  const result = await llm.invoke([
    new SystemMessage(summarizerInstructions),
    new HumanMessage(humanMessageContent),
  ]);

  const runningSummary = result.runningSummary
    .replaceAll("<think>", " ")
    .replaceAll("</think>", " ");

  return { runningSummary };
};
