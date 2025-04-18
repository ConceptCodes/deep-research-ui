import { ChatDeepSeek } from "@langchain/deepseek";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

import type { SectionState } from "../agent/state";
import { FINAL_SECTION_WRITER_INSTRUCTIONS } from "../agent/prompts";

export const writeFinalSections = async (state: SectionState) => {
  const { topic, section, reportSectionsFromResearch, deepSeekApiKey } = state;

  const systemInstructions = FINAL_SECTION_WRITER_INSTRUCTIONS.replace(
    "{topic}",
    topic,
  )
    .replace("{section_name}", section.name)
    .replace("{section_topic}", section.description)
    .replace("{context}", reportSectionsFromResearch);

  const writerModel = new ChatDeepSeek({
    model: "deepseek-chat",
    apiKey: deepSeekApiKey,
    temperature: 0.3,
  });

  const sectionContentResponse = await writerModel.invoke([
    new SystemMessage({ content: systemInstructions }),
    new HumanMessage({
      content: "Generate the report section based on the provided context.",
    }),
  ]);

  const updatedSection = {
    ...section,
    content: sectionContentResponse.content as string,
  };

  return { completedSections: [updatedSection] };
};
