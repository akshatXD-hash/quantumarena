import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { chunkBySections } from "@/lib/section-chunker";
import { detectAbnormals } from "@/lib/abnormal-detector";
import { summarizeSchema } from "@/lib/validators";
import { retrieveMedicalContext } from "@/lib/rag";
import type { AbnormalFlag, SummaryResult } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    "X-Title": "MediSumm",
  },
});

// Models verified working on this OpenRouter key (see scripts/probe-models.ts).
// Ordered by speed + reliability. Most other "free" models are currently
// 429-rate-limited or 404 on this account. extractJSON() handles
// markdown-fenced output so json_mode isn't required.
const FREE_MODELS = [
  "openai/gpt-oss-20b:free",
  "openai/gpt-oss-120b:free",
  "z-ai/glm-4.5-air:free",
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
];

// Strip markdown fences, language tags, and surrounding prose to get
// the JSON object out of whatever the model returned.
function extractJSON(raw: string): string {
  let s = raw.trim();
  // Strip ```json ... ``` or ``` ... ``` fences
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  // Find the outermost {...} block
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first === -1 || last === -1 || last < first) return "{}";
  return s.slice(first, last + 1);
}

// Models sometimes use slightly different field names — coalesce them
// before falling back to the placeholder.
function pickSummary(parsed: Record<string, unknown>): string | null {
  const candidates = [
    parsed.summary_text,
    parsed.summary,
    parsed.explanation,
    parsed.text,
    parsed.plain_english,
    parsed.summaryText,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim().length > 0) return c.trim();
  }
  return null;
}

