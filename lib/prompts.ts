import type { AbnormalFlag } from "@/types";

interface KBContext {
  term: string;
  content: string;
  source: string;
}

export function buildSummarizePrompt(
  sectionName: string,
  sectionText: string,
  abnormalFlags: AbnormalFlag[],
  kbContext: KBContext[]
): string {
  const flagsText =
    abnormalFlags.length > 0
      ? abnormalFlags
          .map(
            (f) =>
              `- ${f.test}: ${f.value} ${f.unit} (normal: ${f.normalRange}) [${f.direction.toUpperCase()}, ${f.severity} severity]`
          )
          .join("\n")
      : "None detected";

  const contextText =
    kbContext.length > 0
      ? kbContext
          .map((c) => `[${c.source}] ${c.term}: ${c.content}`)
          .join("\n")
      : "No additional context available";

  return `You are a medical report explainer. Your job is to explain a section of a medical report to a patient in plain English at a Grade 8 reading level.

SECTION NAME: ${sectionName}

REPORT TEXT:
${sectionText}

VERIFIED ABNORMAL VALUES (detected by a clinical reference system — use ONLY these, do not invent others):
${flagsText}

VERIFIED MEDICAL KNOWLEDGE BASE CONTEXT:
${contextText}

INSTRUCTIONS:
1. Explain the section in Grade 8 plain English so any patient can understand it.
2. Use ONLY the verified context above to explain medical terms. For any term not in the context, write exactly: "Ask your doctor about [term] — I don't have a verified explanation for this."
3. Mark every abnormal value with [ABNORMAL] inline next to the value.
4. Use ONLY the abnormal flags listed above — do not add your own.
5. Cite every explanation with its source name in parentheses.
6. Never diagnose, prescribe, or speculate about treatment.
7. End with exactly 3 actionable next steps the patient should consider.

Respond ONLY as valid JSON with this exact structure:
{
  "summary_text": "plain English explanation with [ABNORMAL] markers and citations",
  "abnormal_flags": [array of flagged values from the provided list],
  "citations": [{"source": "source name", "claim": "what was cited", "url": "optional url"}],
  "next_steps": ["step 1", "step 2", "step 3"]
}`;
}
