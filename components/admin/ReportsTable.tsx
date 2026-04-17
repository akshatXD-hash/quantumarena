"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import type { ReportWithProfile, ReportStatus, FileType } from "@/types";

interface ReportsTableProps {
  reports: (ReportWithProfile & { summary_count?: number })[];
  total: number;
  page: number;
  totalPages: number;
  onSearch: (search: string) => void;
  onStatusFilter: (status: ReportStatus | "all") => void;
  onTypeFilter: (type: FileType | "all") => void;
  onPageChange: (page: number) => void;
}

const STATUS_VARIANTS: Record<ReportStatus, "warning" | "success" | "destructive"> = {
  processing: "warning",
  complete: "success",
  error: "destructive",
};

export function ReportsTable({
  reports,
  total,
  page,
  totalPages,
  onSearch,
  onStatusFilter,
  onTypeFilter,
  onPageChange,
}: ReportsTableProps) {
  const [searchValue, setSearchValue] = useState("");

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by filename or patient email..."
          value={searchValue}
          onChange={handleSearch}
          className="sm:max-w-xs"
        />
        <Select onValueChange={(v) => onStatusFilter(v as ReportStatus | "all")} defaultValue="all">
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => onTypeFilter(v as FileType | "all")} defaultValue="all">
          <SelectTrigger className="sm:w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Patient</th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Filename</th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Type</th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Date</th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Status</th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Sections</th>
                <th className="text-right font-medium px-4 py-3 text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No reports found.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {report.profiles?.email}
                    </td>
                    <td className="px-4 py-3 font-medium max-w-[200px] truncate">
                      {report.filename}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {report.file_type.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANTS[report.status]}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {report.summary_count ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/results?reportId=${report.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
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
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-2 text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
