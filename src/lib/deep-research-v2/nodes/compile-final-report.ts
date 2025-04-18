import type { ReportState } from "../agent/state";

export const compileFinalReport = (state: ReportState) => {
  const { sections, completedSections } = state;
  const _completedSections = Object.fromEntries(
    completedSections.map((s) => [s.name, s.content]),
  );

  sections.forEach((section) => {
    section.content = _completedSections[section.name] ?? section.content;
  });

  const allSections = sections.map((s) => s.content).join("\n\n");

  return { finalReport: allSections };
};
