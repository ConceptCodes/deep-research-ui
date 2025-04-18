import { END, START, StateGraph } from "@langchain/langgraph/web";

import {
  SectionAnnotation,
  SectionOutputStateAnnotation,
  ReportStateOutputAnnotation,
  ReportStateInputAnnotation,
  ReportStateAnnotation,
} from "./state";

import { Nodes } from "../constants";
import { generateQueries } from "../nodes/generate-queries";
import { searchWeb } from "../nodes/search-web";
import { writeSection } from "../nodes/write-section";
import { generateReportPlan } from "../nodes/generate-report-plan";
import { humanFeedback } from "../nodes/human-feedback";
import { gatherCompletedSections } from "../nodes/gather-completed-sections";
import { writeFinalSections } from "../nodes/write-final-sections";
import { compileFinalReport } from "../nodes/compile-final-report";
import { initiateFinalSectionWriting } from "../nodes/initiate-final-section-writing";

const subBuilder = new StateGraph({
  stateSchema: SectionAnnotation,
  output: SectionOutputStateAnnotation,
});

subBuilder.addNode(Nodes.GENERATE_QUERIES, generateQueries);
subBuilder.addNode(Nodes.SEARCH_WEB, searchWeb);
subBuilder.addNode(Nodes.WRITE_SECTION, writeSection);

subBuilder.addEdge(START, Nodes.GENERATE_QUERIES);
subBuilder.addEdge(Nodes.GENERATE_QUERIES, Nodes.SEARCH_WEB);
subBuilder.addEdge(Nodes.SEARCH_WEB, Nodes.WRITE_SECTION);

const subGraph = subBuilder.compile({
  name: "Section Research and Writing",
});

const builder = new StateGraph({
  stateSchema: ReportStateAnnotation,
  output: ReportStateOutputAnnotation,
  input: ReportStateInputAnnotation,
});

builder.addNode(Nodes.GENERATE_REPORT_PLAN, generateReportPlan);
builder.addNode(Nodes.HUMAN_FEEDBACK, humanFeedback);
builder.addNode(Nodes.BUILD_SECTION_WITH_WEB_RESEARCH, subGraph);
builder.addNode(Nodes.GATHER_COMPLETED_SECTIONS, gatherCompletedSections);
builder.addNode(Nodes.WRITE_FINAL_SECTIONS, writeFinalSections);
builder.addNode(Nodes.COMPILE_FINAL_REPORT, compileFinalReport);

builder.addEdge(START, Nodes.GENERATE_REPORT_PLAN);
builder.addEdge(Nodes.GENERATE_REPORT_PLAN, Nodes.HUMAN_FEEDBACK);
builder.addEdge(
  Nodes.BUILD_SECTION_WITH_WEB_RESEARCH,
  Nodes.GATHER_COMPLETED_SECTIONS,
);
builder.addConditionalEdges(
  Nodes.GATHER_COMPLETED_SECTIONS,
  initiateFinalSectionWriting,
  [Nodes.WRITE_FINAL_SECTIONS],
);
builder.addEdge(Nodes.WRITE_FINAL_SECTIONS, Nodes.COMPILE_FINAL_REPORT);
builder.addEdge(Nodes.COMPILE_FINAL_REPORT, END);

export const graph = builder.compile({
  name: "Deep Research Agent",
});
