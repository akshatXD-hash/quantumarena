/**
 * Probes each free model in the fallback chain to see which actually
 * respond on this OpenRouter key. Run: npx tsx scripts/probe-models.ts
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import OpenAI from "openai";

const MODELS = [
  "openai/gpt-oss-20b:free",
  "openai/gpt-oss-120b:free",
  "google/gemma-3-12b-it:free",
  "google/gemma-3-4b-it:free",
  "meta-llama/llama-3.2-3b-instruct:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "z-ai/glm-4.5-air:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "MediSumm Probe",
  },
});

async function probe(model: string, withJsonMode: boolean) {
  const t0 = Date.now();
  try {
    const res = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "Reply with valid JSON only." },
        {
          role: "user",
          content:
            'Respond with this exact JSON: {"summary_text":"hi","next_steps":["a","b","c"]}',
        },
      ],
      temperature: 0.1,
      max_tokens: 100,
      ...(withJsonMode
        ? { response_format: { type: "json_object" as const } }
        : {}),
    });
    const content = res.choices[0]?.message?.content ?? "";
    console.log(
      `OK   ${String(Date.now() - t0).padStart(5)}ms  ${withJsonMode ? "json" : "txt "}  ${model}`,
    );
    console.log(`     → ${content.slice(0, 100).replace(/\n/g, " ")}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(
      `FAIL ${String(Date.now() - t0).padStart(5)}ms  ${withJsonMode ? "json" : "txt "}  ${model}`,
    );
    console.log(`     → ${msg.slice(0, 200)}`);
  }
}

async function main() {
  console.log("Probing without response_format...\n");
  for (const m of MODELS) await probe(m, false);
  console.log("\nProbing WITH response_format: json_object...\n");
  for (const m of MODELS) await probe(m, true);
}

main();
