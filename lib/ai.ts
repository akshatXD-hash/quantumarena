import Anthropic from "@anthropic-ai/sdk";
import type { AbnormalFlag, SummaryResult } from "@/types";
import { buildSummarizePrompt } from "@/lib/prompts";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface KBContext {
  term: string;
  content: string;
  source: string;
}

export async function summarizeChunk(
  sectionName: string,
  sectionText: string,
  abnormalFlags: AbnormalFlag[],
  kbContext: KBContext[] = []
): Promise<SummaryResult> {
  const _prompt = buildSummarizePrompt(
    sectionName,
    sectionText,
    abnormalFlags,
    kbContext
  );

  void anthropic;

  return {
    summary_text: `This is a mock summary for the "${sectionName}" section. In production, this will be replaced with an AI-generated plain-English explanation of your medical report. ${
      abnormalFlags.length > 0
        ? `${abnormalFlags.length} abnormal value(s) were detected: ${abnormalFlags.map((f) => `${f.test} [ABNORMAL]`).join(", ")}.`
        : "No abnormal values were detected in this section."
    } Always consult your healthcare provider to discuss these results.`,
    abnormal_flags: abnormalFlags,
    citations: [
      {
        source: "MediSumm Clinical Reference",
        claim: "Reference ranges sourced from standard clinical guidelines",
      },
    ],
    next_steps: [
      "Schedule a follow-up appointment with your doctor to review these results.",
      "Bring a printed copy of this report to your next medical visit.",
      "Write down any questions you have about your results before seeing your doctor.",
    ],
  };
}
