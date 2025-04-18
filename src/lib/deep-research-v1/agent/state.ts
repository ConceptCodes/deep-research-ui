import { Annotation } from "@langchain/langgraph/web";

export type SummaryState = typeof StateAnnotation.State;

export const StateAnnotation = Annotation.Root({
  researchTopic: Annotation<string>,
  subTopics: Annotation<string[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
  apiKey: Annotation<string>,
  tavilyApiKey: Annotation<string>,
  searchQuery: Annotation<string>,
  webResearchResults: Annotation<string[]>({
    reducer: (state, update) => state.concat(update),
    default: () => [],
  }),
  sourcesGathered: Annotation<{ title: string; url: string }[]>({
    reducer: (state, update) => state.concat(...update),
    default: () => [],
  }),
  researchLoopCount: Annotation<number>,
  maxResearchLoops: Annotation<number>,
  runningSummary: Annotation<string>,
});
