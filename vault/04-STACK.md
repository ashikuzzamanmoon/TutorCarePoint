# 04. Technology Stack & Environment Configuration

## 1. Pinned Core Dependencies
- **Runtime:** Node.js 20+
- **Next.js:** `16.4.6` (App Router, Server Actions)
- **React:** `19.3.0`
- **TypeScript:** `5.9.3`
- **Tailwind CSS:** `4.3.3` (with `@tailwindcss/turbopack`)
- **Prisma ORM:** `7.10.1`
- **Database Driver Adapter:** `@prisma/adapter-pg` `7.10.1`
- **Database Engine:** PostgreSQL (Neon / Supabase Serverless PG)
- **Authentication:** Auth.js v5 (`next-auth`: `5.0.0-beta.32` + `@auth/prisma-adapter`: `2.11.3`)
- **Password Security:** `bcryptjs`: `3.0.3`
- **Schema Validation:** `zod`: `4.6.7`
- **Styling Helpers:** `clsx`: `2.1.1`, `tailwind-merge`: `3.7.1`

---

## 2. Forbidden Libraries & Practices (DO NOT INSTALL)
- **NO Payment Gateways:** bKash, Nagad, Rocket, SSLCommerz, Shurjopay, Stripe, Paddle ইত্যাদি কোনো পেমেন্ট এসডিকে নিষিদ্ধ।
- **NO Heavy UI Kits:** Material UI, AntD, Chakra ইত্যাদি ভারী লাইব্রেরি যা প্রজেক্টের লাইটওয়েট ডিজাইন ও পারফরম্যান্স নষ্ট করে।
- **NO Client-side Heavy Graph/Analytics:** অপ্রয়োজনীয় গ্রাফ বা চার্ট যা কমদামী মোবাইলের লোডিং গতি কমায়।

---

## 3. Environment Variables Specification
`.env` ফাইলে অবশ্যই নিচের ভেরিয়েবলগুলো থাকতে হবে:

```env
# PostgreSQL connection string (Neon or Supabase free tier)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Auth.js secret (generate using: openssl rand -base64 32)
AUTH_SECRET="your-generated-auth-secret"

# Canonical App URL
AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

*Prisma 7 Quirk:* লোকাল শেল থেকে মাইগ্রেশন চালানোর সময় যদি `DATABASE_URL` পেতে সমস্যা হয়, তবে শেলের এনভায়রনমেন্টে ভেরিয়েবলটি লোড থাকতে হবে।

---

## 4. Verification Gate Commands
যেকোনো স্টেপ শেষ করার পর এই কমান্ডগুলো দ্বারা নিশ্চিত হতে হবে:

- **Typecheck:**
  ```powershell
  npm run typecheck   # executes: tsc --noEmit
  ```
- **Production Build:**
  ```powershell
  npm run build       # executes: next build
  ```
- **Prisma Migration (Local):**
  ```powershell
  npx prisma migrate dev
  ```
- **Database Seed (Local Demo Data):**
  ```powershell
  npm run db:seed
  ```
- **Prisma Studio:**
  ```powershell
  npm run db:studio
  ```
