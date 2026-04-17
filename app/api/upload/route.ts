import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProfile } from "@/lib/auth";
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
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 10 MB limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const processed = await processFile(buffer, file.type);

    const user = await getProfile();
    let reportId: string | null = null;

    if (user) {
      const report = await prisma.report.create({
        data: {
          userId: user.id,
          filename: file.name,
          fileType: processed.fileType,
          mimeType: file.type,
          fileSizeBytes: BigInt(file.size),
          rawText: processed.text,
          pageCount: processed.pageCount,
          status: "PROCESSING",
        },
        select: { id: true },
      });
      reportId = report.id;
    }

    return NextResponse.json({
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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
