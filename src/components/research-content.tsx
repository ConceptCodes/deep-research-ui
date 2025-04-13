import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Markdown from "@/components/markdown";
import { EventLog } from "@/components/event-log";

import type { Research } from "@/hooks/use-store";

interface ResearchContentProps {
  project: Research;
}

export function ResearchContent({ project }: ResearchContentProps) {
  return project.status !== "completed" ? (
    <EventLog projectId={project.id} />
  ) : (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="sources" disabled={project.status !== "completed"}>
          Sources
        </TabsTrigger>
        {/* <TabsTrigger value="quiz">Quiz</TabsTrigger> */}
        {/* <TabsTrigger value="flash-cards">Flash Cards</TabsTrigger> */}
      </TabsList>

      <TabsContent value="summary" className="mt-4">
        <Card>
          <CardContent className="prose max-w-none">
            {project.status === "completed" && (
              <Markdown content={project.content} />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sources" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Sources</CardTitle>
            <CardDescription>
              References and materials used in this research
            </CardDescription>
          </CardHeader>
          <CardContent>
            {project?.sources && project.sources.length > 0 ? (
              <ul className="space-y-3">
                {project.sources.map((source, index) => (
                  <li
                    key={index}
                    className="border-b pb-3 last:border-0 last:pb-0"
                  >
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {source.title}
                    </a>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {source.url}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {project.status === "completed"
                  ? "No sources have been recorded for this research."
                  : "Sources will be available once the research is completed."}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* <TabsContent value="quiz" className="mt-4"></TabsContent> */}

      {/* <TabsContent value="flash-cards" className="mt-4"></TabsContent>  */}
    </Tabs>
  );
}
