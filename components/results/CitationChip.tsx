"use client";

import { useState } from "react";
import { ExternalLink, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Citation } from "@/types";

interface CitationChipProps {
  citation: Citation;
}

export function CitationChip({ citation }: CitationChipProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="inline-flex flex-col gap-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium hover:bg-secondary/80 transition-colors"
      >
        <span>{citation.source}</span>
        {citation.url && <ExternalLink className="h-3 w-3" />}
        <ChevronDown className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")} />
      </button>
      {expanded && (
        <div className="ml-2 rounded-md bg-muted p-2 text-xs text-muted-foreground max-w-xs">
          <p>{citation.claim}</p>
          {citation.url && (
            <a
              href={citation.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              View source
            </a>
          )}
        </div>
      )}
    </div>
  );
}
