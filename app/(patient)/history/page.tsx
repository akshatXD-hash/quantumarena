"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Trash2,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  Search,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  FileStack,
  Calendar,
  HardDrive,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CardSkeleton } from "@/components/layout/LoadingSkeleton";
import { formatDate, formatBytes } from "@/lib/utils";

type Status = "PROCESSING" | "COMPLETE" | "ERROR";

interface ApiReport {
  id: string;
  filename: string;
  fileType: string;
  mimeType: string;
  fileSizeBytes: string;
  pageCount: number | null;
  status: Status;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  summaryCount: number;
}

interface ApiResponse {
  data: ApiReport[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type StatusFilter = "all" | Status;

const STATUS_META: Record<
  Status,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  COMPLETE: {
    label: "Complete",
    className: "bg-[#10b981]/10 text-[#059669] border-[#10b981]/30",
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  ERROR: {
    label: "Error",
    className: "bg-destructive/10 text-destructive border-destructive/30",
    icon: XCircle,
  },
};

export default function HistoryPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const fetchReports = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports?page=${p}&limit=12`);
      if (!res.ok) throw new Error("Failed to load your reports");
      const data: ApiResponse = await res.json();
      setReports(data.data);
      setTotal(data.total);
      setTotalPages(Math.max(1, data.totalPages));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(page);
  }, [page, fetchReports]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchReports(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (q && !r.filename.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [reports, search, statusFilter]);

  const stats = useMemo(() => {
    const base = { complete: 0, processing: 0, error: 0 };
    for (const r of reports) {
      if (r.status === "COMPLETE") base.complete++;
      else if (r.status === "PROCESSING") base.processing++;
      else if (r.status === "ERROR") base.error++;
    }
    return base;
  }, [reports]);

  const isEmpty = !loading && reports.length === 0;
  const hasFilteredEmpty = !loading && reports.length > 0 && visible.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-['Sora'] text-2xl md:text-3xl font-bold text-[#1a2340]">
            Report <span className="text-[#2ab8c8]">History</span>
          </h1>
          <p className="text-[#5a7080] text-sm mt-1">
            All your past uploads and AI-generated summaries in one place
          </p>
        </div>
        <Button
          onClick={() => router.push("/upload")}
          className="gap-2 bg-[#10b981] hover:bg-[#059669] text-white"
        >
          <Upload className="h-4 w-4" />
          Upload new report
        </Button>
      </div>

      {!loading && reports.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={<FileStack className="h-4 w-4" />}
            label="Total"
            value={total}
            tint="text-[#1a2340]"
          />
          <StatCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            label="Complete"
            value={stats.complete}
            tint="text-[#059669]"
          />
          <StatCard
            icon={<Clock className="h-4 w-4" />}
            label="Processing"
            value={stats.processing}
            tint="text-amber-600"
          />
          <StatCard
            icon={<XCircle className="h-4 w-4" />}
            label="Errors"
            value={stats.error}
            tint="text-destructive"
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2 border border-destructive/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {!loading && reports.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by filename…"
              className="pl-9"
            />
          </div>
          <div className="inline-flex rounded-lg border border-[#2ab8c8]/30 bg-white/60 p-0.5">
            {(["all", "COMPLETE", "PROCESSING", "ERROR"] as StatusFilter[]).map(
              (s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    statusFilter === s
                      ? "bg-[#2ab8c8] text-white"
                      : "text-[#5a7080] hover:bg-[#2ab8c8]/10"
                  }`}
                >
                  {s === "all" ? "All" : STATUS_META[s as Status].label}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : isEmpty ? (
        <EmptyState onUpload={() => router.push("/upload")} />
      ) : hasFilteredEmpty ? (
        <div className="glass rounded-2xl p-10 text-center space-y-2">
          <Search className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="font-medium text-[#1a2340]">No reports match your filters</p>
          <p className="text-sm text-[#5a7080]">
            Try a different search term or clear the status filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visible.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                deleting={deletingId === report.id}
                onView={() => router.push(`/results?reportId=${report.id}`)}
                onDelete={() => handleDelete(report.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-[#5a7080]">
                Showing page <strong>{page}</strong> of{" "}
                <strong>{totalPages}</strong> — {total} total reports
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tint: string;
}) {
  return (
    <div className="glass rounded-xl p-4">
      <div className={`flex items-center gap-2 text-xs font-medium ${tint}`}>
        {icon}
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-['Sora'] text-2xl font-bold text-[#1a2340] mt-1">
        {value}
      </div>
    </div>
  );
}

function ReportCard({
  report,
  deleting,
  onView,
  onDelete,
}: {
  report: ApiReport;
  deleting: boolean;
  onView: () => void;
  onDelete: () => void;
}) {
  const status = STATUS_META[report.status];
  const StatusIcon = status.icon;
  const isImage = report.fileType === "image";
  const size = Number(report.fileSizeBytes);
  const canView = report.status === "COMPLETE";

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
              isImage
                ? "bg-[#2ab8c8]/10 text-[#2ab8c8]"
                : "bg-[#10b981]/10 text-[#059669]"
            }`}
          >
            {isImage ? (
              <ImageIcon className="h-5 w-5" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0">
            <p
              className="font-medium text-sm text-[#1a2340] truncate"
              title={report.filename}
            >
              {report.filename}
            </p>
            <Badge
              variant="outline"
              className="mt-1 text-[10px] uppercase tracking-wider"
            >
              {report.fileType}
            </Badge>
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${status.className}`}
        >
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px] text-[#5a7080]">
        <Meta icon={<Calendar className="h-3 w-3" />}>
          {formatDate(report.createdAt)}
        </Meta>
        <Meta icon={<HardDrive className="h-3 w-3" />}>
          {Number.isFinite(size) ? formatBytes(size) : "—"}
        </Meta>
        <Meta icon={<Layers className="h-3 w-3" />}>
          {report.summaryCount} section{report.summaryCount === 1 ? "" : "s"}
        </Meta>
      </div>

      {report.status === "ERROR" && report.errorMessage && (
        <p className="text-xs text-destructive bg-destructive/10 rounded-md px-2 py-1.5 line-clamp-2">
          {report.errorMessage}
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          onClick={onView}
          disabled={!canView}
          className="flex-1 gap-1.5 bg-[#2ab8c8] hover:bg-[#239ba9] text-white disabled:opacity-50"
        >
          <Eye className="h-3.5 w-3.5" />
          {canView ? "View summary" : "Unavailable"}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="px-2.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this report?</AlertDialogTitle>
              <AlertDialogDescription>
                <strong>{report.filename}</strong> and all of its summaries will be
                permanently removed. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function Meta({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  );
}

function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="glass rounded-3xl p-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-[#10b981]/10 flex items-center justify-center mx-auto">
        <FileStack className="h-8 w-8 text-[#059669]" />
      </div>
      <div className="space-y-1">
        <h2 className="font-['Sora'] text-xl font-semibold text-[#1a2340]">
          No reports yet
        </h2>
        <p className="text-sm text-[#5a7080] max-w-sm mx-auto">
          Upload your first medical report and we&apos;ll turn it into a plain-English
          summary you can actually use.
        </p>
      </div>
      <Button
        onClick={onUpload}
        className="gap-2 bg-[#10b981] hover:bg-[#059669] text-white"
      >
        <Upload className="h-4 w-4" />
        Upload your first report
      </Button>
    </div>
  );
}
