# MediSumm

**Turn confusing medical reports into plain English — in seconds.**

MediSumm is an AI web app that helps patients understand their lab reports, discharge summaries, scans, and prescriptions. Upload a PDF or image — MediSumm extracts the text, flags abnormal lab values with rule-based code, grounds the explanation in a curated medical knowledge base via RAG, generates a patient-friendly summary in Grade-8 English, and can translate it to Hindi or Marathi.

---

## Why MediSumm?

- **Health literacy gap** — most Indian patients can't read their own lab reports.
- **Language barrier** — reports are in clinical English; patients are often more comfortable in Hindi/Marathi.
- **Access gap** — not every patient can book a follow-up just to ask "what does this mean?"
- **Lost conversations** — verbal advice from doctors is easily forgotten.

One app, all four.

---

## What it does

1. **Understands any medical document** — PDFs via `pdf-parse`, images (JPG/PNG/WEBP) via Sharp + Tesseract.js OCR, audio via AssemblyAI.
2. **Explains it like a human would** — reports are chunked by medical section (Impression, Findings, Lab Results, Plan…) and each section is summarized in Grade-8 English.
3. **Catches the abnormal values that matter** — 40+ lab tests checked by a deterministic detector (gender-aware where needed). Severity classified `mild`/`high`. **The LLM cannot invent abnormal values** — it may only explain what the detector found.
4. **Gives real next steps** — every section ends with 3 actionable steps and source citations.
5. **Grounded in a medical KB (RAG)** — each section is embedded with OpenAI `text-embedding-3-small` (1536-dim), top-5 relevant passages are retrieved from `medical_kb` via pgvector cosine search, and passed to Claude Sonnet as grounding context.
6. **Speaks the patient's language** — one-click translation to Hindi or Marathi via Google Translate's public endpoint. No key, no rate limit.
7. **Two roles** — Patient (upload, summarize, translate, history) and Admin (platform stats, all reports, users).

---

## Feature map

| Area | Capability |
|---|---|
| Auth | Email + password, bcrypt, NextAuth JWT, role-based routing |
| Ingest | PDF parsing, image OCR, microphone audio recording |
| Understand | 29 medical section headers, 40+ deterministic lab-value checks, gender-aware |
| Retrieve (RAG) | `text-embedding-3-small` → pgvector cosine search → top-k KB passages |
| Summarize | Claude Sonnet as grounded generator; 6-model OpenRouter fallback for resilience |
| Translate | Hindi / Marathi per section via Google Translate gtx (no API key) |
| Listen | AssemblyAI transcription + summarization |
| Review | Split view (original ↔ summary), print-to-PDF, copy, history grid |
| Admin | Stats, filterable reports table, users table |
| Safety | Persistent disclaimer, "never diagnose" prompting, deterministic-flags-only constraint |

---

## Tech stack

**Frontend** — Next.js 14 App Router, TypeScript (strict), Tailwind + shadcn/ui (Radix), Zustand, lucide-react, Sora/DM Sans.

**Backend** — Next.js API route handlers, Prisma 5.22 → Neon PostgreSQL (pgvector enabled), NextAuth 4 (credentials + JWT), Zod validation.

**AI / ML**
- **OpenAI `text-embedding-3-small`** (1536-dim) — section embedding
- **pgvector** — cosine-distance similarity over `medical_kb`
- **Anthropic Claude Sonnet** — grounded patient-summary generator
- **OpenRouter** free-model chain — fallback when Claude is unavailable
- **AssemblyAI** — audio transcription + summarization
- **Tesseract.js + Sharp** — OCR pipeline
- **Google Translate** `translate_a/single` — translation

**Tooling** — pgvector (RAG), @vercel/blob (future object storage).

---

## RAG pipeline

```
PDF / image  ──►  /api/upload  ──►  pdf-parse  │  tesseract.js
                                         │
                                         ▼
                     OpenAI text-embedding-3-small  (1536-dim per chunk)
                                         │
                                         ▼
                     pgvector on Postgres — medical_kb
                     embedding <=> q  (cosine, < 0.3, topK=5)
                                         │
                                         ▼
                     Anthropic Claude Sonnet
                     + deterministic abnormal flags
                     + retrieved KB passages
                                         │
                                         ▼
                     JSON → Summary row per section
```

`medical_kb(id, content, embedding vector(1536), category, source, term, metadata)` — categories: `lab_range`, `icd10`, `drug`, `glossary`, `procedure`. Retrieval in [lib/rag.ts](lib/rag.ts); generation in [lib/ai.ts](lib/ai.ts).

---

## Project structure

