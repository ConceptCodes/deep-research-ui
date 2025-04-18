import { Annotation } from "@langchain/langgraph/web";

export const SectionAnnotation = Annotation.Root({
  name: Annotation<string>,
  description: Annotation<string>,
  research: Annotation<boolean>,
  content: Annotation<string>,
});

export const SectionsAnnotation = Annotation.Root({
  sections: Annotation<Section[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
});

export const SearchQueryAnnotation = Annotation.Root({
  searchQuery: Annotation<string>,
});

export const QueriesAnnotation = Annotation.Root({
  queries: Annotation<SearchQuery[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
});

export const FeedbackAnnotation = Annotation.Root({
  grade: Annotation<"pass" | "fail">,
  followUpQueries: Annotation<SearchQuery[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
});

export const ReportStateInputAnnotation = Annotation.Root({
  topic: Annotation<string>,
});

export const ReportStateOutputAnnotation = Annotation.Root({
  finalReport: Annotation<string>,
});

export const ReportStateAnnotation = Annotation.Root({
  topic: Annotation<string>,
  feedbackOnReportPlan: Annotation<string>,
  sections: Annotation<Section[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
  completedSections: Annotation<Section[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
  reportSectionsFromResearch: Annotation<string>,
  finalReport: Annotation<string>,
  deepSeekApiKey: Annotation<string>,
  tavilyApiKey: Annotation<string>,
});

export const SectionStateAnnotation = Annotation.Root({
  topic: Annotation<string>,
  section: Annotation<Section>,
  searchIterations: Annotation<number>,
  searchQueries: Annotation<SearchQuery[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
  source: Annotation<string>,
  reportSectionsFromResearch: Annotation<string>,
  completedSections: Annotation<Section[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
  deepSeekApiKey: Annotation<string>,
  tavilyApiKey: Annotation<string>,
});

export const SectionOutputStateAnnotation = Annotation.Root({
  completedSections: Annotation<Section[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
});

export type Section = typeof SectionAnnotation.State;
export type Sections = typeof SectionsAnnotation.State;
export type SearchQuery = typeof SearchQueryAnnotation.State;
export type Queries = typeof QueriesAnnotation.State;
export type Feedback = typeof FeedbackAnnotation.State;
export type ReportStateInput = typeof ReportStateInputAnnotation.State;
export type ReportStateOutput = typeof ReportStateOutputAnnotation.State;
export type ReportState = typeof ReportStateAnnotation.State;
export type SectionState = typeof SectionStateAnnotation.State;
export type SectionOutputState = typeof SectionOutputStateAnnotation.State;
