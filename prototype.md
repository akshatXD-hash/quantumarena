# MediSumm — Prototype Walkthrough

photos of the actual prototype are shared in the drive below
https://drive.google.com/drive/folders/1tUauQMKBIE96yFOJFsMkK2tC-EmXWiZe?usp=sharing

What the prototype does, how to demo it, what's real vs. scaffolding, and the known edges.

---

## 1. What the prototype demonstrates

A judge can do this in under 4 minutes:

1. Sign up as a **Patient** → `/upload`.
2. Drop a PDF lab report → text extracted.
3. Processing animation → `/results`.
4. **Original on the left, plain-English summary on the right** with abnormal values, citations, and next steps.
5. Click **Translate → हिन्दी** → sub-second Hindi translation.
6. Switch to **मराठी** → same.
7. **Download PDF** → print-ready.
8. Open **History** → card with status, size, section count.
9. Log in as **Admin** → platform stats + full reports table.
10. Optional: **Record Audio** → transcribe + summarize.

End-to-end against Neon (pgvector), OpenAI embeddings, Claude Sonnet, OpenRouter, AssemblyAI, and Google Translate.

> **RAG under the hood.** Every summary is produced by retrieval-augmented generation:
>
> ```
> PDF/image ─► pdf-parse / tesseract.js ─► OpenAI text-embedding-3-small
>                                              │
>                                              ▼
>                                pgvector similarity search on medical_kb
>                                              │
>                                              ▼
>                                Anthropic Claude Sonnet → final summary
> ```
>
> Cosine-distance query (`<=> < 0.3`, `topK=5`) over a curated corpus of lab ranges, ICD-10, drug monographs, glossary, and procedures. That grounding is why we can say "won't invent medical claims."

---

## 2. User journeys

### 2.1 Patient — document flow

```
[/] → Signup (PATIENT) → [/upload]
                              │ drop PDF/image
                              ▼  POST /api/upload
                         processing animation
                              │  POST /api/summarize  (RAG + Claude)
                              ▼
                         [/results]
                           ├─ original report
                           ├─ per-section accordion
                           │    ├─ summary (Grade-8 English)
                           │    ├─ abnormal flags (severity cards)
                           │    ├─ citations (from KB retrieval)
                           │    ├─ next steps
                           │    └─ Translate → Hindi / Marathi
                           ├─ Copy / Download PDF / New report

[/history] → card grid → View / Delete
```

### 2.2 Patient — audio

```
[/listen] → record → Stop & analyze
  → POST /api/transcribe   (AssemblyAI) → transcript
  → POST /api/summarize-audio → {title, summary, key_points, action_items}
```

### 2.3 Admin

```
Login (ADMIN) → [/admin]
  ├─ 4 stat cards (total, today, this week, patients)
  ├─ status + file-type breakdowns
  └─ filterable ReportsTable
[/admin/users] → users + report counts
```

Middleware + `requireAdmin()` double-gate every admin route.

---

## 3. Demo script (4 minutes)

**0:00 — Hook.** "Most patients can't read their own lab reports. We fixed that."

**0:15 — Sign up** as patient.

**0:30 — Drop the sample PDF.** *"We OCR images too; PDFs go through pdf-parse for speed."*

**0:50 — Processing.** *"We chunk the report by clinical section, flag abnormal lab values with deterministic rules — no AI — then retrieve relevant medical references from our pgvector store, and only then does Claude write the explanation."*

**1:30 — Results page.**
- Original ↔ plain English.
- Point at an **abnormal flag card** (severity colour).
- Point at **citations** — *"those are KB passages from our pgvector store. We embed each section with `text-embedding-3-small`, retrieve top-5 relevant references, and Claude writes the explanation grounded on them."*
- Point at **next steps**.

**2:30 — Translate.** Click हिन्दी. *"Sub-second, free, no API key — Google's public endpoint with chunked fallback."*

**3:00 — History.** *"Everything persisted in Neon Postgres."*

**3:20 — Admin login.** *"Platform-wide view a clinic admin would have."*

**3:50 — Close.** Mention audio mode, the pgvector KB, Vercel deployment.

---

## 4. Screens built

| Screen | Path | Status |
|---|---|---|
| Landing | `/` | ✅ |
| Signup | `/signup` | ✅ Role selector, password strength |
| Login | `/login` | ✅ |
| Upload | `/upload` | ✅ Drag-drop + validation |
| Processing | `/processing` | ✅ Animated steps |
| Results | `/results` | ✅ Split view, accordion, translate, print |
| History | `/history` | ✅ Cards, search, filter, pagination, delete |
| Listen | `/listen` | ✅ Record → transcribe → summarize |
| Admin | `/admin` | ✅ Stats + reports |
| Admin users | `/admin/users` | ✅ |

---

## 5. Under the hood (for judges)

### 5.0 RAG — `lib/rag.ts` + `lib/ai.ts`
- `retrieveMedicalContext(text, topK=5)` embeds with OpenAI `text-embedding-3-small` (1536-dim) and runs pgvector cosine search:
  ```sql
  SELECT … FROM medical_kb
  WHERE embedding <=> $q < 0.3
  ORDER BY embedding <=> $q
  LIMIT $topK
  ```
