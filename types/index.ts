export type UserRole = "patient" | "admin";

export type FileType = "pdf" | "image";

export type ReportStatus = "processing" | "complete" | "error";

export type KBCategory =
  | "lab_range"
  | "icd10"
  | "drug"
  | "glossary"
  | "procedure";

export interface Profile {
  id: string;
  role: UserRole;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  filename: string;
  blob_url: string;
  file_type: FileType;
  mime_type: string;
  file_size_bytes: number;
  raw_text: string | null;
  page_count: number | null;
  status: ReportStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface AbnormalFlag {
  test: string;
  value: number;
  unit: string;
  normalRange: string;
  severity: "mild" | "high";
  direction: "high" | "low";
}

export interface Citation {
  source: string;
  claim: string;
  url?: string;
}

export interface Summary {
  id: string;
  report_id: string;
  section_name: string;
  summary_text: string;
  abnormal_flags: AbnormalFlag[];
  citations: Citation[];
  next_steps: string[];
  created_at: string;
}

export interface MedicalKB {
  id: number;
  content: string;
  embedding: number[] | null;
  category: KBCategory;
  source: string;
  term: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ReportWithSummaries extends Report {
  summaries: Summary[];
}

export interface ReportWithProfile extends Report {
  profiles: Profile;
}

export interface ProfileWithReportCount extends Profile {
  report_count: number;
}

export interface SectionChunk {
  sectionName: string;
  text: string;
}

export interface SummaryResult {
  summary_text: string;
  abnormal_flags: AbnormalFlag[];
  citations: Citation[];
  next_steps: string[];
}

export interface UploadResult {
  blobUrl: string;
  text: string;
  filename: string;
  fileType: FileType;
  mimeType: string;
  fileSizeBytes: number;
  pageCount: number;
  reportId: string | null;
  characterCount: number;
  estimatedReadingTime: number;
}

export interface AdminStats {
  total_reports: number;
  reports_today: number;
  reports_this_week: number;
  total_patients: number;
  reports_by_status: Record<ReportStatus, number>;
  reports_by_file_type: Record<FileType, number>;
  total_summaries: number;
  total_abnormal_flags: number;
  avg_sections_per_report: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LabRange {
  min: number;
  max: number;
  unit: string;
}

export interface LabRangeEntry {
  male?: LabRange;
  female?: LabRange;
  general?: LabRange;
}
