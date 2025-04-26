import React, { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Question } from "@/hooks/use-store";

interface QuizQuestionProps {
  question: Question;
  onAnswerChange: (questionId: number, answer: string) => void;
  initialAnswer?: string | null;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  onAnswerChange,
  initialAnswer,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState<string>(
    initialAnswer ?? "",
  );

  useEffect(() => {
    setCurrentAnswer(initialAnswer ?? "");
  }, [initialAnswer]);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const newValue = event.target.value;
    setCurrentAnswer(newValue);
    onAnswerChange(question.id, newValue);
  };

  const handleRadioChange = (value: string) => {
    setCurrentAnswer(value);
    onAnswerChange(question.id, value);
  };

  // --- Multiple Choice Parsing Logic ---
  const parseMultipleChoice = (label: string | null) => {
    if (!label) return { questionText: "", choices: [] };
    const lines = label.split("\n").map((line) => line.trim());
    const questionText = lines[0] ?? "";
    const choices = lines.slice(1).filter((line) => line);
    return { questionText, choices };
  };

  const { questionText, choices } =
    question.type === "multiple_choice"
      ? parseMultipleChoice(question.label)
      : { questionText: question.label || "", choices: [] };
  // --- End Parsing Logic ---

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{questionText}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {question.type === "multiple_choice" && (
            <RadioGroup
              value={currentAnswer}
              onValueChange={handleRadioChange}
              className="space-y-2"
            >
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={choice}
                    id={`q${question.id}-choice${index}`}
                  />
                  <Label htmlFor={`q${question.id}-choice${index}`}>
                    {choice}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "short_answer" && (
            <div>
              <Label htmlFor={`q${question.id}-answer`}>Your Answer</Label>
              <Textarea
                id={`q${question.id}-answer`}
                value={currentAnswer}
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
