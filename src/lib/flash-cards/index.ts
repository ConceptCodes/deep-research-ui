import { z } from "zod";
import { getLLM } from "../utils";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export const outputSchema = z.object({
  flashcards: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
});

const prompt = (source: string | null) =>
  `Create a set of flashcard with a question and answer based on the following source material: "${source}"`;

export const generateFlashCards = async (
  source: string | null,
  model: string,
  apiKey: string | null,
): Promise<{ question: string; answer: string }[]> => {
  if (!source) {
    throw new Error("Source is required");
  }

  if (!apiKey) {
    throw new Error("API key is required");
  }

  const llm = getLLM(apiKey, model);

  const structuredLLM = llm.withStructuredOutput(outputSchema);

  const { flashcards } = await structuredLLM.invoke([
    new SystemMessage({ content: prompt(source) }),
    new HumanMessage({ content: "Generate flashcards:" }),
  ]);

  return flashcards;
};
