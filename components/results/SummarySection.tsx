"use client";

import { useState } from "react";
import { Languages, Loader2, RotateCcw } from "lucide-react";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { AbnormalFlagCard } from "@/components/results/AbnormalFlagCard";
import { CitationChip } from "@/components/results/CitationChip";
import { NextStepsList } from "@/components/results/NextStepsList";
import type { Summary } from "@/types";

interface SummarySectionProps {
  summary: Summary;
}

type Language = "hindi" | "marathi";

export function SummarySection({ summary }: SummarySectionProps) {
  const originalText =
    (summary as any).summaryText || (summary as any).summary_text || "";

  const [language, setLanguage] = useState<Language>("hindi");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState<string>("");

  async function handleTranslate() {
    if (!originalText) return;
    setIsTranslating(true);
    setTranslateError("");
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: originalText, language }),
      });
      const data = (await res.json()) as {
        translatedText?: string;
        error?: string;
      };
      if (!res.ok) {
        setTranslateError(data.error ?? "Translation failed");
      } else {
        setTranslatedText(data.translatedText ?? "");
      }
    } catch {
      setTranslateError("Network error — please try again.");
    } finally {
      setIsTranslating(false);
    }
  }

  function resetTranslation() {
    setTranslatedText("");
    setTranslateError("");
  }

  return (
    <AccordionItem value={summary.id}>
      <AccordionTrigger className="text-left font-semibold">
        {(summary as any).sectionName || (summary as any).section_name}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {originalText}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="inline-flex items-center rounded-lg border border-[#10b981]/30 bg-white/60 p-0.5">
              <button
                type="button"
                onClick={() => setLanguage("hindi")}
                disabled={isTranslating}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  language === "hindi"
                    ? "bg-[#10b981] text-white"
                    : "text-[#5a7080] hover:bg-[#10b981]/10"
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage("marathi")}
                disabled={isTranslating}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  language === "marathi"
                    ? "bg-[#10b981] text-white"
                    : "text-[#5a7080] hover:bg-[#10b981]/10"
                }`}
              >
                मराठी
              </button>
            </div>

            <button
              type="button"
              onClick={handleTranslate}
              disabled={isTranslating || !originalText}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2ab8c8] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#239ba9] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Translating…
                </>
              ) : (
                <>
                  <Languages className="h-3.5 w-3.5" />
                  Translate
                </>
              )}
            </button>

            {translatedText && !isTranslating && (
              <button
                type="button"
                onClick={resetTranslation}
                className="inline-flex items-center gap-1.5 rounded-lg border border-muted-foreground/20 px-3 py-1.5 text-xs font-medium text-[#5a7080] hover:bg-muted/50 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Show original
              </button>
            )}
          </div>

          {translateError && (
            <div className="text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {translateError}
            </div>
          )}

          {translatedText && (
            <div className="rounded-xl border border-[#10b981]/30 bg-[#10b981]/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#059669]">
                <Languages className="h-3.5 w-3.5" />
                {language === "hindi" ? "हिन्दी अनुवाद" : "मराठी भाषांतर"}
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-[#1a2340]">
                {translatedText}
              </p>
            </div>
          )}

          {((summary as any).abnormalFlags || (summary as any).abnormal_flags || []).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Abnormal Values
              </h4>
              <div className="space-y-2">
                {((summary as any).abnormalFlags || (summary as any).abnormal_flags || []).map((flag: any, i: number) => (
                  <AbnormalFlagCard key={i} flag={flag} />
                ))}
              </div>
            </div>
          )}

          {((summary as any).citations || []).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {((summary as any).citations || []).map((citation: any, i: number) => (
                  <CitationChip key={i} citation={citation} />
                ))}
              </div>
            </div>
          )}

          {((summary as any).nextSteps || (summary as any).next_steps || []).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recommended Next Steps
              </h4>
              <NextStepsList steps={((summary as any).nextSteps || (summary as any).next_steps || [])} />
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
