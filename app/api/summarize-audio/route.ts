import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    "X-Title": "MediSumm Audio",
  },
});

const FREE_MODELS = [
  "google/gemma-3-27b-it:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "minimax/minimax-m2.5:free",
  "openrouter/free"
];

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript || transcript.length < 10) {
      return NextResponse.json({
        title: "Short Conversation",
        summary: "The recording was too short to generate a detailed summary.",
        key_points: ["No significant data found"],
        action_items: []
      });
    }

    const prompt = `
      You are a highly capable AI assistant that summarizes medical interactions and general conversations.
      Please summarize this transcript into key points and actionable insights. Output strict JSON format only.

      Do not add markdown formatting or conversational text outside of the JSON.

      Structure the output exactly like this JSON:
      {
        "title": "A short 3-5 word title",
        "summary": "A 2-3 paragraph detailed summary of what was discussed",
        "key_points": ["point 1", "point 2"],
        "action_items": ["action 1", "action 2"]
      }

      TRANSCRIPT TO SUMMARIZE:
      """
      ${transcript}
      """
    `;

    let lastError = null;

    for (const model of FREE_MODELS) {
      try {
        console.log(`[Summarize Audio] Trying model: ${model}`);
        const response = await openai.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content: "You are an expert summarizer. Return only valid JSON.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content ?? "{}";
        const match = content.match(/\{[\s\S]*\}/);
        const cleanContent = match ? match[0] : "{}";
        const parsed = JSON.parse(cleanContent);

        // Validate required fields
        if (parsed.title && parsed.summary) {
          console.log(`[Summarize Audio] Success with model: ${model}`);
          return NextResponse.json(parsed);
        }
        console.warn(`[Summarize Audio] Model ${model} returned incomplete JSON, trying next...`);
      } catch (err) {
        console.warn(`[Summarize Audio] Model ${model} failed, falling back...`);
        lastError = err;
        continue;
      }
    }

    // Final fallback if ALL models fail - return a friendly error result instead of crashing
    console.error("[Summarize Audio Error]: All models failed.", lastError);
    return NextResponse.json({
      title: "Summary (AI Offline)",
      summary: "We were able to transcribe your audio, but our AI summarization service is currently overloaded. You can still read the raw transcript below.",
      key_points: ["Transcription completed successfully", "AI summarization failed (rate limit)"],
      action_items: ["Review the raw transcript manually", "Try summarizing again in a few minutes"]
    });

  } catch (error: any) {
    console.error("[Summarize Audio Fatal Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to summarize audio." },
      { status: 500 }
    );
  }
}
