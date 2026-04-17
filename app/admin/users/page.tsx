"use client";

import { useEffect, useState, useCallback } from "react";
import { UsersTable } from "@/components/admin/UsersTable";
import { TableSkeleton } from "@/components/layout/LoadingSkeleton";
import { createClient } from "@/lib/supabase/client";
import type {
  ProfileWithReportCount,
  UserRole,
  PaginatedResponse,
} from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ProfileWithReportCount[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [currentAdminId, setCurrentAdminId] = useState("");

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "all">("all");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentAdminId(data.user.id);
    });
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (search) params.set("search", search);
    if (role !== "all") params.set("role", role);

    try {
      const res = await fetch(`/api/admin/users?${params}`);
      const data: PaginatedResponse<ProfileWithReportCount> = await res.json();
      setUsers(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page, search, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleRoleChange(userId: string, newRole: UserRole) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (!res.ok) throw new Error("Failed to update role");
    await fetchUsers();
  }

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleRoleFilter(value: UserRole | "all") {
    setRole(value);
    setPage(1);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage accounts and roles across the platform
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={8} />
      ) : (
        <UsersTable
          users={users}
          total={total}
          page={page}
          totalPages={totalPages}
          currentAdminId={currentAdminId}
          onSearch={handleSearch}
          onRoleFilter={handleRoleFilter}
          onPageChange={setPage}
          onRoleChange={handleRoleChange}
        />
      )}
    </div>
  );
}
