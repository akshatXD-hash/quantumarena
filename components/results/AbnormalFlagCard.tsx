import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AbnormalFlag } from "@/types";

interface AbnormalFlagCardProps {
  flag: AbnormalFlag;
}

export function AbnormalFlagCard({ flag }: AbnormalFlagCardProps) {
  return (
    <div className={cn(
      "rounded-md border p-3 flex items-start gap-3",
      flag.severity === "high"
        ? "bg-red-50 border-red-200"
        : "bg-orange-50 border-orange-200"
    )}>
      <AlertTriangle className={cn(
        "h-4 w-4 mt-0.5 shrink-0",
        flag.severity === "high" ? "text-red-600" : "text-orange-500"
      )} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm">{flag.test}</span>
          <Badge variant="destructive" className="text-xs py-0">ABNORMAL</Badge>
          <Badge
            variant={flag.severity === "high" ? "destructive" : "warning"}
            className="text-xs py-0"
          >
            {flag.severity === "high" ? "High severity" : "Mild"}
          </Badge>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {flag.value} {flag.unit}
          </span>
          <span className="mx-1">—</span>
          <span className={flag.direction === "high" ? "text-red-600" : "text-blue-600"}>
            {flag.direction === "high" ? "Above" : "Below"} normal range
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Normal: {flag.normalRange}
        </p>
      </div>
    </div>
  );
}
