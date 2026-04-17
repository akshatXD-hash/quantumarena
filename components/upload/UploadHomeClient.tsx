"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropZone } from "@/components/upload/DropZone";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { useReportStore } from "@/store/report-store";
import type { UploadResult } from "@/types";

export function UploadHomeClient() {
  const router = useRouter();
  const { setUpload, setProcessing, setSummaries, setError, setUploadProgress, uploadProgress } =
    useReportStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleAnalyse() {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setUploadProgress(30);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(60);

      if (!uploadRes.ok) {
        const err = (await uploadRes.json()) as { error: string };
        throw new Error(err.error ?? "Upload failed");
      }

      const uploadData: UploadResult = await uploadRes.json();

      setUpload({
        rawText: uploadData.text,
        filename: uploadData.filename,
        blobUrl: uploadData.blobUrl,
        fileType: uploadData.fileType,
        mimeType: uploadData.mimeType,
        fileSizeBytes: uploadData.fileSizeBytes,
        pageCount: uploadData.pageCount,
        reportId: uploadData.reportId,
        characterCount: uploadData.characterCount,
        estimatedReadingTime: uploadData.estimatedReadingTime,
      });

      setUploadProgress(80);
      setProcessing(true);
      router.push("/processing");

      if (!uploadData.reportId) {
        throw new Error("No report ID — are you logged in?");
      }

      const summarizeRes = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: uploadData.reportId,
          text: uploadData.text,
        }),
      });

      if (!summarizeRes.ok) {
        const err = (await summarizeRes.json()) as { error: string };
        throw new Error(err.error ?? "Summarization failed");
      }

      const summarizeData = (await summarizeRes.json()) as { summaries: Parameters<typeof setSummaries>[0] };
      setSummaries(summarizeData.summaries);
      setProcessing(false);
      setUploadProgress(100);
      router.push("/results");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setUploadError(msg);
      setError(msg);
      setProcessing(false);
      setIsUploading(false);
      setUploadProgress(0);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Upload Medical Report</h1>
        <p className="text-muted-foreground text-sm">
          Upload a PDF or image of your medical report to get a plain-English summary.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" />
            Select your report
          </CardTitle>
          <CardDescription>
            Supported: PDF, JPEG, PNG, WEBP, TIFF — up to 10 MB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <DropZone onFileSelect={setSelectedFile} disabled={isUploading} />

          {isUploading && selectedFile && (
            <UploadProgress progress={uploadProgress} filename={selectedFile.name} />
          )}

          {uploadError && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {uploadError}
            </div>
          )}

          <Button
            onClick={handleAnalyse}
            disabled={!selectedFile || isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              "Analyse Report"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
