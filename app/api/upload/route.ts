import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { processFile } from "@/lib/file-processor";
import { isAcceptedMimeType } from "@/lib/validators";
import { estimateReadingTime } from "@/lib/utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!isAcceptedMimeType(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const processed = await processFile(buffer, file.type);

    const ext = file.name.split(".").pop() ?? "bin";
    const blobFilename = `${uuidv4()}.${ext}`;

    const blob = await put(blobFilename, buffer, {
      access: "public",
      contentType: file.type,
    });

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let reportId: string | null = null;

    if (user) {
      const service = createServiceClient();
      const { data: report } = await service
        .from("reports")
        .insert({
          user_id: user.id,
          filename: file.name,
          blob_url: blob.url,
          file_type: processed.fileType,
          mime_type: file.type,
          file_size_bytes: file.size,
          raw_text: processed.text,
          page_count: processed.pageCount,
          status: "processing",
        })
        .select("id")
        .single();

      reportId = report?.id ?? null;
    }

    return NextResponse.json({
      blobUrl: blob.url,
      text: processed.text,
      filename: file.name,
      fileType: processed.fileType,
      mimeType: file.type,
      fileSizeBytes: file.size,
      pageCount: processed.pageCount,
      reportId,
      characterCount: processed.text.length,
      estimatedReadingTime: estimateReadingTime(processed.text.length),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
