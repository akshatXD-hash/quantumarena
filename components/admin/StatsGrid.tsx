import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, AlertTriangle, TrendingUp } from "lucide-react";
import type { AdminStats } from "@/types";

interface StatsGridProps {
  stats: AdminStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const cards = [
    {
      title: "Total Reports",
      value: stats.total_reports.toLocaleString(),
      subtitle: `${stats.reports_today} today`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Reports This Week",
      value: stats.reports_this_week.toLocaleString(),
      subtitle: "Last 7 days",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Total Patients",
      value: stats.total_patients.toLocaleString(),
      subtitle: "Registered accounts",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Abnormal Flags",
      value: stats.total_abnormal_flags.toLocaleString(),
      subtitle: "Across all reports",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
