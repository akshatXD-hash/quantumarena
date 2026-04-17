import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware-client";
import { ensureProfile } from "@/lib/auth";

const PROTECTED_ROUTES = [
  "/results",
  "/history",
  "/processing",
  "/api/summarize",
  "/api/reports",
  "/api/profile",
];

const ADMIN_ROUTES = ["/admin", "/api/admin"];

const PUBLIC_ROUTES = ["/login", "/api/upload", "/api/health"];

function isProtected(pathname: string): boolean {
  return PROTECTED_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
}

function isAdmin(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
}

function isPublic(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabase, supabaseResponse } = createMiddlewareClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isPublic(pathname)) {
    if (user && pathname === "/login") {
      const redirect = request.nextUrl.searchParams.get("redirect");
      const destination = redirect ?? "/";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return supabaseResponse;
  }

  if (isAdmin(pathname)) {
    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return supabaseResponse;
  }

  if (isProtected(pathname)) {
    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      try {
        await ensureProfile(user.id, user.email ?? "");
      } catch {}
    }

    return supabaseResponse;
  }

  if (!user && pathname !== "/" && !pathname.startsWith("/_next")) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
