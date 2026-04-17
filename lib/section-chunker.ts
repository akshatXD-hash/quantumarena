import type { SectionChunk } from "@/types";

const SECTION_HEADERS = [
  "Impression",
  "Findings",
  "Conclusion",
  "Medications",
  "Lab Results",
  "Lab Values",
  "Laboratory",
  "Diagnosis",
  "Clinical History",
  "Clinical Summary",
  "Recommendations",
  "Assessment",
  "Plan",
  "History of Present Illness",
  "Past Medical History",
  "Physical Examination",
  "Review of Systems",
  "Discharge Summary",
  "Allergies",
  "Vitals",
  "Chief Complaint",
  "Social History",
  "Family History",
  "Surgical History",
  "Immunizations",
  "Procedures",
  "Radiology",
  "Pathology",
  "Microbiology",
];

const HEADER_PATTERN = new RegExp(
  `^(${SECTION_HEADERS.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\s*[:\\-]?\\s*$`,
  "im"
);

export function chunkBySections(text: string): SectionChunk[] {
  const lines = text.split("\n");
  const chunks: SectionChunk[] = [];
  let currentSection = "";
  let currentLines: string[] = [];

  function flush() {
    const content = currentLines.join("\n").trim();
    if (content.length >= 30) {
      chunks.push({
        sectionName: currentSection || "Full Report",
        text: content,
      });
    }
    currentLines = [];
  }

  for (const line of lines) {
    const headerMatch = line.match(
      new RegExp(
        `^(${SECTION_HEADERS.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\s*[:\\-]?\\s*$`,
        "i"
      )
    );

    if (headerMatch) {
      flush();
      currentSection = headerMatch[1];
    } else {
      currentLines.push(line);
    }
  }

  flush();

  if (chunks.length === 0) {
    const trimmed = text.trim();
    if (trimmed.length >= 30) {
      return [{ sectionName: "Full Report", text: trimmed }];
    }
  }

  return chunks;
}
