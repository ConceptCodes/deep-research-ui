import { Calendar } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Research } from "@/hooks/use-store";
import { Badge } from "./ui/badge";

interface ResearchSidebarProps {
  project: Research;
}

export function ResearchSidebar({ project }: ResearchSidebarProps) {
  return (
    <div className="space-y-6">
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
            <Badge className="w-fit">
              {project.model}
            </Badge>
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
            {/* <Separator className="my-2" />
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
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
