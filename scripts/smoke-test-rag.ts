/**
 * Smoke test: feeds 3 representative report sections through retrieveMedicalContext
 * and prints the top hits + scores. Verifies (a) JSON loads, (b) embeddings work,
 * (c) cosine ranking returns relevant chunks.
 *
 * Run: npx tsx scripts/smoke-test-rag.ts
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv();

const SAMPLES: Array<{ section: string; text: string; flagTests: string[] }> = [
  {
    section: "Lab Results",
    text: "HbA1c: 8.2% (normal 4.0-5.6). Fasting glucose: 168 mg/dL. Patient reports increased thirst and frequent urination.",
    flagTests: ["HbA1c", "fasting glucose"],
  },
  {
    section: "Findings",
    text: "Blood pressure measured 162/98 mmHg on three separate visits. Patient is sedentary, BMI 31. Family history of cardiovascular disease.",
    flagTests: [],
  },
  {
    section: "Lab Results",
    text: "Hemoglobin 9.1 g/dL, ferritin 8 ng/mL, low MCV. Patient reports fatigue and pallor.",
    flagTests: ["hemoglobin", "ferritin"],
  },
];

async function main() {
  // Dynamic import so dotenv populates env BEFORE rag.ts instantiates OpenAI client
  const { retrieveMedicalContext } = await import("../lib/rag");

  for (const s of SAMPLES) {
    console.log("\n" + "=".repeat(70));
    console.log(`SECTION: ${s.section}`);
    console.log(`TEXT:    ${s.text}`);
    console.log(`BOOST:   [${s.flagTests.join(", ")}]`);
    console.log("=".repeat(70));

    const hits = await retrieveMedicalContext(
      s.text,
      5,
      0.3,
      [s.section, ...s.flagTests],
    );

    if (hits.length === 0) {
      console.log("  (no hits above threshold)");
      continue;
    }

    hits.forEach((h: { score: number; category: string; term: string; source: string; content: string }, i: number) => {
      console.log(
        `  ${i + 1}. [${h.score.toFixed(3)}] (${h.category}) ${h.term}`,
      );
      console.log(`     source: ${h.source}`);
      console.log(`     ${h.content.slice(0, 140).replace(/\n/g, " ")}...`);
    });
  }
}

main().catch((err) => {
  console.error("Smoke test failed:", err);
  process.exit(1);
});
