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
    const uploadUrl = await client.files.upload(new Uint8Array(buffer));

    // Submit for transcription
    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl,
      speech_models: ["universal-3-pro", "universal-2"],
      language_detection: true,
    } as any);

    if (transcript.status === "error") {
      throw new Error(transcript.error || "Transcription failed");
    }

    return NextResponse.json({
      text: transcript.text,
      utterances: transcript.utterances,
    });
  } catch (error: any) {
    console.error("[Transcribe Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to transcribe audio." },
      { status: 500 }
    );
  }
}
