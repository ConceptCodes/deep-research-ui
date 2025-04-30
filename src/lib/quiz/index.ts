import { z } from "zod";
import { getLLM } from "../utils";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { Question, QuestionType } from "@/hooks/use-store";

export const generateQuestionsOutputSchema = z.object({
  questions: z.array(
    z.object({
      label: z.string(),
      answer: z.string(),
      type: z.enum(["multiple_choice", "short_answer"]),
      options: z.array(z.string()).optional(),
    }),
  ),
});

const generateQuestionsPrompt = (source: string | null) =>
  `Create a set of quiz questions with their answers based on the following source material: "${source}"`;

export const generateQuizQuestions = async (
  source: string | null,
  model: string,
  apiKey: string | null,
): Promise<
  Array<{ label: string; answer: string; type: QuestionType; options: string[] }>
> => {
  if (!source) {
    throw new Error("Source is required");
  }

  if (!apiKey) {
    throw new Error("API key is required");
  }

  const llm = getLLM(apiKey, model);

  const structuredLLM = llm.withStructuredOutput(generateQuestionsOutputSchema);

  const { questions } = await structuredLLM.invoke([
    new SystemMessage({ content: generateQuestionsPrompt(source) }),
    new HumanMessage({ content: "Generate quiz questions:" }),
  ]);

  return questions;
};

export const breakdownOutputSchema = z.object({
  score: z.number(),
  feedback: z.string(),
});

const gradeQuizPrompt = (
  source: string | null,
  results: Question[] | undefined,
) =>
  `Grade the following quiz based on the source material: "${source}". 
The quiz questions and answers are as follows: ${JSON.stringify(results, null, 2)}`;

export const gradeQuiz = async (
  source: string | null,
  results: Question[] | undefined,
  model: string,
  apiKey: string | null,
): Promise<Question[]> => {
  if (!source) {
    throw new Error("Source is required");
  }

  if (!apiKey) {
    throw new Error("API key is required");
  }

  const llm = getLLM(apiKey, model);

  const structuredLLM = llm.withStructuredOutput(breakdownOutputSchema);

  const result = await structuredLLM.invoke([
    new SystemMessage({ content: gradeQuizPrompt(source, results) }),
    new HumanMessage({ content: "Grade the quiz:" }),
  ]);

  return result;
};
