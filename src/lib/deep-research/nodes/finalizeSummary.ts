import type { SummaryState } from "../agent/state";
import { ChatDeepSeek } from "@langchain/deepseek";

export const finalizeSummary = async (state: SummaryState) => {
  const llm = new ChatDeepSeek({
    model: "deepseek-chat",
    temperature: 0.3,
    apiKey: state.apiKey,
  });

  const prompt = `Please convert the following running summary into a final summary. 
The final summary should be concise, clear, and well-structured. 
It should effectively communicate the main findings and insights from the research. 
Ensure you use markdown formatting for better readability.
Here is the current content: ${state.runningSummary}`;

  const response = await llm.invoke(prompt);

  return {
    runningSummary: response.content ?? state.runningSummary,
    sources: state.sourcesGathered,
  };
};
