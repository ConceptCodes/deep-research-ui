import { useState } from "react";
import { Loader2Icon, Download } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

import { graph } from "@/lib/deep-research/agent/graph";
import { generateQuizQuestions } from "@/lib/quiz";
import { generateFlashCards } from "@/lib/flash-cards";

import type { Research } from "@/hooks/use-store";
import useStore from "@/hooks/use-store";
import useDownload from "@/hooks/use-download";

type ResearchHeaderProps = {
  project: Research;
};

export function ResearchHeader({ project }: ResearchHeaderProps) {
  const {
    updateResearch,
    clearEventLog,
    addFlashcard,
    addQuestion,
    addQuiz,
    openAiApiKey,
    tavilyApiKey,
  } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(project.status);

  const downloadMarkdown = useDownload(project.content!, `${project.topic}.md`);

  const handleDownload = () => {
    if (project.content) {
      downloadMarkdown();
    } else {
      console.error("No content available for download.");
    }
  };

  const handleGenerateFlashCards = async (source: string) => {
    const generatedFlashCards = await generateFlashCards(
      source,
      project.model,
      openAiApiKey,
    );
    for (const flashCard of generatedFlashCards) {
      addFlashcard({ topicId: project.id, ...flashCard });
    }
  };

  // const handleGenerateQuiz = async (source: string) => {
  //   const generatedQuizQuestions = await generateQuizQuestions(
  //     source,
  //     project.model,
  //     openAiApiKey,
  //   );
  //   const newQuiz = addQuiz({ topicId: project.id });
  //   for (const question of generatedQuizQuestions) {
  //     addQuestion({
  //       label: question.label,
  //       answer: question.answer,
  //       type: question.type,
  //       quizId: newQuiz.id,
  //       options: question.options,
  //     });
  //   }
  // };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      updateResearch(project.id, { status: "in-progress", content: "" });
      setCurrentStatus("in-progress");
      clearEventLog(project.id);

      const result = await graph.invoke(
        {
          topic: `${project.topic}, ${project.subTopics.join(", ")}`,
        },
        {
          configurable: {
            researchLoopCount: project.maxResearchLoops,
            openAiApiKey: openAiApiKey ?? "",
            tavilyApiKey: tavilyApiKey ?? "",
            openAiModel: project.model,
          },
        },
      );
      updateResearch(project.id, {
        status: "completed",
        content: result.finalReport,
      });
      await Promise.all([
        handleGenerateFlashCards(result.finalReport),
        // handleGenerateQuiz(result.finalReport),
      ]);
      setCurrentStatus("completed");
      window.location.reload();
    } catch (error) {
      console.error("Error generating research:", error);
      updateResearch(project.id, { status: "failed" });
      setCurrentStatus("failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    updateResearch(project.id, { status: "pending", content: "" });
    clearEventLog(project.id);
    setCurrentStatus("pending");
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold capitalize">{project.topic}</h1>
            <StatusBadge status={project.status} />
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>Created: {format(project.createdAt, "MMMM dd yyyy")}</div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button> */}
          {project.content && (
            <>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset
              </Button>
            </>
          )}
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={
              isGenerating ||
              ["completed", "in-progress"].includes(currentStatus)
            }
          >
            {isGenerating ? (
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
