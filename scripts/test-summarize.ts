/**
 * End-to-end test of the summarize pipeline (no DB, no auth).
 * Run: npx tsx scripts/test-summarize.ts
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

import OpenAI from "openai";

const FREE_MODELS = [
  "openai/gpt-oss-20b:free",
  "openai/gpt-oss-120b:free",
  "z-ai/glm-4.5-air:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

function extractJSON(raw: string): string {
  let s = raw.trim();
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) return "{}";
  return s.slice(first, last + 1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "MediSumm Test",
  },
});

const prompt = `You are explaining one section of a medical report to a patient with NO medical background. Write like you're talking to a friend.

SECTION: Lab Results

REPORT TEXT:
HbA1c: 8.2% (normal 4.0-5.6). Fasting glucose: 168 mg/dL (normal 70-99). Patient reports increased thirst and frequent urination.

ABNORMAL VALUES (use ONLY these — do not invent more):
- HbA1c: 8.2 % (normal: 4.0-5.6)
- fasting glucose: 168 mg/dL (normal: 70-99)

BACKGROUND NOTES (use only if helpful):
- HbA1c: ≥ 6.5% indicates diabetes; 5.7–6.4% indicates prediabetes
- fastingGlucose: ≥ 126 mg/dL on two separate occasions

WRITING RULES:
- 2 to 4 short sentences. Total under 80 words.
- Plain everyday English (Grade 6 reading level).
- Replace every medical term with its plain meaning.
- Mark each abnormal value inline with [ABNORMAL] right after the number.
- No diagnosis, no prescriptions, no speculation.
- End with exactly 3 short, simple action steps.

Respond ONLY with valid JSON in this exact shape:
{
  "summary_text": "the 2-4 sentence plain-English explanation",
  "abnormal_flags": [],
  "citations": [],
  "next_steps": ["step 1", "step 2", "step 3"]
}`;

async function main() {
  for (const model of FREE_MODELS) {
    const t0 = Date.now();
    try {
      const res = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You translate medical reports into plain language for non-medical readers. Always reply with valid JSON only. No prose, no markdown fences. Be brief.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 600,
      });
      const raw = res.choices[0]?.message?.content ?? "";
      const clean = extractJSON(raw);
      const parsed = JSON.parse(clean);
      console.log(`\n=== ${model} (${Date.now() - t0}ms) ===`);
      console.log("summary_text:", parsed.summary_text);
      console.log("next_steps:  ", parsed.next_steps);
      return; // first success wins
    } catch (err) {
      console.log(
        `FAIL ${model} (${Date.now() - t0}ms):`,
        err instanceof Error ? err.message.slice(0, 150) : String(err),
      );
    }
  }
  console.log("\nAll models failed.");
}

main();
