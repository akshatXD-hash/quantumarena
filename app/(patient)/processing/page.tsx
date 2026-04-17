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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex justify-center">
          <div className="relative">
            <Activity className="h-12 w-12 text-primary animate-pulse" />
            <Loader2 className="absolute inset-0 h-12 w-12 text-primary/20 animate-spin" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Analysing your report</h2>
          <p className="text-muted-foreground text-sm">
            This usually takes 10–30 seconds
          </p>
        </div>

        <div className="space-y-3">
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${((stepIndex + 1) / STEPS.length) * 100}%`,
                animation: "indeterminate 1.5s ease-in-out infinite",
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {STEPS[stepIndex]}
            </span>
            <span>
              Step {stepIndex + 1} of {STEPS.length}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                i < stepIndex
                  ? "text-green-600"
                  : i === stepIndex
                  ? "text-foreground font-medium"
                  : "text-muted-foreground/40"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  i < stepIndex
                    ? "bg-green-500 border-green-500"
                    : i === stepIndex
                    ? "border-primary bg-primary/10"
                    : "border-muted"
                }`}
              >
                {i < stepIndex && (
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M1 4l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                )}
              </span>
              {step}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes indeterminate {
          0% { transform: translateX(-100%); width: 40%; }
          50% { transform: translateX(100%); width: 40%; }
          100% { transform: translateX(-100%); width: 40%; }
        }
      `}</style>
    </div>
  );
}
