import type { SummaryState } from "../agent/state";
import type { RunnableConfig } from "@langchain/core/runnables";

export const routeResearch = (state: SummaryState, _: RunnableConfig) => {
  if (state.researchLoopCount <= state.maxResearchLoops) {
    return "webResearch";
  } else {
    return "finalizeSummary";
  }
};
