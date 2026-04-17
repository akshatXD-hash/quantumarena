import OpenAI from "openai";
import { prisma } from "./prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function retrieveMedicalContext(text: string, topK = 5) {
  // 1. Embed input text
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });

  // 2. Query Prisma with vector similarity
  const result = await prisma.$queryRaw<
    Array<{
      id: bigint;
      content: string;
      category: string;
      source: string;
      term: string;
      metadata: any;
      created_at: Date;
    }>
  >`
    SELECT id, content, category, source, term, metadata, created_at
    FROM medical_kb
    WHERE embedding <=> ${embedding.data[0].embedding} < 0.3
    ORDER BY embedding <=> ${embedding.data[0].embedding}
    LIMIT ${topK}
  `;

  return result;
}