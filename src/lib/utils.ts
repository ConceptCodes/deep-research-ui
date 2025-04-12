import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Event } from "@/hooks/use-store";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AgentStep =
  | { generateQuery: { searchQuery: string } }
  | {
      webResearch: {
        researchLoopCount: number;
        webResearchResults: string[];
        sourcesGathered: Array<{ url: string; title: string }>;
      };
    }
  | { summarizeSources: { runningSummary: string } }
  | { reflectOnSummary: { searchQuery: string } }
  | { finalizeSummary: { runningSummary: string } };

export function formatAgentStep(step: AgentStep): Event {
  if ("generateQuery" in step) {
    return {
      title: "Generated Search Query",
      content: `🔍 "${step.generateQuery.searchQuery}"`,
      timestamp: new Date(),
    };
  }

  if ("webResearch" in step) {
    return {
      title: `Web Research (Round ${step.webResearch.researchLoopCount})`,
      content: step.webResearch.sourcesGathered
        .map((source) => `🔗 - [${source.title}](${source.url})`)
        .join("\n"),
      timestamp: new Date(),
    };
  }

  if ("summarizeSources" in step) {
    return {
      title: "Summarized Sources",
      content: step.summarizeSources.runningSummary,
      timestamp: new Date(),
    };
  }

  if ("reflectOnSummary" in step) {
    return {
      title: "Reflective Follow-up Question",
      content: `🧠 "${step.reflectOnSummary.searchQuery}"`,
      timestamp: new Date(),
    };
  }

  return {
    title: "Unknown Step",
    content: JSON.stringify(step, null, 2),
    timestamp: new Date(),
  };
}
