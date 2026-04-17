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
        {(summary as any).sectionName || (summary as any).section_name}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {(summary as any).summaryText || (summary as any).summary_text}
            </p>
          </div>

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
