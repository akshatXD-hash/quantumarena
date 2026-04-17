import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { AdminStats } from "@/types";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalReports,
    reportsToday,
    reportsThisWeek,
    totalPatients,
    totalSummaries,
    byStatus,
    byType,
    summariesWithFlags,
  ] = await Promise.all([
    prisma.report.count(),
    prisma.report.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.report.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.summary.count(),
    prisma.report.groupBy({ by: ["status"], _count: true }),
    prisma.report.groupBy({ by: ["fileType"], _count: true }),
    prisma.summary.findMany({ select: { abnormalFlags: true } }),
  ]);

  const totalFlags = summariesWithFlags.reduce(
    (acc: number, s: { abnormalFlags: unknown }) =>
      acc + (Array.isArray(s.abnormalFlags) ? s.abnormalFlags.length : 0),
    0
  );

  const statusMap = Object.fromEntries(
    byStatus.map((s: { status: string; _count: number }) => [s.status.toLowerCase(), s._count])
  );
  const typeMap = Object.fromEntries(
    byType.map((t: { fileType: string; _count: number }) => [t.fileType.toLowerCase(), t._count])
  );

  const stats: AdminStats = {
    total_reports: totalReports,
    reports_today: reportsToday,
    reports_this_week: reportsThisWeek,
    total_patients: totalPatients,
    reports_by_status: {
      processing: statusMap.processing ?? 0,
      complete: statusMap.complete ?? 0,
      error: statusMap.error ?? 0,
    },
    reports_by_file_type: {
      pdf: typeMap.pdf ?? 0,
      image: typeMap.image ?? 0,
    },
    total_summaries: totalSummaries,
    total_abnormal_flags: totalFlags,
    avg_sections_per_report: totalReports > 0 ? totalSummaries / totalReports : 0,
  };

  return NextResponse.json(stats);
}
