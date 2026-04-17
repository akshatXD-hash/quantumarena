import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    const isAdminRoute =
      pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

    if (isAdminRoute && token?.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/upload",
    "/processing/:path*",
    "/results/:path*",
    "/history/:path*",
    "/admin/:path*",
    "/api/upload",
    "/api/summarize",
    "/api/reports/:path*",
    "/api/profile/:path*",
    "/api/admin/:path*",
  ],
};
