import { Send } from "@langchain/langgraph/web";

import type { ReportState } from "../agent/state";
import { Nodes } from "../constants";

export const initiateFinalSectionWriting = (state: ReportState) => {
  const { sections, topic, reportSectionsFromResearch } = state;
  return sections
    .filter((section) => !section.research)
    .map(
      (section) =>
        new Send(Nodes.WRITE_FINAL_SECTIONS, {
          topic,
          section,
          reportSectionsFromResearch,
        }),
    );
};
