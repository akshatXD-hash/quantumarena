import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    let query = supabase
      .from("reports")
      .select("*, summaries(*)")
      .eq("id", params.id);

    if (profile?.role !== "admin") {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    let query = supabase
      .from("reports")
      .select("id, blob_url, user_id")
      .eq("id", params.id);

    if (profile?.role !== "admin") {
      query = query.eq("user_id", user.id);
    }

    const { data: report } = await query.single();

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    try {
      await del(report.blob_url);
    } catch (err) {
      console.error("Blob deletion failed:", err);
    }

    const service = createServiceClient();
    await service.from("reports").delete().eq("id", params.id);

    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
