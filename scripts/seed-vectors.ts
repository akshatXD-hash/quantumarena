/**
 * Builds data/kb-embeddings.json from data/seed.ts.
 *
 * - Flattens each disease entry into multiple per-field chunks so retrieval
 *   pulls just the relevant slice (e.g. "labValues" for an HbA1c question)
 *   instead of a whole 3 KB record.
 * - Embeds each chunk with `openai/text-embedding-3-small` via OpenRouter
 *   (1536-dim, matches the cosine search in lib/rag.ts).
 * - Batches 64 chunks per API call to stay well under request size limits.
 * - Idempotent: rerunning overwrites data/kb-embeddings.json.
 *
 * Run: npm run seed:rag
 */

import { config as loadEnv } from "dotenv";
import { promises as fs } from "fs";
import path from "path";
import OpenAI from "openai";
import medicalData from "../data/seed";

loadEnv({ path: ".env.local" });
loadEnv();

const EMBED_MODEL = "openai/text-embedding-3-small";
const BATCH_SIZE = 64;
const OUT_PATH = path.join(process.cwd(), "data", "kb-embeddings.json");

if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY in .env.local");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    "X-Title": "MediSumm KB Build",
  },
});

type Chunk = {
  term: string;
  category: string;
  source: string;
  content: string;
  metadata: Record<string, unknown>;
};

type EmbeddedChunk = Chunk & { embedding: number[] };

type DiseaseEntry = {
  id: string;
  disease: string;
  icd10?: string;
  category: string;
  overview?: string;
  causes?: string[];
  riskFactors?: string[];
  symptoms?: string[];
  labValues?: Record<string, string>;
  diagnosis?: string[];
  treatments?: string[];
  prevention?: string[];
  complications?: string[];
  whenToSeeDoctor?: string;
  sources?: string[];
};

function primarySource(entry: DiseaseEntry): string {
  return entry.sources?.[0] ?? "Curated Medical Reference";
}

function flatten(entries: DiseaseEntry[]): Chunk[] {
  const chunks: Chunk[] = [];

  for (const e of entries) {
    const base = {
      source: primarySource(e),
      metadata: {
        id: e.id,
        disease: e.disease,
        icd10: e.icd10 ?? null,
        category: e.category,
        sources: e.sources ?? [],
      },
    };

    if (e.overview) {
      chunks.push({
        ...base,
        term: e.disease,
        category: "glossary",
        content: `${e.disease} — Overview: ${e.overview}`,
      });
    }

    if (e.icd10) {
      chunks.push({
        ...base,
        term: e.icd10,
        category: "icd10",
        content: `ICD-10 ${e.icd10} — ${e.disease}. ${e.overview ?? ""}`.trim(),
      });
    }

    if (e.symptoms?.length) {
      chunks.push({
        ...base,
        term: `${e.disease} symptoms`,
        category: "glossary",
        content: `${e.disease} — Common symptoms:\n- ${e.symptoms.join("\n- ")}`,
      });
    }

    if (e.causes?.length || e.riskFactors?.length) {
      const parts: string[] = [];
      if (e.causes?.length) parts.push(`Causes:\n- ${e.causes.join("\n- ")}`);
      if (e.riskFactors?.length)
        parts.push(`Risk factors:\n- ${e.riskFactors.join("\n- ")}`);
      chunks.push({
        ...base,
        term: `${e.disease} causes & risk factors`,
        category: "glossary",
        content: `${e.disease} — ${parts.join("\n\n")}`,
      });
    }

    if (e.labValues && typeof e.labValues === "object") {
      for (const [test, range] of Object.entries(e.labValues)) {
        chunks.push({
          ...base,
          term: test,
          category: "lab_range",
          content: `${test} (in context of ${e.disease}): ${range}`,
        });
      }
    }

    if (e.diagnosis?.length) {
      chunks.push({
        ...base,
        term: `${e.disease} diagnosis`,
        category: "procedure",
        content: `${e.disease} — Diagnostic workup:\n- ${e.diagnosis.join("\n- ")}`,
      });
    }

    if (e.treatments?.length) {
      chunks.push({
        ...base,
        term: `${e.disease} treatments`,
        category: "drug",
        content: `${e.disease} — Treatment options:\n- ${e.treatments.join("\n- ")}`,
      });
    }

    if (e.prevention?.length) {
      chunks.push({
        ...base,
        term: `${e.disease} prevention`,
        category: "glossary",
        content: `${e.disease} — Prevention:\n- ${e.prevention.join("\n- ")}`,
      });
    }

    if (e.complications?.length) {
      chunks.push({
        ...base,
        term: `${e.disease} complications`,
        category: "glossary",
        content: `${e.disease} — Possible complications:\n- ${e.complications.join("\n- ")}`,
      });
    }

    if (e.whenToSeeDoctor) {
      chunks.push({
        ...base,
        term: `${e.disease} when to see a doctor`,
        category: "glossary",
        content: `${e.disease} — When to see a doctor: ${e.whenToSeeDoctor}`,
      });
    }
  }

  return chunks;
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: EMBED_MODEL,
    input: texts,
  });
  return res.data.map((d) => d.embedding as number[]);
}

async function main() {
  const entries = medicalData as DiseaseEntry[];
  console.log(`Loaded ${entries.length} disease entries from data/seed.ts`);

  const chunks = flatten(entries);
  console.log(`Flattened to ${chunks.length} retrievable chunks`);

  const embedded: EmbeddedChunk[] = [];
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const inputs = batch.map((c) => c.content.slice(0, 8000));
    process.stdout.write(
      `Embedding batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
        chunks.length / BATCH_SIZE,
      )} (${batch.length} chunks)... `,
    );
    const t0 = Date.now();
    const vectors = await embedBatch(inputs);
    console.log(`${Date.now() - t0}ms`);

    if (vectors.length !== batch.length) {
      throw new Error(
        `Embedding count mismatch: got ${vectors.length}, expected ${batch.length}`,
      );
    }

    batch.forEach((c, idx) => {
      embedded.push({ ...c, embedding: vectors[idx] });
    });
  }

  const dim = embedded[0]?.embedding.length ?? 0;
  console.log(`Embedded ${embedded.length} chunks, dim=${dim}`);

  await fs.writeFile(OUT_PATH, JSON.stringify(embedded));
  const stat = await fs.stat(OUT_PATH);
  console.log(
    `Wrote ${OUT_PATH} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`,
  );
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
