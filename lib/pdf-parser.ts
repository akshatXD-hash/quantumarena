interface PDFParseResult {
  text: string;
  pageCount: number;
}

export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  const pdfParse = (await import("pdf-parse")).default;
  const result = await pdfParse(buffer);

  const text = result.text.trim();

  if (text.length < 10) {
    throw new Error(
      "This PDF appears to be a scanned document with no extractable text. Please upload it as an image instead."
    );
  }

  return {
    text,
    pageCount: result.numpages,
  };
}
