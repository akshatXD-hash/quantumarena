# MediSumm — System Architecture

End-to-end design: runtime layers, data model, request flows, AI pipeline, and security boundaries.

---

## 1. High-level architecture

```
 ┌──────────────────────────────────────────────────────────────┐
 │                          Browser                             │
 │  Next.js React · Tailwind · Zustand · Radix UI · MediaRec    │
 └──────────────────────────────┬───────────────────────────────┘
                                │ HTTPS
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │                 Next.js 14 (App Router) — Node runtime       │
 │  middleware.ts — JWT verify + admin gate                     │
 │                                                              │
 │  app/api/*                                                   │
 │   ├── auth/…        NextAuth + /signup (bcrypt)              │
 │   ├── upload        PDF / image ingestion                    │
 │   ├── summarize     Chunk · detect · retrieve · generate     │
 │   ├── translate     Hindi / Marathi                          │
 │   ├── transcribe    Audio → text (AssemblyAI)                │
 │   ├── reports/:id   CRUD                                     │
 │   └── admin/*       stats / reports / users                  │
 └────┬────────┬──────────┬──────────┬──────────┬───────────────┘
      ▼        ▼          ▼          ▼          ▼
 ┌────────┐┌────────┐┌──────────┐┌──────────┐┌──────────────┐
 │ Neon   ││ OpenAI ││ Anthropic││ OpenRtr  ││ AssemblyAI + │
 │ PG +   ││ embed  ││ Claude   ││ (fallbk) ││ Google gtx   │
 │pgvector││        ││ Sonnet   ││          ││              │
 └────────┘└────────┘└──────────┘└──────────┘└──────────────┘
```

One Next.js process. Outbound calls to:
- **Neon** — persistence + pgvector retrieval
- **OpenAI** — `text-embedding-3-small`
- **Anthropic** — Claude Sonnet (grounded generation)
- **OpenRouter** — fallback LLM chain
- **AssemblyAI** — speech-to-text
- **Google Translate gtx** — translation (public, unauthenticated)

No workers, no queues — requests complete inside the HTTP lifecycle.

---

## 2. Frontend architecture

### Route groups

| Group | Purpose | Guard |
|---|---|---|
| `app/(auth)/` | login, signup — no chrome | public |
| `app/(patient)/` | history, listen, processing, results | layout redirects unauth → `/login` |
| `app/admin/` | admin dashboard + users | layout redirects non-ADMIN → `/upload` |
| `app/upload/` | protected upload | `getProfile()` in page |
| `app/page.tsx` | landing | public |

### State

- **Client** — one Zustand store (`store/report-store.ts`) holds in-flight upload + summaries. No persistence (by design).
- **Server** — `getProfile()` in server components for hard redirects; client components fetch `/api/*` with no cache.

### Styling

Tailwind + custom utilities (`glass`, `page-bg`, `gradient-primary-btn`) in `globals.css`. shadcn/ui primitives on Radix. Dedicated print CSS on `/results`.

---

## 3. Data model

```
User                    Report                         Summary
────                    ──────                         ───────
id: cuid                id: cuid                       id: cuid
email (unique)          userId ─► User.id              reportId ─► Report.id
password (bcrypt)       filename                       sectionName
name?                   fileType ("pdf"|"image")       summaryText (TEXT)
role: Role              mimeType                       abnormalFlags (JSONB)
createdAt / updatedAt   fileSizeBytes (BigInt)         citations (JSONB)
                        rawText (TEXT?)                nextSteps (JSONB)
                        pageCount?                     createdAt
                        status: ReportStatus
                        errorMessage?

MedicalKb (RAG corpus)
─────────
id, content, embedding vector(1536), category, source, term, metadata
```

Enums: `Role = PATIENT | ADMIN`, `ReportStatus = PROCESSING | COMPLETE | ERROR`.

**Design choice.** Report = document layer (one per upload). Summary = semantic layer (one per clinical section). JSONB for flags/citations/next-steps because their shape is fixed by the LLM contract and never joined on.

