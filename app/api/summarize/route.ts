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

const FREE_MODELS = [
  "google/gemini-2.5-flash-free",
  "meta-llama/llama-3-8b-instruct:free",
  "mistralai/mistral-nemo-instruct-2407:free",
  "microsoft/phi-3-mini-128k-instruct:free",
  "qwen/qwen-2-7b-instruct:free",
  "huggingfaceh4/zephyr-7b-beta:free"
];

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
              `- ${f.test}: ${f.value} ${f.unit} (normal: ${f.normalRange}, ${f.direction}, ${f.severity} severity)`
          )
          .join("\n")
      : "None detected";

  const boostTerms = [sectionName, ...flags.map((f) => f.test)].filter(Boolean);
  const contextDocs = await retrieveMedicalContext(text, 5, 0.35, boostTerms);
  const contextText = contextDocs.length
    ? contextDocs
        .map(
          (doc, index) =>
            `Context ${index + 1}: ${doc.term} (${doc.category}) — ${doc.source}\n${doc.content}`
        )
        .join("\n\n")
    : "No relevant medical knowledge base context was found for this section.";

  const prompt = `You are a medical report explainer helping patients understand their results.

Medical Knowledge Base Context:
${contextText}

Section: ${sectionName}
Report text:
${text}

Pre-detected abnormal values (use ONLY these, do not invent others):
${flagText}

Instructions:
- Use only the provided medical knowledge base context and the report text.
- Explain in Grade 8 plain English so any patient understands.
- Mark abnormal values with [ABNORMAL] inline.
- Never diagnose, prescribe, or speculate.
- End with exactly 3 actionable next steps.

Respond ONLY as valid JSON:
{
  "summary_text": "plain English explanation",
  "abnormal_flags": [{ "test": "...", "value": 0, "unit": "...", "normalRange": "...", "severity": "mild|high", "direction": "high|low" }],
  "citations": [{ "source": "Clinical reference", "claim": "..." }],
  "next_steps": ["step 1", "step 2", "step 3"]
}`;

  let lastError = null;

  for (const model of FREE_MODELS) {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: "You are a medical report explainer. Always respond with valid JSON only.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      });

      const content = response.choices[0]?.message?.content ?? "{}";
      // Sometimes models wrap json inside ```json markdown blocks. Trim them.
      const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanContent) as SummaryResult;
      
      return {
        summary_text: parsed.summary_text ?? "No summary generated.",
        abnormal_flags: Array.isArray(parsed.abnormal_flags) ? parsed.abnormal_flags : flags,
        citations: Array.isArray(parsed.citations) ? parsed.citations : [],
        next_steps: Array.isArray(parsed.next_steps) ? parsed.next_steps : [],
      };
    } catch (err) {
      console.warn(`[Summarize] Model ${model} failed, falling back to next...`, err instanceof Error ? err.message : String(err));
      lastError = err;
      continue;
    }
  }

  // If ALL models fail
  console.error("[Summarize] All free models failed. Last error:", lastError);
  return {
    summary_text: `Summary for "${sectionName}" could not be generated. All AI models failed to respond correctly.`,
    abnormal_flags: flags,
    citations: [],
    next_steps: [
      "Review this section with your doctor.",
      "Ask your healthcare provider to explain any unfamiliar terms.",
      "Bring this report to your next appointment.",
    ],
  };
}

export async function POST(request: NextRequest) {
  const { user, error } = await requireSession();
  if (error) return error;

  const body: unknown = await request.json();
  const parsed = summarizeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
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
  const summaries = [];

  for (const chunk of chunks) {
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

    summaries.push({
      ...summary,
      abnormal_flags: result.abnormal_flags,
      citations: result.citations,
      next_steps: result.next_steps,
    });
  }

  await prisma.report.update({
    where: { id: reportId },
    data: { status: "COMPLETE" },
  });

  return NextResponse.json({ summaries });
}
