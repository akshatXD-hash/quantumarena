import { parsePDF } from "@/lib/pdf-parser";
import type { FileType } from "@/types";

interface ProcessedFile {
  text: string;
  pageCount: number;
  fileType: FileType;
}

export async function processFile(
  buffer: Buffer,
  mimeType: string
): Promise<ProcessedFile> {
  if (mimeType === "application/pdf") {
    const result = await parsePDF(buffer);
    return {
      text: result.text,
      pageCount: result.pageCount,
      fileType: "pdf",
    };
  }

  return processImage(buffer);
}

async function processImage(buffer: Buffer): Promise<ProcessedFile> {
  const sharp = (await import("sharp")).default;
  const { createWorker } = await import("tesseract.js");

  const preprocessed = await sharp(buffer)
    .greyscale()
    .normalise()
    .resize({ width: 2480, withoutEnlargement: true })
    .png()
    .toBuffer();

  const worker = await createWorker("eng");
  const { data } = await worker.recognize(preprocessed);
  await worker.terminate();

  const text = data.text.trim();

  if (text.length < 10) {
    throw new Error(
      "The image is unreadable — OCR could not extract text. Please ensure the image is clear and try again."
    );
  }

  return {
    text,
    pageCount: 1,
    fileType: "image",
  };
}
