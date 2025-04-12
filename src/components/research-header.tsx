import { useState } from "react";
import { CheckCircle, Clock, HourglassIcon, Loader2Icon } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import type { Research, Source } from "@/hooks/use-store";
import { graph } from "@/lib/deep-research/agent/graph";
import useStore from "@/hooks/use-store";
import { formatAgentStep } from "@/lib/utils";

interface ResearchHeaderProps {
  project: Research;
}

export function ResearchHeader({ project }: ResearchHeaderProps) {
  const {
    deepSeekApiKey,
    tavilyApiKey,
    addEvent,
    updateResearch,
    clearEventLog,
  } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);

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
      const stream = await graph.stream(
        {
          researchTopic: project.topic,
          subTopics: project.subTopics,
          apiKey: deepSeekApiKey!,
          tavilyApiKey: tavilyApiKey!,
          maxResearchLoops: project.maxResearchLoops,
        },
        {
          streamMode: "updates" as const,
        },
      );
      for await (const event of stream) {
        console.log(JSON.stringify(event, null, 2));
        if ("finalizeSummary" in event) {
          updateResearch(project.id, {
            status: "completed",
            content: event?.finalizeSummary?.runningSummary as string,
            sources: event?.finalizeSummary?.sources as Source[],
          });
          clearEventLog(project.id);
          window.location.reload();
        } else {
          const data = formatAgentStep(event);
          addEvent(project.id, data);
        }
      }
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
            <Badge variant="outline" className={statusColors[project.status]}>
              <span className="flex items-center gap-1">
                {statusIcons[project.status]}
                {statusText[project.status]}
              </span>
            </Badge>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {project.subTopics?.map((topic, index) => (
              <Badge key={index} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>Created: {format(project.createdAt, "MMMM dd yyyy")}</div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button> */}
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating || project.status === "in-progress"}
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
