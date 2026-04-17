"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Copy, RotateCcw, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
} from "@/components/ui/accordion";
import { DisclaimerBanner } from "@/components/layout/DisclaimerBanner";
import { SummarySection } from "@/components/results/SummarySection";
import { useReportStore } from "@/store/report-store";
import type { Summary } from "@/types";

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportIdParam = searchParams.get("reportId");

  const { rawText, summaries, filename, reset, setSummaries } = useReportStore();

  const [copied, setCopied] = useState(false);
  const [loadedSummaries, setLoadedSummaries] = useState<Summary[]>([]);
  const [loadedText, setLoadedText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reportIdParam) {
      setLoading(true);
      fetch(`/api/reports/${reportIdParam}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.summaries) {
            setLoadedSummaries(data.summaries);
            setLoadedText(data.raw_text ?? "");
          }
        })
        .finally(() => setLoading(false));
    } else if (!rawText && summaries.length === 0) {
      router.replace("/");
    }
  }, [reportIdParam, rawText, summaries.length, router]);

  const activeSummaries = reportIdParam ? loadedSummaries : summaries;
  const activeText = reportIdParam ? loadedText : rawText;

  function handleCopy() {
    const text = activeSummaries
      .map(
        (s) =>
          `## ${s.section_name}\n\n${s.summary_text}\n\n${
            s.next_steps.length
              ? "Next steps:\n" + s.next_steps.map((n, i) => `${i + 1}. ${n}`).join("\n")
              : ""
          }`
      )
      .join("\n\n---\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleNewReport() {
    reset();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-muted-foreground">Loading report...</div>
      </div>
    );
  }

  if (activeSummaries.length === 0 && !loading) {
    return null;
  }

  const defaultOpen = activeSummaries[0]?.id ?? "";

  return (
    <>
      <DisclaimerBanner />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Report Summary</h1>
            {filename && (
              <p className="text-sm text-muted-foreground mt-0.5">{filename}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <CheckCheck className="h-4 w-4 text-green-600" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy summary
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleNewReport}>
              <RotateCcw className="h-4 w-4" />
              New report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Original report
            </p>
            <div className="h-[calc(100vh-16rem)] rounded-lg border bg-muted/30 overflow-auto">
              <pre className="p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap text-foreground/80">
                {activeText || "No raw text available."}
              </pre>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Plain-English summary
            </p>
            <div className="h-[calc(100vh-16rem)] overflow-auto rounded-lg border bg-background p-4">
              <Accordion
                type="single"
                collapsible
                defaultValue={defaultOpen}
                className="space-y-1"
              >
                {activeSummaries.map((summary) => (
                  <SummarySection key={summary.id} summary={summary} />
                ))}
              </Accordion>

              <div className="mt-6 flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <CheckCheck className="h-4 w-4 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy full summary
                    </>
                  )}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={handleNewReport}
                >
                  <RotateCcw className="h-4 w-4" />
                  Start new report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
