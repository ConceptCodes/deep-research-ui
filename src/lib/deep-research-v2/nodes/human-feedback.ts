import { Command, Send } from "@langchain/langgraph/web";
import type { ReportState, Section } from "../agent/state";
import { Nodes } from "../constants";

export async function humanFeedback(state: ReportState): Promise<Command> {
  const topic = state.topic;
  const sections = state.sections;

  const sectionsStr = sections
    .map(
      (section: Section) =>
        `Section: ${section.name}\n` +
        `Description: ${section.description}\n` +
        `Research needed: ${section.research ? "Yes" : "No"}\n`,
    )
    .join("\n\n");

  const interruptMessage = `Please provide feedback on the following report plan. 
            
${sectionsStr}

Does the report plan meet your needs?
Pass 'true' to approve the report plan.
Or, provide feedback to regenerate the report plan:`;

  const feedback = await interrupt(interruptMessage);

  if (typeof feedback === "boolean" && feedback === true) {
    return new Command({
      goto: sections
        .filter((s: Section) => s.research)
        .map(
          (s: Section) =>
            new Send(Nodes.BUILD_SECTION_WITH_WEB_RESEARCH, {
              topic,
              section: s,
              searchIterations: 0,
            }),
        ),
    });
  }

  if (typeof feedback === "string") {
    return new Command({
      goto: Nodes.GENERATE_REPORT_PLAN,
      update: { feedbackOnReportPlan: feedback },
    });
  }

  throw new TypeError(
    `Interrupt value of type ${typeof feedback} is not supported.`,
  );
}
