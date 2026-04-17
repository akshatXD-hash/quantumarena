"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useReportStore } from "@/store/report-store";
import type { Profile } from "@/types";

interface NavbarProps {
  profile: Profile;
}

export function Navbar({ profile }: NavbarProps) {
  const router = useRouter();
  const reset = useReportStore((s) => s.reset);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    reset();
    router.push("/login");
    router.refresh();
  }

  const isAdmin = profile.role === "admin";

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <Activity className="h-5 w-5 text-primary" />
              <span>MediSumm</span>
            </Link>

            {isAdmin ? (
              <div className="hidden sm:flex items-center gap-4">
                <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/users" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Users
                </Link>
              </div>
            ) : (
              <Link href="/history" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">
                History
              </Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:block">{profile.email}</span>
              {isAdmin && (
                <Badge variant="purple" className="hidden sm:flex">Admin</Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
