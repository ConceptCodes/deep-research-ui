import { END, START, StateGraph } from "@langchain/langgraph/web";

import { StateAnnotation } from "./state";
import { generateQuery } from "../nodes/generate-query";
import { webResearch } from "../nodes/web-research";
import { summarizeSources } from "../nodes/summarize-sources";
import { reflectOnSummary } from "../nodes/reflect-summary";
import { finalizeSummary } from "../nodes/finalize-summary";
import { routeResearch } from "../nodes/routeResearch";
import { Nodes } from "../constants";

const builder = new StateGraph(StateAnnotation)
  .addNode(Nodes.GENERATE_QUERY, generateQuery)
  .addNode(Nodes.WEB_RESEARCH, webResearch)
  .addNode(Nodes.SUMMARIZE_SOURCES, summarizeSources)
  .addNode(Nodes.REFLECT_ON_SUMMARY, reflectOnSummary)
  .addNode(Nodes.FINALIZE_SUMMARY, finalizeSummary)

  .addEdge(START, Nodes.GENERATE_QUERY)
  .addEdge(Nodes.GENERATE_QUERY, Nodes.WEB_RESEARCH)
  .addEdge(Nodes.WEB_RESEARCH, Nodes.SUMMARIZE_SOURCES)
  .addEdge(Nodes.SUMMARIZE_SOURCES, Nodes.REFLECT_ON_SUMMARY)
  .addConditionalEdges(Nodes.REFLECT_ON_SUMMARY, routeResearch)
  .addEdge(Nodes.FINALIZE_SUMMARY, END);

export const graph = builder.compile({
  name: "Deep Researcher",
});
