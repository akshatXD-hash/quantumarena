import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { user, error } = await requireSession();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10"));
  const skip = (page - 1) * limit;

  const where = user.role === "ADMIN" ? {} : { userId: user.id };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { _count: { select: { summaries: true } } },
    }),
    prisma.report.count({ where }),
  ]);

  return NextResponse.json({
    data: reports.map((r: typeof reports[number]) => ({
      ...r,
      fileSizeBytes: r.fileSizeBytes.toString(),
      summaryCount: r._count.summaries,
    })),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
}
