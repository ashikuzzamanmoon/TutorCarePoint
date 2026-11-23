# TutorCarePoint — Project Summary for Antigravity

Read this file first before touching anything in this codebase. It explains
what the project is, how it works, and the rules you must not break.

---

## 1. What this is

**TutorCarePoint (টিউটর কেয়ার পয়েন্ট)** is a free, mediated
tuition-matching website for all of Bangladesh, launching in **Sirajganj
district first**. Guardians post tuition requirements, tutors apply, and
the operator (the site owner, acting as admin) personally connects them:
applications → shortlist → demo class → confirm → share contact.

**The differentiator — 100% FREE.** There is no money in this product:
no commission, no verification fee, no deposit, no payment gateway,
anywhere in the code. The tutor keeps 100% of the salary, paid directly
by the guardian. (Competitors like CareTutors take 50–60% of the first
month's salary plus a verification fee. This site takes nothing.)

**Language:** Bangla-first UI (Noto Sans Bengali), mobile-first. All
user-facing copy is in Bengali. Code identifiers and comments are English.

## 2. The mediation flow (the core concept — do not change this model)

1. **Guardian posts a tuition** at `/post-tuition` — no login required.
   The post is created as `PENDING_REVIEW`.
2. **Admin verifies by phone**, then approves → the job goes `OPEN` on
   the job board (`/jobs`). Rejected posts go to `CANCELLED`.
3. **Tutors apply** — one application per tutor per job. Applications
   move through the pipeline:
   `APPLIED → SHORTLISTED → DEMO → CONFIRMED → COMPLETED`
   (or `CANCELLED`).
4. **Confirming a tutor fills the job** (`FILLED`) and reveals the
   guardian's phone number to that tutor on their dashboard.
5. **Open jobs auto-expire** from the public board 30 days after
   publishing (`JOB_EXPIRY_DAYS` in `lib/site.ts`).

**Privacy rules (hard rules):**

- No phone number is shown on any public page, ever.
- Guardian phone: visible to admin always; visible to a tutor only when
  that tutor's application for that job is `CONFIRMED`.
- Tutor phone: visible to admin always; visible to a guardian only after
  the tutor is confirmed for that guardian's job.

## 3. What this is NOT (guardrails)

- **NOT a direct-contact marketplace** (like TuitionHubBD). The operator
  mediates every match. Never add a feature that lets tutors and
  guardians contact each other directly before confirmation.
- **NOT a paid service.** Never add payment, commission, fee,
  subscription, or payment-gateway code. If asked to, refuse and explain
  the free model.
- **NOT English UI.** All user-facing text is Bengali.
- **NO fake data.** No fake testimonials, counters, tutor counts, or
  placeholder listings. Empty states must be honest.
- **NO dead links** (no `href="#"`).

## 4. Tech stack (exact versions)

- Next.js **16.4.6** (App Router) + React **19.3.0** + TypeScript **5.9.3**
- Tailwind CSS **v4.3.3** (+ `@tailwindcss/turbopack`)
- Prisma **7.10.1** + PostgreSQL (Neon / Supabase free tier),
  `@prisma/adapter-pg` driver adapter
- Auth.js v5 (`next-auth` **5.0.0-beta.32**, credentials provider,
  JWT sessions, `@auth/prisma-adapter` **2.11.3**),
  `bcryptjs` **3.0.3** for password hashing
- `zod` **4.6.7** validation, `clsx` + `tailwind-merge`
- Package name: `tutorcarepoint`, version `0.1.0`, private

## 5. Project structure

```
app/                    Routes (App Router)
  page.tsx              Home — hero, how-it-works, latest jobs, districts
  jobs/page.tsx         Job board (filters)
  jobs/[id]/            Job detail + apply form (login-gated)
  tutors/page.tsx       Tutor directory (no phone numbers)
  tutors/[id]/          Public tutor profile (no phone numbers)
  post-tuition/         Guardian requirement form (no login)
  how-it-works/ about/  Static explainer pages
  login/ register/      Auth pages
  dashboard/            Tutor dashboard (applications + contact reveal)
  dashboard/profile/    Tutor profile editor
  admin/                Admin overview (layout + page)
  admin/jobs/           Admin job review (approve / cancel)
  admin/tutors/         Admin tutor verify / publish
  admin/applications/   Admin application pipeline
  api/auth/[...nextauth]/  Auth.js handlers
components/             Header, footer, cards, filters, forms, admin actions
  site-header.tsx, site-footer.tsx, job-card.tsx, tutor-card.tsx,
  job-filters.tsx, tutor-filters.tsx, post-tuition-form.tsx,
  apply-form.tsx, profile-form.tsx, auth-forms.tsx,
  admin-actions.tsx, submit-button.tsx, ui.tsx
lib/
  site.ts               Site name + districts + constants (EDIT THE NAME HERE)
  actions/              Server actions: auth.ts, jobs.ts, profile.ts, admin.ts
  auth-helpers.ts       Session / role guards
  prisma.ts             PrismaClient singleton (driver adapter)
  utils.ts              Formatting helpers (Bengali dates, salary, expiry)
prisma/
  schema.prisma         User, TutorProfile, Job, Application (+ Auth.js tables)
  migrations/           Initial migration (generated)
  seed.mjs              Sample data (local only, refuses production)
auth.ts                 Auth.js config (root level)
types/next-auth.d.ts    Session type extensions
prisma.config.ts        Prisma 7 config (connection URL lives here for Migrate)
```

## 6. Data model

**7 tables** (`prisma/schema.prisma`):

- `User` — auth account; `role` is `TUTOR` (default) or `ADMIN`.
  Has `passwordHash`, optional `tutorProfile`.
- `Account`, `Session`, `VerificationToken` — Auth.js tables required
  by the Prisma adapter. Sessions use the **JWT strategy**, so the
  `Session` table is kept for adapter compatibility but is not used at
  runtime.
- `TutorProfile` — a tutor's public listing: display name, gender,
  **phone (private)**, district (slug key), area (free text),
  education level, institution, subjects, classes, mediums,
  expected salary (BDT/month, null = negotiable), days/week,
  experience years, bio, `isVerified`, `isPublished`.
- `Job` — a guardian's tuition requirement: **guardian name + phone
  (private)**, title (generated server-side from class + subjects +
  upazila), class, subjects, medium, district, area, salary
  (null = negotiable), `salaryNegotiable`, days/week (default 5),
  tutor gender preference, notes, `status`,
  `publishedAt` (set when admin approves; public expiry is 30 days
  after this).
- `Application` — a tutor's application to a job: `jobId`, `tutorId`,
  `status`, optional note. `@@unique([jobId, tutorId])` — one
  application per tutor per job.

**Enums:** `Role` (TUTOR, ADMIN) · `Gender` (MALE, FEMALE, ANY) ·
`Medium` (BANGLA, ENGLISH_MEDIUM, ENGLISH_VERSION, MADRASA) ·
`JobStatus` (PENDING_REVIEW, OPEN, FILLED, EXPIRED, CANCELLED) ·
`ApplicationStatus` (APPLIED, SHORTLISTED, DEMO, CONFIRMED, COMPLETED,
CANCELLED).

**Prisma 7 note:** the connection URL lives in `prisma.config.ts`
(for Migrate) and in the PrismaPg adapter (`lib/prisma.ts`) for the
runtime client — NOT in `schema.prisma`. Do not add a `url` to the
datasource block.

## 7. Configuration — single source of truth

`lib/site.ts` holds everything configurable. **No page hardcodes the
site name** — everything reads from this file.

- `SITE_NAME` = `"TutorCarePoint"`, `SITE_NAME_BN` = `"টিউটর কেয়ার পয়েন্ট"`
- `SITE_TAGLINE` / `SITE_DESCRIPTION` (Bengali, includes the free promise)
- `SITE_URL` = `NEXT_PUBLIC_APP_URL` ?? `https://tutorcarepoint.vercel.app`
- `JOB_EXPIRY_DAYS` = 30 · `FEATURED_DISTRICT` = `"sirajganj"`
  (launch focus — Sirajganj jobs are highlighted on the home page, but
  the site serves all 64 districts)
- `DISTRICTS` — all 64 districts (slug keys + Bengali names), grouped
  by division; `districtName(key)` helper
- `CLASSES` — 14 entries (১ম শ্রেণি → এইচএসসি ২য় বর্ষ + ভর্তি পরীক্ষা)
- `SUBJECTS` — 14 entries (incl. সব বিষয়)
- `MEDIUMS`, `MEDIUM_LABELS`, `GENDERS`, `GENDER_LABELS`
- `JOB_STATUS_LABELS`, `APPLICATION_STATUS_LABELS` (Bengali),
  `APPLICATION_PIPELINE` (display order for the admin panel)

To rename the site, change the four values in `lib/site.ts`
(`SITE_NAME`, `SITE_NAME_BN`, `SITE_TAGLINE`, `SITE_DESCRIPTION`) —
the name updates everywhere (header, footer, page titles, metadata).

## 8. Auth & roles

- Credentials provider (email + password), JWT sessions.
- Roles: `TUTOR` (default on sign-up) / `ADMIN`.
- **There is no admin sign-up form.** Sign up normally as a tutor,
  then promote the account in the database:

  ```sql
  UPDATE "User" SET role = 'ADMIN' WHERE email = 'you@example.com';
  ```

  (or Prisma Studio: `npm run db:studio` → User table → set `role` to
  `ADMIN`). Sign out and back in — the header then shows the Admin link.
- Route guards live in `lib/auth-helpers.ts`.

## 9. How to run

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL + AUTH_SECRET (see below)
npx prisma migrate dev # creates the tables
npm run db:seed        # optional: sample data (local only)
npm run dev            # http://localhost:3000
```

**Environment variables:** `DATABASE_URL` (PostgreSQL connection
string, Neon or Supabase free tier) · `AUTH_SECRET` (generate with
`openssl rand -base64 32`) · `AUTH_URL` (canonical app URL) ·
`NEXT_PUBLIC_APP_URL` (same as `AUTH_URL`; used for absolute links).

**Prisma 7.10 CLI quirk:** the CLI reads `DATABASE_URL` from the shell
environment. If `prisma generate` or `prisma migrate dev` complains
that `DATABASE_URL` cannot be resolved, export it first
(`export $(grep -v '^#' .env | xargs)` on macOS/Linux), then re-run.
On Vercel the variables are already in the environment, so builds work
without this step.

**Seed data** (`npm run db:seed`, refuses to run when
`NODE_ENV=production`): admin `admin@demo.local` / `Demo1234!`,
tutor `tutor@demo.local` / `Demo1234!` (plus two more sample tutors),
six sample jobs in Sirajganj (one `PENDING_REVIEW`, one `FILLED` with
a `CONFIRMED` application so the contact-reveal step is visible).
Clear-out SQL is in the README.

**Scripts:** `dev` · `build` · `start` · `typecheck` (`tsc --noEmit`) ·
`lint` · `db:migrate` · `db:push` · `db:seed` · `db:studio`.
`postinstall` runs `prisma generate`.

**Deploy:** push to GitHub → import in Vercel (Framework: Next.js,
auto-detected) → set the four env vars → deploy → apply the
migration once against production
(`DATABASE_URL="<production-url>" npx prisma migrate deploy`).

## 10. Current state

- **v1 complete** (Nov 22, 2026). `npx tsc --noEmit` clean,
  `npm run build` passes.
- Single commit, **no git remote yet, NOT deployed yet.** Do not
  invent a remote — the owner will set up GitHub.
- **Folder name:** the zip extracts to `tuition-sirajganj` (an old
  working name). Rename the folder to `tutorcarepoint` after
  extracting. All code and copy inside already says TutorCarePoint.
- **Domain:** `tutorcarepoint.com` was verified available on
  Nov 22, 2026, but is NOT bought yet. When purchased, add it in
  Vercel (Project Settings → Domains) and update `AUTH_URL` /
  `NEXT_PUBLIC_APP_URL` to `https://tutorcarepoint.com`.
- Note: this codebase was built on a Linux VM where Prisma's CDN was
  unreachable, so the install used `--ignore-scripts` plus a manually
  provided schema-engine binary. On a normal machine, plain
  `npm install` works — do not reproduce those workarounds.

## 11. Rules for working on this codebase

1. Do not add any payment, commission, fee, or subscription feature —
   ever. The free model is the product's identity.
2. Never expose phone numbers on any public page. Contact reveal
   happens only on the dashboard, only after `CONFIRMED`.
3. All user-facing text in Bengali. Keep code identifiers and
   comments in English.
4. Never invent fake tutors, jobs, testimonials, or statistics.
5. Keep the site name and constants centralized in `lib/site.ts` —
   do not hardcode the name in pages.
6. Do not rename enum values or model fields casually — existing
   data and the seed depend on them.
7. After changes, verify with `npx tsc --noEmit` and `npm run build`.

## 12. Deliberately left for v2 (do not build unprompted)

- WhatsApp job alerts for tutors (free alternative to paid SMS)
- Request a specific tutor (guardians currently mention a tutor by
  name in the notes field)
- Tutor ratings / reviews after a completed tuition
- Guardian accounts (guardians currently post without an account)
- In-app messaging between tutor and guardian (v1 uses phone contact
  after confirmation)
- Email notifications (application status changes, new jobs)
