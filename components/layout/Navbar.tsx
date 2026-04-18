"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useReportStore } from "@/store/report-store";
import type { SessionUser } from "@/lib/auth";

interface NavbarProps {
  user: SessionUser;
}

export function Navbar({ user }: NavbarProps) {
  const reset = useReportStore((s) => s.reset);

  async function handleLogout() {
    reset();
    await signOut({ callbackUrl: "/login" });
  }

  const isAdmin = user.role === "ADMIN";

  return (
    <nav className="sticky top-4 z-40 mx-8 glass-nav rounded-full px-8 h-[64px] flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 font-['Sora'] text-lg font-bold text-[#1a2340] tracking-tight">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm border border-slate-100">
            🩺
          </div>
          Med<span className="text-[#10b981]">Summary</span>
        </Link>
        {isAdmin ? (
          <div className="hidden sm:flex items-center gap-4 ml-2">
            <Link href="/admin" className="text-sm font-medium text-[#5a7080] hover:text-[#2ab8c8] transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/users" className="text-sm font-medium text-[#5a7080] hover:text-[#2ab8c8] transition-colors">
              Users
            </Link>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-4 ml-2">
            <Link href="/upload" className="text-sm font-medium text-[#5a7080] hover:text-[#2ab8c8] transition-colors">
              Upload PDF
            </Link>
            <Link href="/listen" className="text-sm font-medium text-[#2ab8c8] hover:opacity-80 transition-opacity">
              Record Audio
            </Link>
            <Link href="/history" className="text-sm font-medium text-[#5a7080] hover:text-[#2ab8c8] transition-colors">
              History
            </Link>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-sm text-[#5a7080] truncate max-w-[180px]">
            {user.name ?? user.email}
          </span>
          {isAdmin && <Badge variant="purple">Admin</Badge>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-2 rounded-full text-[#5a7080] hover:text-[#1a2340] hover:bg-white/60"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </nav>
  );
}