- Retrieved passages are threaded into the Claude Sonnet prompt as `KBContext[]` alongside section text + deterministic flags.
- Claude cites them in the `citations` array — that's where the Sources chips come from.
- If Anthropic is down, OpenRouter fallback runs with the same KB context. Grounding survives the model swap.

### 5.1 Deterministic abnormal detector — `lib/abnormal-detector.ts`
- TS regex matcher across 40+ lab tests.
- Gender-aware: creatinine, hemoglobin, hematocrit, HDL, uric acid, ferritin, ESR.
- Severity is a pure deviation calc (`>25%` → high).
- **Zero LLM calls.** Output is injected into the prompt as ground truth.

### 5.2 LLM constraints — `app/api/summarize/route.ts`
- "Use ONLY pre-detected values, do not invent others."
- "Never diagnose, prescribe, or speculate."
- Strict JSON output, robust extractor survives chatty models.
- 6-model OpenRouter fallback chain.

### 5.3 Section chunker — `lib/section-chunker.ts`
- 29 medical headers recognised; falls back to "Full Report" if none match.
- 30-char minimum to avoid feeding empty sections.

### 5.4 Translation — `app/api/translate/route.ts`
- Google `translate_a/single` public endpoint. 4500-char chunking. No key, no rate limit.

### 5.5 Role-safe access — `middleware.ts` + handlers
- `/admin/*` + `/api/admin/*` require `token.role === "ADMIN"`.
- Every patient query ANDs `userId = session.user.id`.

---

## 6. Tested against

- Synthetic lab reports (HbA1c, glucose, creatinine, Hb, LDL/HDL, TSH).
- Scanned JPG of a hand-printed prescription (image path).
- Multi-page discharge summaries with headers.
- Short symptom-description audio (audio path).

Keep a known-good PDF ready for demo — most deterministic path.

---

## 7. Built vs. scaffolding

| Feature | Status |
|---|---|
| Auth (signup / login / role gate) | ✅ |
| PDF ingestion | ✅ |
| Image OCR ingestion | ✅ |
| Section chunker (29 headers) | ✅ |
| Deterministic abnormal detector (40+ tests) | ✅ |
| OpenAI embedding of sections (`text-embedding-3-small`) | ✅ |
| pgvector similarity search (cosine, `<0.3`, topK=5) | ✅ |
| Claude Sonnet grounded summary | ✅ wired in `lib/ai.ts` + `lib/prompts.ts` |
| OpenRouter fallback chain (6 free models) | ✅ |
| Per-section summary render | ✅ |
| Hindi / Marathi translation | ✅ |
| Print-to-PDF | ✅ |
| Audio record + transcribe + summarize | ✅ |
| History with search/filters | ✅ |
| Admin dashboard | ✅ |
| `medical_kb` seed corpus | 🟡 Schema + retrieval live; lab ranges + glossary in, full ICD-10 + drugs rolling in |
| Vercel Blob object storage | 🟡 Installed but unused (raw text in DB) |
| WhatsApp / SMS delivery | ❌ Roadmap |
| Longitudinal trend view | ❌ Roadmap |

---

## 8. Known limitations

- OCR is **English-only** — a Hindi handwritten note won't parse. Translation happens after summarization, not during ingestion.
- Original PDF isn't re-renderable — we store text, not the file.
- Free LLM chain can rate-limit — mitigated by 6-model fallback + safe generic-summary path.
- Translation uses an unofficial public endpoint — demo-grade; production would swap to an owned API.
- No clinician/cohort views yet.

---

## 9. Run locally

```bash
npm install
cp .env.example .env.local
# Fill DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL,
# OPENAI_API_KEY, ANTHROPIC_API_KEY, ASSEMBLYAI_API_KEY

npx prisma db push
npx prisma generate

npm run dev   # http://localhost:3000
```

Demo accounts to seed before judging:
- `patient@demo.com` / `demopass123` — PATIENT
- `admin@demo.com`   / `adminpass123` — ADMIN

---

## 10. Failure modes

| Failure | User sees | Recovery |
|---|---|---|
| >10 MB file | "File exceeds 10 MB limit" | Smaller upload |
| Unsupported mime | "Only PDF/Image files accepted" | Valid type |
| Empty OCR | "Image unreadable — try a clearer photo" | Retake |
| All LLMs down | Safe generic summary + "consult doctor" | None — summary still ships |
| Translation down | Inline error; **Show original** still works | Retry |
| Mic denied | "Microphone access denied" | Grant permission |
| Session expired | Redirect to `/login` | Log in |

---

## 11. What we want judges to take away

1. **Safety-first AI in a weekend.** Deterministic detector + RAG-grounded Claude generation is the right shape for medical content — reports are explained *only* in terms of (a) values our code flagged and (b) passages our vector store retrieved.
2. **Health literacy + language access at zero marginal cost.** Free translation via the right endpoint, not a marquee vendor.
3. **Production-shaped, not a notebook.** Auth'd multi-tenant app with admin tooling.
4. **Low unit cost.** OpenRouter free-tier + public translation + OSS OCR — baseline operating cost is near-zero, which matters for Indian primary care.


