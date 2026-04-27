"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Activity } from "lucide-react";
import { useReportStore } from "@/store/report-store";

const STEPS = [
  "Extracting text",
  "Identifying sections",
  "Analysing lab values",
  "Generating summary",
  "Flagging abnormals",
  "Compiling citations",
];

export default function ProcessingPage() {
  const router = useRouter();
  const { isProcessing, rawText } = useReportStore();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!rawText && !isProcessing) {
      router.replace("/");
    }
  }, [rawText, isProcessing, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-bg flex items-center justify-center px-4">
      <div className="page-blob-tl" />
      <div className="page-blob-br" />

      <div className="w-full max-w-sm space-y-8 text-center relative z-10">
        <div className="flex justify-center">
          <div className="relative w-20 h-20 glass rounded-[1.5rem] flex items-center justify-center">
            <Activity className="h-10 w-10 text-[#2ab8c8] animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto h-16 w-16 text-[#2ab8c8]/15 animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-['Sora'] text-xl font-semibold text-[#1a2340]">Analysing your report</h2>
          <p className="text-[#5a7080] text-sm">
            This usually takes 10–30 seconds
          </p>
        </div>

        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="h-2 w-full bg-[#f0f4f8] rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{
                width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#5a7080]">
            <span className="font-medium text-[#1a2340]">
              {STEPS[stepIndex]}
            </span>
            <span>
              Step {stepIndex + 1} of {STEPS.length}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {STEPS.map((step, i) => (
              <div
                key={step}
                className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${
                  i < stepIndex
                    ? "text-[#10b981]"
                    : i === stepIndex
                    ? "text-[#1a2340] font-medium"
                    : "text-[#8a9aaa]/60"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    i < stepIndex
                      ? "bg-[#10b981] border-[#10b981]"
                      : i === stepIndex
                      ? "border-[#2ab8c8] bg-[#2ab8c8]/10"
                      : "border-[#d1d5db]"
                  }`}
                >
                  {i < stepIndex && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <path d="M1 4l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  )}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
