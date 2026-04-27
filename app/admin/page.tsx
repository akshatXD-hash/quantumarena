"use client";

import { useEffect, useState, useCallback } from "react";
import { StatsGrid } from "@/components/admin/StatsGrid";
import { ReportsTable } from "@/components/admin/ReportsTable";
import { CardSkeleton, TableSkeleton } from "@/components/layout/LoadingSkeleton";
import type { AdminStats, ReportWithProfile, ReportStatus, FileType, PaginatedResponse } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<ReportWithProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statsLoading, setStatsLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ReportStatus | "all">("all");
  const [fileType, setFileType] = useState<FileType | "all">("all");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data: AdminStats) => setStats(data))
      .finally(() => setStatsLoading(false));
  }, []);

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    if (fileType !== "all") params.set("fileType", fileType);

    try {
      const res = await fetch(`/api/admin/reports?${params}`);
      const data: PaginatedResponse<ReportWithProfile> = await res.json();
      setReports(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } finally {
      setReportsLoading(false);
    }
  }, [page, search, status, fileType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilter(value: ReportStatus | "all") {
    setStatus(value);
    setPage(1);
  }

  function handleTypeFilter(value: FileType | "all") {
    setFileType(value);
    setPage(1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="font-['Sora'] text-2xl font-bold text-[#1a2340]">Admin <span className="text-[#2ab8c8]">Dashboard</span></h1>
        <p className="text-[#5a7080] text-sm mt-1">
          Platform-wide overview and report management
        </p>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : stats ? (
        <StatsGrid stats={stats} />
      ) : null}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">All Reports</h2>
        {reportsLoading ? (
          <TableSkeleton rows={8} />
        ) : (
          <ReportsTable
            reports={reports as (ReportWithProfile & { summary_count?: number })[]}
            total={total}
            page={page}
            totalPages={totalPages}
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onTypeFilter={handleTypeFilter}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
