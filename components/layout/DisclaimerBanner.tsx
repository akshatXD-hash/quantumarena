"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface DisclaimerBannerProps {
  dismissable?: boolean;
}

export function DisclaimerBanner({ dismissable = false }: DisclaimerBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-[#10b981]/10 backdrop-blur-xl border-b border-[#10b981]/20 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[#059669]">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">
            MediSumm is for educational purposes only. Always consult a licensed healthcare professional.
          </p>
        </div>
        {dismissable && (
          <button
            onClick={() => setDismissed(true)}
            className="text-[#059669] hover:text-[#047857] transition-colors shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
