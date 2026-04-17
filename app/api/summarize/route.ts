import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { chunkBySections } from "@/lib/section-chunker";
import { detectAbnormals } from "@/lib/abnormal-detector";
import { summarizeChunk } from "@/lib/ai";
import { summarizeSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const parsed = summarizeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { reportId, text } = parsed.data;

    const { data: report } = await supabase
      .from("reports")
      .select("id, user_id")
      .eq("id", reportId)
      .single();

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (report.user_id !== user.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const chunks = chunkBySections(text);
    const service = createServiceClient();
    const summaries = [];

    for (const chunk of chunks) {
      const flags = detectAbnormals(chunk.text);
      const result = await summarizeChunk(chunk.sectionName, chunk.text, flags);

      const { data: summary } = await service
        .from("summaries")
        .insert({
          report_id: reportId,
          section_name: chunk.sectionName,
          summary_text: result.summary_text,
          abnormal_flags: result.abnormal_flags,
          citations: result.citations,
          next_steps: result.next_steps,
        })
        .select()
        .single();

      if (summary) summaries.push(summary);
    }

    await service
      .from("reports")
      .update({ status: "complete" })
      .eq("id", reportId);

    return NextResponse.json({ summaries });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Summarization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
