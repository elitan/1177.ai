import { openai } from "./openai";

export async function generateEmbedding(text: string) {
  return await openai.embeddings.create({
    input: text,
    model: "text-embedding-ada-002",
  });
}
