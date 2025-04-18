import axios from "axios";
import type { Section } from "./agent/state";

export function formatSections(sections: Section[]): string {
  let formattedStr = "";

  sections.forEach((section, index) => {
    const separator = "=".repeat(60);
    formattedStr += `
${separator}
Section ${index + 1}: ${section.name}
${separator}
Description:
${section.description}
Requires Research:
${section.research}

Content:
${section.content || "[Not yet written]"}

`;
  });

  return formattedStr;
}

type SearchResult = {
  title: string;
  url: string;
  content: string;
  score: number;
  raw_content: string | null;
};

type SearchResponse = {
  query: string;
  results: SearchResult[];
};

export function deduplicateAndFormatSources(
  searchResponses: SearchResponse[],
  maxTokensPerSource: number,
  includeRawContent = true,
): string {
  const allSources: SearchResult[] = [];
  for (const response of searchResponses) {
    allSources.push(...response.results);
  }

  const uniqueSourcesMap = new Map<string, SearchResult>();
  for (const source of allSources) {
    if (!uniqueSourcesMap.has(source.url)) {
      uniqueSourcesMap.set(source.url, source);
    }
  }

  let formattedText = "Content from sources:\n";
  const separator = "=".repeat(80);
  const subSeparator = "-".repeat(80);

  Array.from(uniqueSourcesMap.values()).forEach((source, idx) => {
    formattedText += `${separator}\n`;
    formattedText += `Source ${idx + 1}: ${source.title}\n`;
    formattedText += `${subSeparator}\n`;
    formattedText += `URL: ${source.url}\n===\n`;
    formattedText += `Most relevant content from source: ${source.content}\n===\n`;

    if (includeRawContent) {
      const charLimit = maxTokensPerSource * 4;
      let raw = source.raw_content ?? "";
      if (source.raw_content === null) {
        console.warn(`Warning: No raw_content found for source ${source.url}`);
      }
      if (raw.length > charLimit) {
        raw = raw.slice(0, charLimit) + "... [truncated]";
      }
      formattedText += `Full source content limited to ${maxTokensPerSource} tokens: ${raw}\n\n`;
    }

    formattedText += `${separator}\n\n`;
  });

  return formattedText.trim();
}

export const tavilySearch = async (
  apiKey: string,
  query: string,
): Promise<SearchResponse> => {
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

    return response.data as SearchResponse;
  } catch (error) {
    console.error("Error calling Tavily API:", error);
    throw error;
  }
};
