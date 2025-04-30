import React from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Question } from "@/hooks/use-store";

interface QuizQuestionProps {
  question: Question;
  onAnswerChange: (questionId: number, answer: string) => void;
  currentSubmission: string | null | undefined;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswerChange,
  currentSubmission,
}) => {
  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const newValue = event.target.value;
    onAnswerChange(question.id, newValue);
  };

  const handleRadioChange = (value: string) => {
    onAnswerChange(question.id, value);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{question.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {question.type === "multiple_choice" && (
            <RadioGroup
              value={currentSubmission ?? ""}
              onValueChange={handleRadioChange}
              className="space-y-2"
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`q${question.id}-choice${index}`}
                  />
                  <Label htmlFor={`q${question.id}-choice${index}`}>
                    {option}
                  </Label>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">
                  Multiple choice options not implemented yet.
                </p>
              )}
            </RadioGroup>
          )}

          {question.type === "short_answer" && (
            <div>
              <Label htmlFor={`q${question.id}-answer`}>Your Answer</Label>
              <Textarea
                id={`q${question.id}-answer`}
                value={currentSubmission ?? ""}
                onChange={handleInputChange}
                placeholder="Type your answer here..."
                rows={4}
                className="mt-1"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
