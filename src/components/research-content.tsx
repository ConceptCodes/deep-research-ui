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
import { useState } from "react";

import useStore, { type Quiz, type Research } from "@/hooks/use-store";
import { Button } from "./ui/button";

interface ResearchContentProps {
  project: Research;
}

export function ResearchContent({ project }: ResearchContentProps) {
  const { getQuiz } = useStore();
  const [quiz, setQuiz] = useState<Quiz | null>(getQuiz(project.id));

  return project.status !== "completed" ? (
    <EventLog projectId={project.id} />
  ) : (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
        <TabsTrigger value="flash-cards">Flash Cards</TabsTrigger>
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

      <TabsContent value="quiz" className="mt-4">
        {!!quiz && <Button>Generate Quiz</Button>}
      </TabsContent>

      <TabsContent value="flash-cards" className="mt-4"></TabsContent>
    </Tabs>
  );
}
