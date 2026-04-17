import { z } from "zod";

export const uploadSchema = z.object({
  file: z.instanceof(File).refine(
    (f) => f.size <= 10 * 1024 * 1024,
    "File must be 10MB or less"
  ),
});

export const summarizeSchema = z.object({
  reportId: z.string().uuid(),
  text: z.string().min(10, "Text must be at least 10 characters"),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const reportFilterSchema = paginationSchema.extend({
  status: z.enum(["processing", "complete", "error"]).optional(),
  fileType: z.enum(["pdf", "image"]).optional(),
  userId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(200).optional(),
});

export const userRoleUpdateSchema = z.object({
  role: z.enum(["patient", "admin"]),
});

export const userFilterSchema = paginationSchema.extend({
  role: z.enum(["patient", "admin"]).optional(),
  search: z.string().optional(),
});

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
] as const;

export type AcceptedMimeType = (typeof ACCEPTED_MIME_TYPES)[number];

export function isAcceptedMimeType(mime: string): mime is AcceptedMimeType {
  return ACCEPTED_MIME_TYPES.includes(mime as AcceptedMimeType);
}
