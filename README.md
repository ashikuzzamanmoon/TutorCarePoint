# TutorCarePoint — Free Tuition Matching for Bangladesh

A free, mediated tuition-matching website for all of Bangladesh — launching
in Sirajganj district first. Guardians post tuition requirements, tutors
apply, and the operator (admin) connects them: applications → shortlist →
demo class → confirm → share contact.

**There is no money in this product.** No commission, no verification fee,
no deposit, no payment gateway — anywhere in the code. The tutor keeps 100%
of the salary, paid directly by the guardian.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Prisma 7 + PostgreSQL (Neon / Supabase free tier)
- Auth.js v5 (credentials: email + password) for tutor + admin accounts
- Bangla-first UI (Noto Sans Bengali), mobile-first

## How the mediation flow works

1. **Guardian posts a tuition** (`/post-tuition`) — no login required.
   The post is created as `PENDING_REVIEW`.
2. **Admin verifies by phone**, then approves → the job goes `OPEN` on the
   job board (`/jobs`). Rejected posts go to `CANCELLED`.
3. **Tutors apply** (one application per tutor per job). Applications move
   through the pipeline: `APPLIED → SHORTLISTED → DEMO → CONFIRMED →
   COMPLETED` (or `CANCELLED`).
4. **Confirming a tutor fills the job** (`FILLED`) and reveals the
   guardian's phone number to that tutor on their dashboard. Before
   confirmation, no phone numbers are shown anywhere public.
5. **Open jobs auto-expire** from the public board 30 days after publishing
   (`JOB_EXPIRY_DAYS` in `lib/site.ts`).

## Setup (local)

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL + AUTH_SECRET (see below)
npx prisma migrate dev # creates the tables (uses prisma/migrations)
npm run db:seed        # optional: sample data (local only, see below)
npm run dev            # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon or Supabase free tier) |
| `AUTH_SECRET` | Auth.js secret — generate with `openssl rand -base64 32` |
| `AUTH_URL` | Canonical app URL (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_APP_URL` | Same as `AUTH_URL`; used for absolute links |

> Note: with Prisma 7.10, the CLI reads `DATABASE_URL` from the shell
> environment when running `prisma` commands. If `prisma generate` or
> `prisma migrate dev` complains that `DATABASE_URL` cannot be resolved,
> export it first: `export $(grep -v '^#' .env | xargs)` (macOS/Linux),
> then re-run the command. On Vercel the variables are already in the
> environment, so builds work without this step.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel (Framework: Next.js — auto-detected).
3. Set the four environment variables above in Project Settings →
   Environment Variables (use the production `DATABASE_URL` and a fresh
   `AUTH_SECRET`; `AUTH_URL` / `NEXT_PUBLIC_APP_URL` =
   `https://tutorcarepoint.vercel.app`).
4. Deploy. `prisma generate` runs automatically on install (postinstall).

**Custom domain (planned, not bought yet):** `tutorcarepoint.com` was
verified available on Nov 22, 2026. When it is purchased, add it in
Vercel (Project Settings → Domains) and update `AUTH_URL` /
`NEXT_PUBLIC_APP_URL` to `https://tutorcarepoint.com`.
5. Apply the database migration once, from your machine:
   `DATABASE_URL="<production-url>" npx prisma migrate deploy`
   (or point a local `.env` at the production database and run
   `npx prisma migrate deploy`).

## First admin account

There is no sign-up form for admins. Sign up normally as a tutor, then
promote the account in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'you@example.com';
```

(or use Prisma Studio: `npm run db:studio` → User table → set `role` to
`ADMIN`). Sign out and back in — the header then shows the Admin link.

## Seed data (local testing only)

`npm run db:seed` creates sample data — it refuses to run when
`NODE_ENV=production`:

- Admin: `admin@demo.local` / `Demo1234!`
- Tutor: `tutor@demo.local` / `Demo1234!` (plus two more sample tutors)
- Six sample jobs in Sirajganj district (launch focus), one pending-review
  job, and sample applications — including one `CONFIRMED` application so
  the contact-reveal step is visible on the tutor dashboard.

All sample records are marked `SAMPLE` / `(SAMPLE)`. To clear them:

```sql
DELETE FROM "Job" WHERE "guardianName" LIKE 'SAMPLE%';
DELETE FROM "User" WHERE email LIKE '%@demo.local';
```

(Applications cascade-delete with their jobs; tutor profiles
cascade-delete with their users.)

## Renaming the site

The site name lives in exactly one place: `lib/site.ts`
(`SITE_NAME`, `SITE_NAME_BN`, `SITE_TAGLINE`, `SITE_DESCRIPTION`). Change
those four values and the name updates everywhere (header, footer, page
titles, metadata). The package name in `package.json` and the repo
directory can be renamed separately at any time.

## Project layout

```
app/                    Routes (App Router)
  page.tsx              Home — hero, how-it-works, latest jobs, districts
  jobs/                 Job board + job detail (apply)
  tutors/               Tutor directory + public profile (no phone numbers)
  post-tuition/         Guardian requirement form (no login)
  how-it-works/ about/  Static explainer pages
  login/ register/      Auth pages
  dashboard/            Tutor dashboard (applications + contact reveal)
  admin/                Admin panel (overview, jobs, tutors, applications)
  api/auth/[...nextauth]/  Auth.js handlers
components/             Header, footer, cards, filters, forms, admin actions
lib/
  site.ts               Site name + districts + constants (edit the name here)
  actions/              Server actions (auth, profile, jobs, admin)
  auth-helpers.ts       Session / role guards
  prisma.ts             PrismaClient singleton (driver adapter)
  utils.ts              Formatting helpers (Bengali dates, salary, expiry)
prisma/
  schema.prisma         User, TutorProfile, Job, Application (+ Auth.js tables)
  migrations/           Initial migration (generated, no DB needed to read)
  seed.mjs              Sample data (local only, refuses production)
```

## Deliberately left for v2

- **WhatsApp job alerts** for tutors (free alternative to paid SMS).
- **Request a specific tutor** — guardians currently post a requirement
  and mention a tutor by name in the notes; a direct "request this tutor"
  action is a natural v2 addition.
- **Tutor ratings/reviews** after a completed tuition.
- **Guardian accounts** — guardians currently post without an account;
  accounts would let them track their posts and shortlists.
- **In-app messaging** between tutor and guardian (v1 uses phone contact
  after confirmation).
- **Email notifications** (application status changes, new jobs).
