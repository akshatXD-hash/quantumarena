import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

// Ensure this route can process potentially larger audio blobs (Vercel max 4.5MB on Hobby, up to 50MB on Pro)
export const maxDuration = 60; // Max serverless function duration

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ASSEMBLYAI_API_KEY) {
      return NextResponse.json({ error: "ASSEMBLYAI_API_KEY is missing." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("audio") as File;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided." }, { status: 400 });
    }

    // Convert file to buffer and get an array buffer for assemblyAI
    const buffer = await file.arrayBuffer();
    console.log(`[Transcribe] Uploading file to AssemblyAI (${buffer.byteLength} bytes)...`);
    const uploadUrl = await client.files.upload(new Uint8Array(buffer));

    // Submit for transcription
    console.log("[Transcribe] Submitting for transcription and summarization...");
    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      speech_models: ["universal-3-pro", "universal-2"],
      language_detection: true,
      summarization: true,
      summary_model: 'informative',
      summary_type: 'bullets',
    } as any);

    if (transcript.status === "error") {
      console.error("[Transcribe] AssemblyAI error:", transcript.error);
      throw new Error(transcript.error || "Transcription failed");
    }

    console.log("[Transcribe] Transcription completed successfully.");

    return NextResponse.json({
      text: transcript.text,
      utterances: transcript.utterances,
      summary: transcript.summary, // Return the base summary
    });
  } catch (error: any) {
    console.error("[Transcribe Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio." },
      { status: 500 }
    );
  }
}
