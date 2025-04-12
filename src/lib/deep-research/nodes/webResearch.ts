import type { RunnableConfig } from "@langchain/core/runnables";
import axios from "axios";

import type { SummaryState } from "../agent/state";

declare type TavilySearchResult = {
  title: string;
  url: string;
  content: string;
  raw_content?: string;
  score: number;
  publishedDate?: string;
};

declare type TavilySearchResponse = {
  query: string;
  follow_up_questions: [];
  answer: any;
  images: [];
  results: TavilySearchResult[];
};

const deduplicateAndFormatSources = (
  searchResponse: TavilySearchResponse,
  maxTokensPerSource: number,
) => {
  // Deduplicate by URL
  const uniqueSources: Record<string, TavilySearchResult> = {};
  searchResponse.results.forEach((source) => {
    if (!uniqueSources[source.url]) {
      uniqueSources[source.url] ??= source;
    }
  });

  // Format output
  let formattedText = "Sources:\n\n";
  Object.values(uniqueSources).forEach((source) => {
    formattedText += `Source ${source.title}:\n===\n`;
    formattedText += `URL: ${source.url}\n===\n`;
    formattedText += `Most relevant content from source: ${source.content}\n===\n`;
    const charLimit = maxTokensPerSource * 4;
    let rawContent = source.rawContent ?? "";
    if (rawContent.length > charLimit) {
      rawContent = rawContent.substring(0, charLimit) + "... [truncated]";
    }
    formattedText += `Full source content limited to ${maxTokensPerSource} tokens: ${rawContent}\n\n`;
  });

  return formattedText.trim();
};

const tavilySearch = async (
  apiKey: string,
  query: string,
): Promise<TavilySearchResponse> => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://api.tavily.com/search",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      data: {
        query: query,
        search_depth: "advanced",
        max_results: 3,
        include_raw_content: true,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Tavily API returned status code ${response.status}`);
    }

    return response.data as TavilySearchResponse;
  } catch (error) {
    console.error("Error calling Tavily API:", error);
    throw error;
  }
};

export const webResearch = async (state: SummaryState, _: RunnableConfig) => {
  const context = await tavilySearch(state.tavilyApiKey, state.searchQuery);

  const webResearchResults = deduplicateAndFormatSources(context, 2500);
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
