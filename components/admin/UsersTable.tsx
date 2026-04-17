"use client";

import { useState } from "react";
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
import { formatDate } from "@/lib/utils";
import type { ProfileWithReportCount, UserRole } from "@/types";

interface UsersTableProps {
  users: ProfileWithReportCount[];
  total: number;
  page: number;
  totalPages: number;
  currentAdminId: string;
  onSearch: (search: string) => void;
  onRoleFilter: (role: UserRole | "all") => void;
  onPageChange: (page: number) => void;
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

export function UsersTable({
  users,
  total,
  page,
  totalPages,
  currentAdminId,
  onSearch,
  onRoleFilter,
  onPageChange,
  onRoleChange,
}: UsersTableProps) {
  const [searchValue, setSearchValue] = useState("");
  const [pendingChange, setPendingChange] = useState<{
    userId: string;
    newRole: UserRole;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  }

  async function confirmRoleChange() {
    if (!pendingChange) return;
    setLoading(true);
    try {
      await onRoleChange(pendingChange.userId, pendingChange.newRole);
    } finally {
      setLoading(false);
      setPendingChange(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by email or name..."
          value={searchValue}
          onChange={handleSearch}
          className="sm:max-w-xs"
        />
        <Select onValueChange={(v) => onRoleFilter(v as UserRole | "all")} defaultValue="all">
          <SelectTrigger className="sm:w-36">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Email</th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Name</th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Role</th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Joined</th>
                <th className="text-left font-medium px-4 py-3 text-muted-foreground">Reports</th>
                <th className="text-right font-medium px-4 py-3 text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{user.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.full_name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === "admin" ? "purple" : "secondary"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.report_count}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {user.id !== currentAdminId && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setPendingChange({
                                  userId: user.id,
                                  newRole: user.role === "admin" ? "patient" : "admin",
                                  email: user.email,
                                })
                              }
                            >
                              {user.role === "admin" ? "Remove admin" : "Make admin"}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Change role</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to change{" "}
                                <strong>{pendingChange?.email}</strong>&apos;s role to{" "}
                                <strong>{pendingChange?.newRole}</strong>?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setPendingChange(null)}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={confirmRoleChange}
                                disabled={loading}
                              >
                                {loading ? "Saving..." : "Confirm"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
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
            Showing {users.length} of {total} users
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