```
quantumarena/
├── app/
│   ├── (auth)/            # login, signup
│   ├── (patient)/         # history, listen, processing, results
│   ├── admin/             # dashboard, users
│   ├── api/
│   │   ├── auth/          # NextAuth + signup
│   │   ├── upload/        # PDF / image ingest
│   │   ├── summarize/     # section-wise LLM summarization
│   │   ├── translate/     # Hindi / Marathi
│   │   ├── transcribe/    # AssemblyAI audio
│   │   ├── summarize-audio/
│   │   ├── reports/       # list + get + delete
│   │   ├── profile/
│   │   ├── admin/         # stats / reports / users
│   │   └── health/
│   ├── upload/
│   └── page.tsx           # landing
├── components/            # navbar, results, upload, admin, shadcn
├── lib/
│   ├── abnormal-detector.ts   # 40+ lab rules
│   ├── section-chunker.ts     # 29 medical headers
│   ├── file-processor.ts      # PDF vs image dispatch
│   ├── rag.ts                 # embed + pgvector retrieval
│   ├── ai.ts                  # Claude-grounded summarizer
│   ├── prompts.ts             # prompt builder
│   ├── auth-config.ts, auth.ts, prisma.ts, validators.ts, utils.ts
├── store/report-store.ts
├── prisma/schema.prisma       # User, Report, Summary, MedicalKb
├── middleware.ts
└── types/index.ts
```

---

## API surface

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | public | Register PATIENT or ADMIN |
| POST | `/api/auth/[...nextauth]` | public | Credentials login |
| POST | `/api/upload` | user | PDF/image → raw text |
| POST | `/api/summarize` | user | Chunk + detect + retrieve + generate |
| POST | `/api/translate` | user | English → Hindi / Marathi |
| POST | `/api/transcribe` | user | Audio → transcript |
| POST | `/api/summarize-audio` | user | Transcript → structured summary |
| GET | `/api/reports` | user | Paginated reports (admin: all) |
| GET / DELETE | `/api/reports/:id` | user | Single report + summaries |
| GET / PATCH | `/api/profile` | user | Current user |
| GET | `/api/admin/stats` | admin | Platform totals + breakdowns |
| GET | `/api/admin/reports` | admin | Searchable all-reports view |
| GET | `/api/admin/users` | admin | Users with report counts |

All routes are defended by `middleware.ts` matchers and in-handler `requireSession()` / `requireAdmin()`.

---

## Data model

```
User (id, email, password-hash, name, role)
  └── Report (filename, fileType, mimeType, fileSizeBytes,
              rawText, pageCount, status, errorMessage)
        └── Summary (sectionName, summaryText,
                     abnormalFlags JSON, citations JSON, nextSteps JSON)

MedicalKb (content, embedding vector(1536), category, source, term)
```

Enums: `Role = PATIENT | ADMIN`, `ReportStatus = PROCESSING | COMPLETE | ERROR`.

---

## Getting started

Prereqs: Node 20+, Neon Postgres URL, OpenRouter key, Anthropic key, OpenAI key (for embeddings), AssemblyAI key.

```bash
npm install
cp .env.example .env.local
# fill DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL,
# OPENAI_API_KEY, ANTHROPIC_API_KEY, ASSEMBLYAI_API_KEY

npx prisma db push
npx prisma generate

npm run dev   # http://localhost:3000
```

Commands: `npm run dev | build | start | lint | type-check`.

---

## What makes MediSumm different

1. **Deterministic + RAG + LLM hybrid.** Abnormal values come from rule-based code; explanations are grounded in retrieved KB passages; Claude only writes the final prose. The model cannot invent medical claims.
2. **Section-aware summarization** — one bounded LLM call per clinical section, not one giant prompt.
3. **Model fallback chain** — 6 free OpenRouter models if Claude is down.
4. **Translation without a paid API** — Google gtx endpoint, sub-second.
5. **Print-ready** — dedicated `@media print` styles; patients walk into clinic with a paper copy.
6. **Role-aware from day one** — Patient vs. Admin enforced in middleware, API, and UI simultaneously.

---

## Safety

MediSumm is for educational purposes only. It does not diagnose, prescribe, or replace a clinician. A disclaimer banner is pinned on every results view. The summarization prompt explicitly forbids diagnosis, prescription, and speculation.

---

## Roadmap

- Expand `medical_kb` corpus (full ICD-10, drug monographs)
- Longitudinal trend lines (HbA1c across reports)
- Clinician/clinic role for cohort views
- WhatsApp / SMS delivery
- Voice output in patient's language
- Signed URL object storage via `@vercel/blob`
