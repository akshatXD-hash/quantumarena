import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { userRoleUpdateSchema } from "@/lib/validators";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { user, error } = await requireAdmin();
  if (error) return error;

  if (params.id === user.id) {
    return NextResponse.json({ error: "You cannot change your own role" }, { status: 400 });
  }

  const body: unknown = await request.json();
  const parsed = userRoleUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role: parsed.data.role.toUpperCase() as "PATIENT" | "ADMIN" },
      select: { id: true, email: true, role: true },
    });
    return NextResponse.json(updatedUser);
  } catch (dbError) {
    console.error("[user update]", dbError);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
