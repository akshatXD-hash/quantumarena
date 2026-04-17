"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, FileText, Image, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { TableSkeleton } from "@/components/layout/LoadingSkeleton";
import { formatDate, formatBytes } from "@/lib/utils";
import type { Report, ReportStatus, PaginatedResponse } from "@/types";

const STATUS_VARIANTS: Record<ReportStatus, "warning" | "success" | "destructive"> = {
  processing: "warning",
  complete: "success",
  error: "destructive",
};

type ReportWithCount = Report & { summaries: [{ count: number }] };

export default function HistoryPage() {
  const router = useRouter();
  const [reports, setReports] = useState<ReportWithCount[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports?page=${p}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch reports");
      const data: PaginatedResponse<ReportWithCount> = await res.json();
      setReports(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
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

  function handleView(id: string) {
    router.push(`/results?reportId=${id}`);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Report History</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your past uploaded reports and summaries
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <TableSkeleton rows={5} />
      ) : reports.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/40" />
          <div>
            <p className="font-medium">No reports yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Upload your first report to get started.
            </p>
          </div>
          <Button onClick={() => router.push("/")} size="sm" className="mt-2">
            Upload a report
          </Button>
        </div>
      ) : (
        <>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left font-medium px-4 py-3 text-muted-foreground">Filename</th>
                    <th className="text-left font-medium px-4 py-3 text-muted-foreground">Type</th>
                    <th className="text-left font-medium px-4 py-3 text-muted-foreground">Size</th>
                    <th className="text-left font-medium px-4 py-3 text-muted-foreground">Date</th>
                    <th className="text-left font-medium px-4 py-3 text-muted-foreground">Status</th>
                    <th className="text-left font-medium px-4 py-3 text-muted-foreground">Sections</th>
                    <th className="text-right font-medium px-4 py-3 text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr
                      key={report.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium max-w-[180px] truncate">
                        {report.filename}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="gap-1 text-xs">
                          {report.file_type === "pdf" ? (
                            <FileText className="h-3 w-3" />
                          ) : (
                            <Image className="h-3 w-3" />
                          )}
                          {report.file_type.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {formatBytes(report.file_size_bytes)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                        {formatDate(report.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_VARIANTS[report.status]}>
                          {report.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {report.summaries?.[0]?.count ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(report.id)}
                            disabled={report.status !== "complete"}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                disabled={deletingId === report.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete report</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <strong>{report.filename}</strong>? This will
                                  permanently delete the file and all summaries.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(report.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {reports.length} of {total} reports
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
                <span className="flex items-center px-3 text-sm text-muted-foreground">
                  {page} / {totalPages}
                </span>
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
