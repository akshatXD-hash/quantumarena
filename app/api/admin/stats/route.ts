import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { AdminStats } from "@/types";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const service = createServiceClient();

    const { data: rpcData, error: rpcError } = await service.rpc("get_admin_stats");

    if (!rpcError && rpcData) {
      return NextResponse.json(rpcData as AdminStats);
    }

    const [reportsResult, patientsResult, summariesResult, todayResult, weekResult, flagsResult] =
      await Promise.all([
        service.from("reports").select("status, file_type", { count: "exact" }),
        service.from("profiles").select("id", { count: "exact" }).eq("role", "patient"),
        service.from("summaries").select("id, abnormal_flags", { count: "exact" }),
        service
          .from("reports")
          .select("id", { count: "exact" })
          .gte("created_at", new Date().toISOString().split("T")[0]),
        service
          .from("reports")
          .select("id", { count: "exact" })
          .gte(
            "created_at",
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          ),
        service.from("summaries").select("abnormal_flags"),
      ]);

    const allReports = reportsResult.data ?? [];
    const statusCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};

    for (const r of allReports) {
      statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
      typeCounts[r.file_type] = (typeCounts[r.file_type] ?? 0) + 1;
    }

    const totalFlags = (flagsResult.data ?? []).reduce(
      (acc, s) =>
        acc + (Array.isArray(s.abnormal_flags) ? s.abnormal_flags.length : 0),
      0
    );

    const totalReports = reportsResult.count ?? 0;
    const totalSummaries = summariesResult.count ?? 0;

    const stats: AdminStats = {
      total_reports: totalReports,
      reports_today: todayResult.count ?? 0,
      reports_this_week: weekResult.count ?? 0,
      total_patients: patientsResult.count ?? 0,
      reports_by_status: {
        processing: statusCounts.processing ?? 0,
        complete: statusCounts.complete ?? 0,
        error: statusCounts.error ?? 0,
      },
      reports_by_file_type: {
        pdf: typeCounts.pdf ?? 0,
        image: typeCounts.image ?? 0,
      },
      total_summaries: totalSummaries,
      total_abnormal_flags: totalFlags,
      avg_sections_per_report:
        totalReports > 0 ? totalSummaries / totalReports : 0,
    };

    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
