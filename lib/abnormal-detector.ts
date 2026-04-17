import type { AbnormalFlag, LabRangeEntry } from "@/types";

const LAB_RANGES: Record<string, LabRangeEntry> = {
  HbA1c: { general: { min: 4.0, max: 5.6, unit: "%" } },
  "fasting glucose": { general: { min: 70, max: 99, unit: "mg/dL" } },
  "random glucose": { general: { min: 70, max: 140, unit: "mg/dL" } },
  creatinine: {
    male: { min: 0.74, max: 1.35, unit: "mg/dL" },
    female: { min: 0.59, max: 1.04, unit: "mg/dL" },
  },
  BUN: { general: { min: 7, max: 20, unit: "mg/dL" } },
  eGFR: { general: { min: 60, max: 120, unit: "mL/min/1.73m²" } },
  sodium: { general: { min: 136, max: 145, unit: "mEq/L" } },
  potassium: { general: { min: 3.5, max: 5.0, unit: "mEq/L" } },
  chloride: { general: { min: 98, max: 106, unit: "mEq/L" } },
  bicarbonate: { general: { min: 22, max: 29, unit: "mEq/L" } },
  calcium: { general: { min: 8.5, max: 10.2, unit: "mg/dL" } },
  magnesium: { general: { min: 1.7, max: 2.2, unit: "mg/dL" } },
  phosphorus: { general: { min: 2.5, max: 4.5, unit: "mg/dL" } },
  hemoglobin: {
    male: { min: 13.5, max: 17.5, unit: "g/dL" },
    female: { min: 12.0, max: 15.5, unit: "g/dL" },
  },
  hematocrit: {
    male: { min: 41, max: 53, unit: "%" },
    female: { min: 36, max: 46, unit: "%" },
  },
  WBC: { general: { min: 4.5, max: 11.0, unit: "×10³/µL" } },
  platelets: { general: { min: 150, max: 400, unit: "×10³/µL" } },
  neutrophils: { general: { min: 1.8, max: 7.7, unit: "×10³/µL" } },
  lymphocytes: { general: { min: 1.0, max: 4.8, unit: "×10³/µL" } },
  ALT: { general: { min: 7, max: 56, unit: "U/L" } },
  AST: { general: { min: 10, max: 40, unit: "U/L" } },
  ALP: { general: { min: 44, max: 147, unit: "U/L" } },
  "total bilirubin": { general: { min: 0.1, max: 1.2, unit: "mg/dL" } },
  albumin: { general: { min: 3.4, max: 5.4, unit: "g/dL" } },
  "total protein": { general: { min: 6.0, max: 8.3, unit: "g/dL" } },
  TSH: { general: { min: 0.4, max: 4.0, unit: "mIU/L" } },
  "free T4": { general: { min: 0.8, max: 1.8, unit: "ng/dL" } },
  LDL: { general: { min: 0, max: 100, unit: "mg/dL" } },
  HDL: {
    male: { min: 40, max: 60, unit: "mg/dL" },
    female: { min: 50, max: 60, unit: "mg/dL" },
  },
  "total cholesterol": { general: { min: 0, max: 200, unit: "mg/dL" } },
  triglycerides: { general: { min: 0, max: 150, unit: "mg/dL" } },
  "uric acid": {
    male: { min: 3.4, max: 7.0, unit: "mg/dL" },
    female: { min: 2.4, max: 6.0, unit: "mg/dL" },
  },
  PSA: { general: { min: 0, max: 4.0, unit: "ng/mL" } },
  INR: { general: { min: 0.8, max: 1.2, unit: "" } },
  PT: { general: { min: 11, max: 13.5, unit: "seconds" } },
  aPTT: { general: { min: 25, max: 35, unit: "seconds" } },
  "vitamin D": { general: { min: 20, max: 50, unit: "ng/mL" } },
  "vitamin B12": { general: { min: 200, max: 900, unit: "pg/mL" } },
  ferritin: {
    male: { min: 24, max: 336, unit: "ng/mL" },
    female: { min: 11, max: 307, unit: "ng/mL" },
  },
  "serum iron": { general: { min: 60, max: 170, unit: "µg/dL" } },
  TIBC: { general: { min: 240, max: 450, unit: "µg/dL" } },
  ESR: {
    male: { min: 0, max: 15, unit: "mm/hr" },
    female: { min: 0, max: 20, unit: "mm/hr" },
  },
  CRP: { general: { min: 0, max: 1.0, unit: "mg/L" } },
};

const VALUE_PATTERN =
  /\b([\w\s]+?)[\s:]+([0-9]+(?:\.[0-9]+)?)\s*([\w/%µ²³]+)?\b/gi;

function getSeverity(
  value: number,
  min: number,
  max: number
): "mild" | "high" {
  if (value < min) {
    const deviation = (min - value) / min;
    return deviation > 0.25 ? "high" : "mild";
  }
  const deviation = (value - max) / max;
  return deviation > 0.25 ? "high" : "mild";
}

export function detectAbnormals(
  text: string,
  gender: "male" | "female" = "male"
): AbnormalFlag[] {
  const flags: AbnormalFlag[] = [];
  const seen = new Set<string>();

  for (const [testName, rangeEntry] of Object.entries(LAB_RANGES)) {
    const range =
      rangeEntry[gender] ?? rangeEntry.general;
    if (!range) continue;

    const escapedName = testName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = new RegExp(
      `\\b${escapedName}[\\s:=]+([0-9]+(?:\\.[0-9]+)?)\\s*([\\w/%µ²³]*)`,
      "i"
    );
    const match = text.match(pattern);

    if (match) {
      const value = parseFloat(match[1]);
      const unit = match[2] || range.unit;
      const key = `${testName}-${value}`;

      if (!seen.has(key) && (value < range.min || value > range.max)) {
        seen.add(key);
        flags.push({
          test: testName,
          value,
          unit,
          normalRange: `${range.min}–${range.max} ${range.unit}`,
          severity: getSeverity(value, range.min, range.max),
          direction: value < range.min ? "low" : "high",
        });
      }
    }
  }

  return flags;
}
