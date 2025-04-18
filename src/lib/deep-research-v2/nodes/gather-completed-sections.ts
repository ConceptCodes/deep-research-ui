import type { ReportState } from "../agent/state";
import { formatSections } from "../utils";

export const gatherCompletedSections = (state: ReportState) => {
  const completedReportSections = formatSections(state.completedSections);

  return { reportSectionsFromResearch: completedReportSections };
};
