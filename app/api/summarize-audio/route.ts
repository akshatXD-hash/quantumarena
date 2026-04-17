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
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "google/gemma-3-27b-it:free",
  "deepseek/deepseek-r1:free",
  "mistralai/mistral-small-3.1-24b-instruct:free"
];

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
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
        });

        const content = response.choices[0]?.message?.content ?? "{}";
        const match = content.match(/\{[\s\S]*\}/);
        const cleanContent = match ? match[0] : "{}";
        const parsed = JSON.parse(cleanContent);
        
        return NextResponse.json(parsed);
      } catch (err) {
        console.warn(`[Summarize Audio] Model ${model} failed, falling back...`);
        lastError = err;
        continue;
      }
    }

    throw new Error("All AI models failed to summarize the audio.");

  } catch (error: any) {
    console.error("[Summarize Audio Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to summarize audio." },
      { status: 500 }
    );
  }
}
