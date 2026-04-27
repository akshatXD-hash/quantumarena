"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Mic,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReportStore } from "@/store/report-store";
import type { UploadResult } from "@/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadPageClient() {
  const router = useRouter();
  const { setUpload, setProcessing, setSummaries, setError, setUploadProgress, uploadProgress } =
    useReportStore();

  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [acceptType, setAcceptType] = useState<string>(".pdf,application/pdf,image/*");
  const inputRef = useRef<HTMLInputElement>(null);

  function validateFile(f: File): string | null {
    if (f.type !== "application/pdf" && !f.type.startsWith("image/")) {
      return "Only PDF and Image files (PNG, JPG, WEBP) are accepted.";
    }
    if (f.size > MAX_FILE_SIZE) {
      return `File is too large (${formatBytes(f.size)}). Maximum size is 10 MB.`;
    }
    return null;
  }

  function handleFile(f: File) {
    const err = validateFile(f);
    if (err) {
      setFileError(err);
      setFile(null);
      return;
    }
    setFileError(null);
    setUploadError(null);
    setFile(f);
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (isUploading) return;
      const dropped = e.dataTransfer.files[0];
      if (dropped) handleFile(dropped);
    },
    [isUploading]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!isUploading) setIsDragOver(true);
    },
    [isUploading]
  );

  function clearFile() {
    setFile(null);
    setFileError(null);
    setUploadError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleAnalyse() {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);

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
        throw new Error("No report ID — please make sure you are logged in.");
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

      const summarizeData = (await summarizeRes.json()) as {
        summaries: Parameters<typeof setSummaries>[0];
      };
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
    <div className="w-full max-w-xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2ab8c8]/10 mb-2">
          <Sparkles className="h-7 w-7 text-[#2ab8c8]" />
        </div>
        <h1 className="font-['Sora'] text-3xl font-bold tracking-tight text-[#1a2340]">Upload Your <span className="text-[#2ab8c8]">Report</span></h1>
        <p className="text-[#5a7080] text-sm max-w-sm mx-auto">
          Upload a PDF medical report and get an instant AI-powered plain-English summary.
        </p>
      </div>

      {/* Drop Zone Card */}
      <div className="glass rounded-3xl overflow-hidden">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => !isUploading && !file && inputRef.current?.click()}
          className={[
            "relative flex flex-col items-center justify-center min-h-[260px] transition-all duration-200",
            file
              ? "cursor-default"
              : isUploading
              ? "cursor-not-allowed opacity-70"
              : "cursor-pointer",
            isDragOver
              ? "bg-[#2ab8c8]/5 border-2 border-dashed border-[#2ab8c8]"
              : file
              ? "bg-[#10b981]/5 border-2 border-dashed border-[#10b981]/40"
              : "border-2 border-dashed border-[#8a9aaa]/20 hover:border-[#2ab8c8]/40 hover:bg-white/40",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptType}
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <Loader2 className="h-12 w-12 text-[#2ab8c8] animate-spin" />
              <div>
                <p className="font-semibold text-base">Analysing your report…</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This may take a moment
                </p>
              </div>
              {/* Progress bar */}
              <div className="w-full max-w-xs bg-[#f0f4f8] rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center shadow-sm">
                  <FileText className="h-8 w-8 text-red-500" />
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
              </div>
              <div>
                <p className="font-semibold text-sm truncate max-w-[240px]">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors px-2 py-1 rounded-md hover:bg-destructive/10"
              >
                <X className="h-3.5 w-3.5" />
                Remove file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div
                className={[
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200",
                  isDragOver ? "bg-primary/10" : "bg-muted",
                ].join(" ")}
              >
                <Upload
                  className={[
                    "h-8 w-8 transition-colors duration-200",
                    isDragOver ? "text-primary" : "text-muted-foreground",
                  ].join(" ")}
                />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  {isDragOver ? "Drop your file here" : "Drag & drop your report here"}
                </p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAcceptType(".pdf,application/pdf");
                      setTimeout(() => inputRef.current?.click(), 0);
                    }}
                    className="rounded-full shadow-sm hover:border-primary/50 text-foreground"
                  >
                    <FileText className="h-4 w-4 mr-2 text-red-500" />
                    Upload PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAcceptType("image/*");
                      setTimeout(() => inputRef.current?.click(), 0);
                    }}
                    className="rounded-full shadow-sm hover:border-primary/50 text-foreground"
                  >
                    <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
                    Upload Image
                  </Button>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full mt-2">
                <span className="text-xs text-muted-foreground font-medium">
                  PDF or Images (Max 10 MB)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Errors */}
        {(fileError ?? uploadError) && (
          <div className="px-4 py-3 bg-destructive/5 border-t border-destructive/10 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{fileError ?? uploadError}</p>
          </div>
        )}

        {/* Action */}
        <div className="p-4 bg-white/30 backdrop-blur-sm border-t border-white/40">
          <button
            onClick={handleAnalyse}
            disabled={!file || isUploading}
            className={[
              "w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full font-semibold text-sm transition-all duration-200",
              !file || isUploading
                ? "bg-[#e2e8f0] text-[#8a9aaa] cursor-not-allowed"
                : "gradient-primary-btn",
            ].join(" ")}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyse Report
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center text-center gap-3 mt-6">
        <p className="text-sm font-medium text-[#5a7080]">
          Want to record a live medical conversation instead?
        </p>
        <button
            onClick={() => router.push("/listen")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2ab8c8]/10 text-[#2ab8c8] hover:bg-[#2ab8c8]/20 hover:scale-105 transition-all text-sm font-semibold"
        >
          <Mic className="h-4 w-4" /> Try Audio Translation
        </button>
      </div>

      <p className="text-center text-xs text-muted-foreground pt-4">
        <strong>Privacy:</strong> Your report is processed securely and never shared.
      </p>
    </div>
  );
}
