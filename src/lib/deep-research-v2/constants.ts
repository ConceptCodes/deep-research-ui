export const DEFAULT_REPORT_STRUCTURE = `Use this structure to create a report on the user-provided topic:

1. Introduction (no research needed)
   - Brief overview of the topic area

2. Main Body Sections:
   - Each section should focus on a sub-topic of the user-provided topic
   
3. Conclusion
   - Aim for 1 structural element (either a list of table) that distills the main body sections 
   - Provide a concise summary of the report
`;

export const NUMBER_OF_QUERIES = 5;

export const MAX_TOKENS_PER_SOURCE = 4000;

export const MAX_SEARCH_DEPTH = 3;

export enum Nodes {
  GENERATE_QUERIES = "generateQueries",
  SEARCH_WEB = "searchWeb",
  WRITE_SECTION = "writeSection",
  GENERATE_REPORT_PLAN = "generateReportPlan",
  HUMAN_FEEDBACK = "humanFeedback",
  BUILD_SECTION_WITH_WEB_RESEARCH = "buildSectionWithWebResearch",
  GATHER_COMPLETED_SECTIONS = "gatherCompletedSections",
  WRITE_FINAL_SECTIONS = "writeFinalSections",
  COMPILE_FINAL_REPORT = "compileFinalReport",
}
