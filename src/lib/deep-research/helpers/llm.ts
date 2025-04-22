import { ChatOpenAI } from "@langchain/openai";

export const getLLM = (apiKey: string, model: string) => {
  return new ChatOpenAI({
    modelName: model,
    temperature: 0,
    openAIApiKey: apiKey,
  });
};
