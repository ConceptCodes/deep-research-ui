import type { RunnableConfig } from "@langchain/core/runnables";

import type { SummaryState } from "../agent/state";
import {
  deduplicateAndFormatSources,
  tavilySearch,
} from "@/lib/deep-research-v2/utils";

export const webResearch = async (state: SummaryState, _: RunnableConfig) => {
  const context = await tavilySearch(state.tavilyApiKey, state.searchQuery);

  const webResearchResults = deduplicateAndFormatSources([context], 2500);
  const sources = context.results.map((source) => ({
    title: source.title,
    url: source.url,
  }));

  return {
    sourcesGathered: [sources],
    researchLoopCount: state.researchLoopCount
      ? state.researchLoopCount + 1
      : 1,
    webResearchResults: [webResearchResults],
  };
};
