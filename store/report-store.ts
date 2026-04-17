"use client";

import { create } from "zustand";
import type { FileType, Summary } from "@/types";

interface ReportState {
  rawText: string;
  filename: string;
  blobUrl: string;
  fileType: FileType | null;
  mimeType: string;
  fileSizeBytes: number;
  pageCount: number;
  reportId: string | null;
  characterCount: number;
  estimatedReadingTime: number;
  summaries: Summary[];
  isProcessing: boolean;
  uploadProgress: number;
  error: string | null;
}

interface ReportActions {
  setUpload: (data: {
    rawText: string;
    filename: string;
    blobUrl: string;
    fileType: FileType;
    mimeType: string;
    fileSizeBytes: number;
    pageCount: number;
    reportId: string | null;
    characterCount: number;
    estimatedReadingTime: number;
  }) => void;
  setSummaries: (summaries: Summary[]) => void;
  setProcessing: (isProcessing: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: ReportState = {
  rawText: "",
  filename: "",
  blobUrl: "",
  fileType: null,
  mimeType: "",
  fileSizeBytes: 0,
  pageCount: 0,
  reportId: null,
  characterCount: 0,
  estimatedReadingTime: 0,
  summaries: [],
  isProcessing: false,
  uploadProgress: 0,
  error: null,
};

export const useReportStore = create<ReportState & ReportActions>((set) => ({
  ...initialState,

  setUpload: (data) =>
    set({
      rawText: data.rawText,
      filename: data.filename,
      blobUrl: data.blobUrl,
      fileType: data.fileType,
      mimeType: data.mimeType,
      fileSizeBytes: data.fileSizeBytes,
      pageCount: data.pageCount,
      reportId: data.reportId,
      characterCount: data.characterCount,
      estimatedReadingTime: data.estimatedReadingTime,
    }),

  setSummaries: (summaries) => set({ summaries }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  setUploadProgress: (uploadProgress) => set({ uploadProgress }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
