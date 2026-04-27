import OpenAI from "openai";
import kbRaw from "@/data/kb-embeddings.json";

type RawKBRow = {
  term: string;
  category: string;
  source: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding: number[];
};

type KBRow = Omit<RawKBRow, "embedding"> & { embedding: Float32Array };

const KB: KBRow[] = (kbRaw as RawKBRow[]).map((r) => ({
  ...r,
  embedding: Float32Array.from(r.embedding),
}));

const EMBED_DIM = KB[0]?.embedding.length ?? 0;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    "X-Title": "MediSumm RAG",
  },
});

function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  const len = a.length;
  for (let i = 0; i < len; i++) {
    const av = a[i];
    const bv = b[i];
    dot += av * bv;
    na += av * av;
    nb += bv * bv;
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export type RetrievedContext = {
  term: string;
  category: string;
  source: string;
  content: string;
  metadata: Record<string, unknown>;
  score: number;
};

/**
 * Embed `text` (plus optional boost terms) and return the topK most similar
 * KB chunks, filtered by minScore. Failures return [] so the summarize path
 * survives an embedding outage — the prompt builder handles empty context.
 */
export async function retrieveMedicalContext(
  text: string,
  topK = 5,
  minScore = 0.35,
  boostTerms: string[] = [],
): Promise<RetrievedContext[]> {
  if (KB.length === 0) return [];

  const query = boostTerms.length
    ? `${boostTerms.join(", ")}\n\n${text}`
    : text;

  let queryVec: Float32Array;
  try {
    const res = await openai.embeddings.create({
      model: "openai/text-embedding-3-small",
      input: query.slice(0, 8000),
    });
    const raw = res.data[0]?.embedding as number[] | undefined;
    if (!raw || raw.length !== EMBED_DIM) {
      console.warn(
        `[RAG] Embedding dim mismatch (got ${raw?.length}, expected ${EMBED_DIM})`,
      );
      return [];
    }
    queryVec = Float32Array.from(raw);
  } catch (err) {
    console.warn("[RAG] Embedding call failed, skipping retrieval:", err);
    return [];
  }

  const scored: RetrievedContext[] = new Array(KB.length);
  for (let i = 0; i < KB.length; i++) {
    const row = KB[i];
    scored[i] = {
      term: row.term,
      category: row.category,
      source: row.source,
      content: row.content,
      metadata: row.metadata,
      score: cosine(queryVec, row.embedding),
    };
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).filter((r) => r.score >= minScore);
}
