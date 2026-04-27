import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";

const LANGUAGE_CODES: Record<string, string> = {
  hindi: "hi",
  marathi: "mr",
};

async function translateWithGoogle(
  text: string,
  langCode: string
): Promise<string | null> {
  // Google Translate's public gtx endpoint — no API key, ~5k char limit per GET.
  const CHUNK = 4500;
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK) {
    parts.push(text.slice(i, i + CHUNK));
  }

  const out: string[] = [];
  for (const part of parts) {
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&dt=t&tl=" +
      encodeURIComponent(langCode) +
      "&q=" +
      encodeURIComponent(part);

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MediSumm/1.0; +https://medisumm.local)",
      },
    });
    if (!res.ok) return null;

    const data: unknown = await res.json();
    if (!Array.isArray(data) || !Array.isArray(data[0])) return null;

    const segments = data[0] as unknown[];
    const joined = segments
      .map((seg) =>
        Array.isArray(seg) && typeof seg[0] === "string" ? (seg[0] as string) : ""
      )
      .join("");
    out.push(joined);
  }

  const full = out.join("").trim();
  return full || null;
}

export async function POST(request: NextRequest) {
  const { error } = await requireSession();
  if (error) return error;

  let body: { text?: unknown; language?: unknown };
  try {
    body = (await request.json()) as { text?: unknown; language?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const language = typeof body.language === "string" ? body.language.toLowerCase() : "";

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const langCode = LANGUAGE_CODES[language];
  if (!langCode) {
    return NextResponse.json(
      { error: "language must be 'hindi' or 'marathi'" },
      { status: 400 }
    );
  }

  try {
    const translated = await translateWithGoogle(text, langCode);
    if (!translated) {
      return NextResponse.json(
        { error: "Translation service returned no result." },
        { status: 502 }
      );
    }
    return NextResponse.json({ translatedText: translated, language });
  } catch (err) {
    console.error("[Translate] Google request failed:", err);
    return NextResponse.json(
      { error: "Translation service is temporarily unavailable." },
      { status: 503 }
    );
  }
}
