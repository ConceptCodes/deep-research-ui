import { useState } from "react";
import {
  CheckCircle,
  Clock,
  Download,
  HourglassIcon,
  Loader2Icon,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { graph } from "@/lib/deep-research/agent/graph";
import type { Research } from "@/hooks/use-store";
import useStore from "@/hooks/use-store";

interface ResearchHeaderProps {
  project: Research;
}

export function ResearchHeader({ project }: ResearchHeaderProps) {
  const { getOpenAiApiKey, getTavilyApiKey, updateResearch, clearEventLog } =
    useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(project.status);

  const statusIcons = {
    completed: <CheckCircle className="h-5 w-5 text-green-500" />,
    "in-progress": <Clock className="h-5 w-5 text-amber-500" />,
    pending: <HourglassIcon className="h-5 w-5 text-blue-500" />,
    failed: <Clock className="h-5 w-5 text-red-500" />,
  };

  const statusText = {
    completed: "Completed",
    "in-progress": "In Progress",
    pending: "Pending",
    failed: "Failed",
  };

  const statusColors = {
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "in-progress":
      "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      updateResearch(project.id, { status: "in-progress" });
      setCurrentStatus("in-progress");

      const result = await graph.invoke(
        {
          topic: `${project.topic}, ${project.subTopics.join(", ")}`,
        },
        {
          configurable: {
            researchLoopCount: project.maxResearchLoops,
            openAiApiKey: getOpenAiApiKey() ?? "",
            tavilyApiKey: getTavilyApiKey() ?? "",
            openAiModel: project.model,
          },
        },
      );
      updateResearch(project.id, {
        status: "completed",
        content: result.finalReport,
      });
      setCurrentStatus("completed");
      window.location.reload();
    } catch (error) {
      console.error("Error generating research:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    updateResearch(project.id, { status: "pending", content: "" });
    clearEventLog(project.id);
    window.location.reload();
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold capitalize">{project.topic}</h1>
            <Badge variant="outline" className={statusColors[currentStatus]}>
              <span className="flex items-center gap-1">
                {statusIcons[currentStatus]}
                {statusText[currentStatus]}
              </span>
            </Badge>
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
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating || currentStatus === "in-progress"}
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
