import { BookOpen, Calendar, Clock, FileText, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import type { Research } from "@/hooks/use-store";

interface ResearchSidebarProps {
  project: Research;
}

export function ResearchSidebar({ project }: ResearchSidebarProps) {
  const getProgress = () => {
    switch (project.status) {
      case "completed":
        return 100;
      case "in-progress":
        return 30;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Research Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={getProgress()} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Status: {project.status}
              </span>
              <span className="font-medium">{getProgress()}%</span>
            </div>

            {project.status !== "completed" && (
              <Button className="mt-2 w-full" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Update Status
              </Button>
            )}
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Research Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {format(project.createdAt, "MMMM dd yyyy")}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Estimated Time</p>
                <p className="text-sm text-muted-foreground">
                  {project.status === "completed"
                    ? "Completed"
                    : "15-20 minutes"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Content Stats</p>
                <div className="text-sm text-muted-foreground">
                  <p>
                    Summary:{" "}
                    {project.content
                      ? `${project.content.length} chars`
                      : "N/A"}
                  </p>
                  <p>Sources: {project.sources ? project.sources.length : 0}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Related Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {project.subTopics?.map((topic, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="mb-2 mr-2 capitalize"
              >
                {topic}
              </Button>
            ))}

            {/* Additional suggested topics */}
            <Separator className="my-2" />
            <p className="mb-2 text-sm text-muted-foreground">
              Suggested related topics:
            </p>
            <Button variant="ghost" size="sm" className="mb-2 mr-2">
              Sustainability
            </Button>
            <Button variant="ghost" size="sm" className="mb-2 mr-2">
              Carbon Emissions
            </Button>
            <Button variant="ghost" size="sm" className="mb-2 mr-2">
              Renewable Energy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
