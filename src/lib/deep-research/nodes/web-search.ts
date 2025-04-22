import type { RunnableConfig } from "@langchain/core/runnables";
import type {
  AgentConfigurationAnnotation,
  SectionStateAnnotation,
} from "../agent/state";
import { MAX_TOKENS_PER_SOURCE } from "../helpers/constants";
import { tavilySearch, deduplicateAndFormatSources } from "../helpers/utils";

export const webResearchNode = async (
  state: typeof SectionStateAnnotation.State,
  config: RunnableConfig<typeof AgentConfigurationAnnotation.State>,
): Promise<typeof SectionStateAnnotation.Update> => {
  const { searchQueries } = state;

  const context = await Promise.all(
    searchQueries.map((query) =>
      tavilySearch(query, config.configurable?.tavilyApiKey!),
    ),
  );

  const source = deduplicateAndFormatSources(context, MAX_TOKENS_PER_SOURCE);

  return {
    searchIterations: 1,
    source,
  };
};
