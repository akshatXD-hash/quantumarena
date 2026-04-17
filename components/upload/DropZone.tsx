"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, FileText, Image, X } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { ACCEPTED_MIME_TYPES, isAcceptedMimeType } from "@/lib/validators";

const MAX_FILE_SIZE = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB ?? "10") * 1024 * 1024;

const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.webp,.tiff,.tif";

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled = false }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): string | null {
    if (!isAcceptedMimeType(file.type)) {
      return `Unsupported file type: ${file.type}. Please upload a PDF, JPEG, PNG, WEBP, or TIFF file.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File is too large (${formatBytes(file.size)}). Maximum size is ${process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB ?? "10"}MB.`;
    }
    return null;
  }

  function handleFile(file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }
    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function clearFile() {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const isPDF = selectedFile?.type === "application/pdf";

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center w-full min-h-[200px] rounded-lg border-2 border-dashed transition-all cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30",
          disabled && "opacity-50 cursor-not-allowed",
          selectedFile && "border-green-400 bg-green-50/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          className="sr-only"
          onChange={handleInputChange}
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            {isPDF ? (
              <FileText className="h-10 w-10 text-red-500" />
            ) : (
              <Image className="h-10 w-10 text-blue-500" />
            )}
            <div>
              <p className="font-medium text-sm">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatBytes(selectedFile.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <Upload className={cn(
              "h-10 w-10 transition-colors",
              isDragOver ? "text-primary" : "text-muted-foreground"
            )} />
            <div>
              <p className="font-medium text-sm">
                {isDragOver ? "Drop your file here" : "Drag and drop your medical report"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              PDF, JPEG, PNG, WEBP, TIFF — up to {process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB ?? "10"}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-start gap-1">
          <X className="h-4 w-4 mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
