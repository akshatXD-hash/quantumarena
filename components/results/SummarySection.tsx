"use client";

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

export function SummarySection({ summary }: SummarySectionProps) {
  return (
    <AccordionItem value={summary.id}>
      <AccordionTrigger className="text-left font-semibold">
        {summary.section_name}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {summary.summary_text}
            </p>
          </div>

          {summary.abnormal_flags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Abnormal Values
              </h4>
              <div className="space-y-2">
                {summary.abnormal_flags.map((flag, i) => (
                  <AbnormalFlagCard key={i} flag={flag} />
                ))}
              </div>
            </div>
          )}

          {summary.citations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {summary.citations.map((citation, i) => (
                  <CitationChip key={i} citation={citation} />
                ))}
              </div>
            </div>
          )}

          {summary.next_steps.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recommended Next Steps
              </h4>
              <NextStepsList steps={summary.next_steps} />
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
