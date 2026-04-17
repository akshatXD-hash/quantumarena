import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10"));
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const fileType = searchParams.get("fileType") ?? "";
  const skip = (page - 1) * limit;

  const where = {
    ...(status ? { status: status as "PROCESSING" | "COMPLETE" | "ERROR" } : {}),
    ...(fileType ? { fileType } : {}),
    ...(search
      ? {
          OR: [
            { filename: { contains: search, mode: "insensitive" as const } },
            { user: { email: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: { user: { select: { email: true, name: true } }, _count: { select: { summaries: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
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
