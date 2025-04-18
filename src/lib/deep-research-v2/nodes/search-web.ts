import type { SectionState } from "../agent/state";
import { MAX_TOKENS_PER_SOURCE } from "../constants";
import { deduplicateAndFormatSources, tavilySearch } from "../utils";

export const searchWeb = async (state: SectionState) => {
  const { searchQueries, searchIterations, tavilyApiKey } = state;

  const webResults = await Promise.all(
    searchQueries.map((query) =>
      tavilySearch(query.searchQuery, tavilyApiKey),
    ),
  );

  const source = deduplicateAndFormatSources(webResults, MAX_TOKENS_PER_SOURCE);

  return {
    source,
    searchIterations: searchIterations + 1,
  };
};
