import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Markdown from "@/components/markdown";
import { EventLog } from "@/components/event-log";

import { FlashCard } from "./flash-card";
import { QuizQuestion } from "./quiz-question";
import { Button } from "./ui/button";

import useStore, { type Research } from "@/hooks/use-store";
import { gradeQuiz } from "@/lib/quiz";

interface ResearchContentProps {
  project: Research;
}

export function ResearchContent({ project }: ResearchContentProps) {
  const { getQuiz, getFlashcardsByTopicId, updateQuestion, openAiApiKey } =
    useStore();
  // const quiz = getQuiz(project.id);
  const flashCards = getFlashcardsByTopicId(project.id);

  // const handleAnswerChange = (questionId: number, answer: string) => {
  //   updateQuestion(questionId, {
  //     submission: answer,
  //   });
  // };

  // const handleQuizSubmit = async () => {
  //   const results = await gradeQuiz(
  //     project.content,
  //     quiz?.questions,
  //     project.model,
  //     openAiApiKey,
  //   );
  //   console.log(results);
  // };

  return project.status !== "completed" ? (
    <EventLog projectId={project.id} />
  ) : (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        {/* <TabsTrigger value="quiz">Quiz</TabsTrigger> */}
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

      {/* <TabsContent value="quiz" className="mt-4">
        {quiz && (
          <>
            <div className="grid grid-cols-1 gap-4">
              {quiz.questions.map((question) => (
                <QuizQuestion
                  key={question.id}
                  question={question}
                  onAnswerChange={handleAnswerChange}
                />
              ))}
            </div>
            <Button onClick={handleQuizSubmit} className="mt-4">
              Submit Quiz
            </Button>
          </>
        )}
      </TabsContent> */}

      <TabsContent value="flash-cards" className="mt-4">
        {flashCards && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {flashCards.map((flashCard) => (
              <FlashCard
                key={flashCard.id}
                question={flashCard.question!}
                answer={flashCard.answer!}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
