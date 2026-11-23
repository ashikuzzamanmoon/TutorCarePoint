# 06. Atomic Implementation & Launch Plan

> **নিয়ম:** একবারে মাত্র একটি আনচেকড স্টেপে কাজ করতে হবে। প্রতিটি স্টেপের জন্য নির্ধারিত `Verification Gate` পাস করার পর তবেই সেই স্টেপকে `[x]` হিসেবে চিহ্নিত করা যাবে।

---

## Phase 1: Local Setup & Environment Verification

### - [x] Step 1: Environment & Database Configuration
- **Goal:** `.env` ফাইল প্রস্তুত করে লোকাল PostgreSQL বা Neon ডাটাবেজের সাথে সংযোগ স্থাপন এবং স্কিমা মাইগ্রেশন যাচাই।
- **Vault Refs:** `vault/04-STACK.md`, `vault/05-SCHEMA.md`
- **Target Files:** `.env`
- **Verification Gate:**
  ```powershell
  npx prisma migrate status
  ```
  *(Status: Database schema is up to date! Exit code 0)*

---

### - [x] Step 2: Sample Seed Data & Verification
- **Goal:** ডেভেলপমেন্ট ও টেস্টের জন্য ডেমো ডাটাবেজ সিডিং রান করা (অ্যাডমিন, টিউটর ও জব স্যাম্পল)।
- **Vault Refs:** `vault/04-STACK.md`
- **Target Files:** `prisma/seed.mjs`
- **Verification Gate:**
  ```powershell
  npm run db:seed
  ```
  *(Status: Seed complete! Admin & Tutor demo accounts created. Exit code 0)*

---

### - [x] Step 3: Full Codebase Build & Typecheck Gate
- **Goal:** অ্যাপ্লিকেশনে কোনো টাইপ এরর বা বিল্ড সমস্যা নেই তা শতভাগ নিশ্চিত করা।
- **Vault Refs:** `vault/04-STACK.md`
- **Target Files:** Codebase overall
- **Verification Gate:**
  ```powershell
  npm run typecheck ; npm run build
  ```
  *(Status: Typecheck clean, Next.js 16 Turbopack build passed. Exit code 0)*

---

## Phase 2: Smoke Testing & Feature Flow Validation

### - [x] Step 4: End-to-End Flow Validation (Local Runtime)
- **Goal:** লোকাল সার্ভার চালিয়ে প্রধান কোর ফ্লো ও প্রাইভেসি টেস্ট করা।
- **Vault Refs:** `vault/01-PRD.md`, `vault/03-TOKENS.md`
- **Verification Gate:**
  Browser / API verification confirming:
  - Phone number hidden on `/jobs` and `/tutors`.
  - HTTP status 200 on `/`, `/jobs`, `/tutors`.
  *(Status: All privacy checks passed. Phone numbers fully concealed. Exit code 0)*

---

## Phase 3: Git & Deployment

### - [x] Step 5: Git Repository & Remote Setup
- **Goal:** প্রজেক্ট ফোল্ডারে গিট রিপোজিটরি ইনিশিয়ালাইজ করা এবং রিমোট গিটহাব রিপোজিটরির সাথে লিংক করে কোড পুশ করা।
- **Target Files:** `.gitignore`, git tree
- **Verification Gate:**
  ```powershell
  git status
  ```
  *(Status: Remote https://github.com/ashikuzzamanmoon/TutorCarePoint.git synched)*

---

### - [ ] Step 6: Vercel Deployment & Production Migration
- **Goal:** Vercel-এ প্রজেক্ট ইমপোর্ট করা, Environment Variables সেট করা এবং প্রোডাকশন ডাটাবেজে মাইগ্রেশন চালানো।
- **Vault Refs:** `vault/04-STACK.md`
- **Verification Gate:**
  ```powershell
  npx prisma migrate deploy
  ```
  *(এবং লাইভ Vercel URL থেকে সাইট লোড হতে হবে)*
