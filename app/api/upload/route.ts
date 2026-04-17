import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { processFile } from "@/lib/file-processor";
import { estimateReadingTime } from "@/lib/utils";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  try {
    // Require authentication — return 401 if not logged in
    const { user, error: authError } = await requireSession();
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ];

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF or Image files (PNG, JPG, WEBP) are accepted." },
        { status: 415 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 10 MB limit" }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const processed = await processFile(buffer, file.type);

    // Create report record in Neon DB via Prisma
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

    return NextResponse.json({
      text: processed.text,
      filename: file.name,
      fileType: processed.fileType,
      mimeType: file.type,
      fileSizeBytes: file.size,
      pageCount: processed.pageCount,
      reportId: report.id,
      characterCount: processed.text.length,
      estimatedReadingTime: estimateReadingTime(processed.text.length),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
