import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireSession();
  if (error) return error;

  const report = await prisma.report.findFirst({
    where: {
      id: params.id,
      ...(user.role !== "ADMIN" ? { userId: user.id } : {}),
    },
    include: { summaries: { orderBy: { createdAt: "asc" } } },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...report,
    fileSizeBytes: report.fileSizeBytes.toString(),
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireSession();
  if (error) return error;

  const report = await prisma.report.findFirst({
    where: {
      id: params.id,
      ...(user.role !== "ADMIN" ? { userId: user.id } : {}),
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  await prisma.report.delete({ where: { id: params.id } });

  return new NextResponse(null, { status: 204 });
}