async function summarizeSection(
  sectionName: string,
  text: string,
  flags: AbnormalFlag[]
): Promise<SummaryResult> {
  const flagText =
    flags.length > 0
      ? flags
          .map(
            (f) =>
              `- ${f.test}: ${f.value} ${f.unit} (normal: ${f.normalRange})`
          )
          .join("\n")
      : "None";

  const boostTerms = [sectionName, ...flags.map((f) => f.test)].filter(Boolean);
  const contextDocs = await retrieveMedicalContext(text, 4, 0.35, boostTerms);
  const contextText = contextDocs.length
    ? contextDocs
        .map(
          (doc) =>
            `- ${doc.term}: ${doc.content.slice(0, 260).replace(/\n+/g, " ")}`
        )
        .join("\n")
    : "(none)";

  const prompt = `You are explaining one section of a medical report to a patient with NO medical background. Write like you're talking to a friend.

SECTION: ${sectionName}

REPORT TEXT:
${text}

ABNORMAL VALUES (use ONLY these — do not invent more):
${flagText}

BACKGROUND NOTES (use only if helpful):
${contextText}

WRITING RULES:
- 2 to 4 short sentences. Total under 80 words.
- Plain everyday English (Grade 6 reading level).
- Replace every medical term with its plain meaning. Examples: "high blood sugar" not "hyperglycemia"; "kidney filter rate" not "eGFR"; "good cholesterol" not "HDL".
- If a medical word MUST stay, put the plain meaning in parentheses right after it.
- Mark each abnormal value inline with [ABNORMAL] right after the number.
- No diagnosis, no prescriptions, no speculation. State the facts and what's outside normal range.
- End with exactly 3 short, simple action steps (each one sentence, action-first verb).

Respond ONLY with valid JSON in this exact shape:
{
  "summary_text": "the 2-4 sentence plain-English explanation",
  "abnormal_flags": [{ "test": "...", "value": 0, "unit": "...", "normalRange": "...", "severity": "mild|high", "direction": "high|low" }],
  "citations": [{ "source": "name", "claim": "what was used" }],
  "next_steps": ["step 1", "step 2", "step 3"]
}`;

  let lastError: unknown = null;

  for (const model of FREE_MODELS) {
    try {
      const response = await openai.chat.completions.create({
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
        // NOTE: do NOT set response_format here — gpt-oss-120b loops
        // infinitely when json_mode is enabled. extractJSON() handles
        // markdown fences and surrounding prose anyway.
      });

      const rawContent = response.choices[0]?.message?.content ?? "";
      const cleanContent = extractJSON(rawContent);

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(cleanContent) as Record<string, unknown>;
      } catch (parseErr) {
        console.warn(
          `[Summarize] ${model} returned unparseable JSON. First 200 chars:`,
          rawContent.slice(0, 200)
        );
        throw parseErr;
      }

      const summary = pickSummary(parsed);
      if (!summary) {
        console.warn(
          `[Summarize] ${model} returned JSON without a summary field. Keys:`,
          Object.keys(parsed)
        );
        throw new Error("Missing summary field");
      }

      return {
        summary_text: summary,
        abnormal_flags: Array.isArray(parsed.abnormal_flags)
          ? (parsed.abnormal_flags as AbnormalFlag[])
          : flags,
        citations: Array.isArray(parsed.citations)
          ? (parsed.citations as SummaryResult["citations"])
          : [],
        next_steps: Array.isArray(parsed.next_steps)
          ? (parsed.next_steps as string[])
          : Array.isArray(parsed.nextSteps)
            ? (parsed.nextSteps as string[])
            : [],
      };
    } catch (err) {
      console.warn(
        `[Summarize] Model ${model} failed:`,
        err instanceof Error ? err.message : String(err)
      );
      lastError = err;
      continue;
    }
  }

  console.error("[Summarize] All free models failed. Last error:", lastError);

  // Deterministic fallback so the user always sees something useful even
  // when every LLM is rate-limited / down. Built from the abnormal flags
  // (already detected in plain TS) and a short snippet of the section text.
  const flagSummary =
    flags.length > 0
      ? `We found ${flags.length} value${flags.length === 1 ? "" : "s"} outside the normal range: ${flags
          .map(
            (f) =>
              `${f.test} ${f.value}${f.unit} [ABNORMAL] (normal ${f.normalRange})`
          )
          .join("; ")}.`
      : "No values outside the normal range were detected in this section.";

  const snippet = text.replace(/\s+/g, " ").trim().slice(0, 220);

  return {
    summary_text: `${flagSummary} The report says: "${snippet}${text.length > 220 ? "…" : ""}". Our AI helper is busy right now — please review the details with your doctor.`,
    abnormal_flags: flags,
    citations: [],
    next_steps: [
      "Share this section with your doctor at your next visit.",
      "Ask your doctor to explain any words or numbers you don't understand.",
      "Try generating the AI summary again in a few minutes.",
    ],
  };
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireSession();
  if (error) return error;

  const body: unknown = await request.json();
  const parsed = summarizeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { reportId, text } = parsed.data;

  const report = await prisma.report.findFirst({
    where: {
      id: reportId,
      ...(user.role !== "ADMIN" ? { userId: user.id } : {}),
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  const chunks = chunkBySections(text);

  // Process all sections in parallel — the previous sequential loop made
  // a 5-section report wait ~5x as long as it needed to. Each section's
  // RAG embed + LLM call is independent.
  const summaries = await Promise.all(
    chunks.map(async (chunk) => {
      const flags = detectAbnormals(chunk.text);
      const result = await summarizeSection(chunk.sectionName, chunk.text, flags);

      const summary = await prisma.summary.create({
        data: {
          reportId,
          sectionName: chunk.sectionName,
          summaryText: result.summary_text,
          abnormalFlags: result.abnormal_flags as object[],
          citations: result.citations as object[],
          nextSteps: result.next_steps,
        },
      });

      return {
        ...summary,
        abnormal_flags: result.abnormal_flags,
        citations: result.citations,
        next_steps: result.next_steps,
      };
    })
  );

  await prisma.report.update({
    where: { id: reportId },
    data: { status: "COMPLETE" },
  });

  return NextResponse.json({ summaries });
}
