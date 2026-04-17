import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { z } from "zod";

export async function GET() {
  const { user, error } = await requireSession();
  if (error) return error;

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PATCH(request: NextRequest) {
  const { user, error } = await requireSession();
  if (error) return error;

  const body: unknown = await request.json();
  const parsed = z.object({ name: z.string().min(1).max(200) }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { name: parsed.data.name },
    select: { id: true, email: true, name: true, role: true },
  });

  return NextResponse.json(updated);
}
