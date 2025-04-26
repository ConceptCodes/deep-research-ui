import { z } from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { RunnableConfig } from "@langchain/core/runnables";

import { queryWriterInstructions } from "../agent/prompts";
import type {
  AgentConfigurationAnnotation,
  SectionStateAnnotation,
} from "../agent/state";
import { NUMBER_OF_QUERIES } from "../helpers/constants";
import { getLLM } from "@/lib/utils";

const outputSchema = z.object({
  searchQueries: z.string().array().describe("List of search queries"),
});

export const generateQueryNode = async (
  state: typeof SectionStateAnnotation.State,
  config: RunnableConfig<typeof AgentConfigurationAnnotation.State>,
): Promise<typeof SectionStateAnnotation.Update> => {
  const {
    section: { title, description },
  } = state;

  const llm = getLLM(
    config.configurable?.openAiApiKey!,
    config.configurable?.openAiModel!,
  );

  const structuredLLM = llm.withStructuredOutput(outputSchema);
  const prompt = queryWriterInstructions(title, description, NUMBER_OF_QUERIES);

  const { searchQueries } = await structuredLLM.invoke([
    new SystemMessage({ content: prompt }),
    new HumanMessage("Generate a query for web search:"),
  ]);

  return { searchQueries };
};