**Access control.** Every report query is ANDed with `userId = currentUser.id`, unless `role === "ADMIN"`. Done in the handler, not via Postgres RLS (NextAuth doesn't project JWT into the DB session).

---

## 4. Auth flow

```
POST /api/auth/signup {email, password, name, role}
  → Zod validate → bcrypt.hash(pwd, 12) → prisma.user.create → 201

signIn("credentials") → authorize():
  findUnique({email}) → bcrypt.compare → return user
  jwt cb: token.id, token.role
  session cb: session.user.id, role   → httpOnly JWT cookie

Protected request → middleware.ts
  matcher: /upload, /results, /history, /admin, /api/*
  admin gate: token.role === "ADMIN" else 403/redirect
```

bcrypt 12 rounds. JWT strategy. `NEXTAUTH_SECRET` required.

---

## 5. Ingestion pipeline

### 5.1 PDF + image upload

```
Browser ── FormData(file) ──► POST /api/upload
                              │
   requireSession()  ◄────────┤
   validate type + ≤10 MB ◄───┤
                              │
   processFile(buf, mime)     │
     ├─ pdf-parse → {text, pageCount}
     └─ Sharp (greyscale → normalise → 2480px) → Tesseract.js "eng"
                              │
   prisma.report.create({ rawText, status: PROCESSING }) ► 200 {reportId,…}
```

Image path is CPU-heavy but accuracy-first — upscaling catches small print.

### 5.2 Audio capture

```
MediaRecorder(audio/webm)
  ─► POST /api/transcribe  → AssemblyAI
       speech_models: universal-3-pro, universal-2
       language_detection: true, summarization: bullets
     → {text, utterances, summary}
  ─► POST /api/summarize-audio → LLM fallback chain
     → {title, summary, key_points, action_items}
```

Audio mode is independent of the `Report` table.

---

## 5.5 RAG pipeline

Every section passed to the LLM is first grounded via vector similarity against a curated medical KB.

```
              ┌───────────────────────────┐
              │   User uploads file        │
              │   (PDF or image)           │
              └──────────────┬────────────┘
                             ▼
              ┌───────────────────────────┐
              │   /api/upload              │
              └──────┬────────────┬───────┘
                     ▼            ▼
          ┌──────────────┐ ┌──────────────┐
          │  pdf-parse   │ │  tesseract.js│
          └──────┬───────┘ └──────┬───────┘
                 └────────┬───────┘
                          ▼
         ┌────────────────────────────────────┐
         │  OpenAI text-embedding-3-small      │
         │  input: section chunk               │
         │  output: 1536-dim vector            │
         └───────────────┬────────────────────┘
                         ▼
         ┌────────────────────────────────────┐
         │  pgvector on Postgres               │
         │  table: medical_kb                  │
         │  query: embedding <=> $1 (cosine)   │
         │  filter: distance < 0.3             │
         │  order ASC, LIMIT topK=5            │
         └───────────────┬────────────────────┘
                         ▼
         ┌────────────────────────────────────┐
         │  Anthropic Claude Sonnet            │
         │  inputs:                            │
         │   • section text                    │
         │   • deterministic abnormal flags    │
         │   • retrieved KB passages           │
         │  output: strict JSON                │
         │    {summary_text, abnormal_flags,   │
         │     citations, next_steps}          │
         └───────────────┬────────────────────┘
                         ▼
              prisma.summary.create(...)
              one Summary row per section
```

### 5.5.1 `medical_kb`

```prisma
model MedicalKb {
  id        BigInt
  content   String
  embedding Unsupported("vector(1536)")
  category  String   // lab_range | icd10 | drug | glossary | procedure
  source    String
  term      String
  metadata  Json
  createdAt DateTime
}
```

| Category | Examples |
|---|---|
| `lab_range` | HbA1c 4.0–5.6 %, creatinine (M/F), LDL ≤100, TSH 0.4–4.0 |
| `icd10` | Code summaries for common conditions |
| `drug` | Monographs, indications, patient-safe descriptions |
| `glossary` | Plain-English definitions |
| `procedure` | Standard explanations for procedures in reports |

### 5.5.2 Retrieval — `lib/rag.ts`

```ts
export async function retrieveMedicalContext(text: string, topK = 5) {
  const { data } = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000),
  });

  return prisma.$queryRaw`
    SELECT id, content, category, source, term, metadata, created_at
    FROM medical_kb
    WHERE embedding <=> ${data[0].embedding} < 0.3
    ORDER BY embedding <=> ${data[0].embedding}
    LIMIT ${topK}
  `;
}
```

- **`text-embedding-3-small`** — best cost/quality for short clinical passages; matches the 1536-dim column.
- **Truncate input at 8000 chars** — safety rail.
- **Cosine distance (`<=>`)** — canonical for OpenAI embeddings.
- **Threshold 0.3** — strict enough that irrelevant sections get zero grounding rather than spurious grounding.
- **topK = 5** — coverage without context-window bloat.

### 5.5.3 Generation — `lib/ai.ts`

```ts
type KBContext = { term: string; content: string; source: string };
summarizeChunk(sectionName, sectionText, abnormalFlags, kbContext)
```

Claude must:
- Explain only facts in `sectionText` + pre-detected `abnormalFlags`.
- Cite retrieved passages in the `citations` array.
- Never diagnose or prescribe.
- Return strict JSON.

### 5.5.4 Hybrid: Claude-grounded + OpenRouter-fallback

Primary path: Claude Sonnet grounded by retrieval. On Anthropic failure (outage, quota, timeout), the handler falls through to the OpenRouter free-model chain (§6) with the same KB context — grounding survives the model swap.

---

## 6. Summarization pipeline

```
POST /api/summarize {reportId, text}
  │
  ▼ chunkBySections(text) — lib/section-chunker.ts
  │    29 canonical headers (Impression, Findings, Lab Results,
  │    Diagnosis, Assessment, Plan, Medications, Vitals…)
  │    min 30-char chunks, fallback "Full Report"
  │
  ▼ per chunk:
  │    detectAbnormals(text) — lib/abnormal-detector.ts
  │      40+ tests (HbA1c, creatinine, hemoglobin, LDL/HDL,
  │      TSH, ALT/AST, ferritin, CRP, PSA, INR…)
  │      gender-aware (creatinine, Hb, Hct, HDL, uric acid, ferritin, ESR)
  │      severity: >25% deviation → "high", else "mild"
  │
  │    retrieveMedicalContext(text)   [§5.5]
  │
  │    summarizeChunk(name, text, flags, kbContext):
  │      Claude Sonnet (primary) → OpenRouter fallback chain:
  │        gemma-3-27b · llama-3.3-70b · gemma-4-31b
  │        · nemotron-3-super-120b · minimax-m2.5 · openrouter/free
  │      "use ONLY pre-detected values, do not invent"
  │      strict JSON: {summary_text, abnormal_flags, citations, next_steps}
  │
  ▼ prisma.summary.create(…) per section
  ▼ prisma.report.update({status: COMPLETE})
  ▼ 200 {summaries}
```

### Why determinism-first

LLMs hallucinate lab values at rates unacceptable for health content. Computing abnormal flags in plain TS first — and forcing the model to explain *only* those — collapses the invention surface. The LLM becomes a translator, not a diagnostician.

---

## 7. Translation pipeline

```
POST /api/translate {text, language}
  → validate → map to "hi" | "mr"
  → chunk into ≤4500-char parts (GET URL limit)
  → GET translate.googleapis.com/translate_a/single
        ?client=gtx&sl=en&tl={hi|mr}&dt=t&q=<chunk>
  → parse nested-array response, concatenate
  → 200 {translatedText, language}
```

Free, sub-second, no key. An earlier OpenRouter-based version was slow and rate-limited.

---

## 8. Component architecture

### Layout

```
app/layout.tsx (fonts, providers, toaster)
  ├─ patient layout (requires auth) → Navbar + content
  ├─ admin layout (requires ADMIN)  → Navbar + content
  └─ auth layout (no chrome)
```

### Key components

| Component | Role |
|---|---|
| `LandingNavbar` | Marketing nav; CTA flips on `hasUser` |
| `Navbar` | Authed nav with role-specific links + logout |
| `DropZone` / `UploadPageClient` | File drop, validation, progress |
| `SummarySection` | Accordion item: summary, abnormal flags, citations, next steps, translate |
| `AbnormalFlagCard` | Colour-coded severity card |
| `CitationChip` | Expandable source reference |
| `NextStepsList` | Numbered action list |
| `StatsGrid` / `ReportsTable` / `UsersTable` | Admin surfaces |
| `DisclaimerBanner` | Sticky medical disclaimer on results |

### Upload state flow

```
DropZone → POST /api/upload
  → store.setUpload(...)
  → push /processing (animation)
  → POST /api/summarize {reportId, text}
  → store.setSummaries(...)
  → push /results
     └─ per section: optional translate → POST /api/translate
```

Navigating `/results?reportId=<id>` from history fetches `/api/reports/:id` directly, bypassing the store.

---

## 9. Security model

**Network** — LLM + STT via server-held keys. Audio never goes browser → AssemblyAI directly. Translation proxied server-side to avoid PHI in referrers.

**Auth** — bcrypt 12 rounds, JWT sessions, email normalised, Zod-validated min length 8.

**Authorization** — middleware on every protected path; admin paths re-check `token.role`; handlers call `requireSession()` / `requireAdmin()`.

**Data scoping** — every non-admin report query is ANDed with `userId = session.user.id`.

**Transport + content** — httpOnly JWT cookies (Secure + SameSite=Lax), file-type allowlist, 10 MB cap, `rawText` encrypted at rest in Neon.

**Safety guardrails** — prompt forbids diagnosis/prescription/speculation; abnormal flags are deterministic; disclaimer banner on every results view.

---

## 10. Performance & scalability

| Concern | Current | Future |
|---|---|---|
| PDF parsing | Blocking, <300 ms typical | Stream for >10 MB |
| OCR | Tesseract.js 3–8 s/page | Offload to PaddleOCR microservice |
| LLM | Sequential per section, 4–10 s | Parallelise with `Promise.all` |
| DB | Neon pooled | Already serverless |
| Rate limits | 429 → next model | Add per-user quota |
| Translation | Google gtx | Owned Translation API at scale |

---

## 11. Deployment

Designed for **Vercel**. Serverless API routes (max duration 60 s on `/api/transcribe`). Neon pooled URL. All secrets as env vars. Portable to any Node 20+ host.

---

## 12. Known limitations

- Tesseract.js is English-only.
- Deterministic detector covers 40+ common tests — rare tumour markers won't flag.
- Raw text is stored, not the original file — re-rendering the source PDF isn't supported (no blob storage at MVP).
- Free LLM chain can degrade to an "all models failed" path — a safe generic summary still ships.
- Translation is text-only — embedded image text isn't re-translated.
