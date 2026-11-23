# 03. Design Tokens & System Constants

## 1. Brand & Site Constants (Single Source of Truth)
> **গুরুত্বপূর্ণ:** সাইটের নাম বা কনস্ট্যান্ট কোনো পেজে হার্ডকোড করা নিষিদ্ধ। সবকিছু `lib/site.ts` থেকে ইমপোর্ট করতে হবে।

- **Site Name (EN):** `"TutorCarePoint"` (`SITE_NAME`)
- **Site Name (BN):** `"টিউটর কেয়ার পয়েন্ট"` (`SITE_NAME_BN`)
- **Tagline:** `"সারা বাংলাদেশের টিউটর ও অভিভাবকদের জন্য সম্পূর্ণ ফ্রি টিউশন মিডিয়া"` (`SITE_TAGLINE`)
- **Site URL:** `process.env.NEXT_PUBLIC_APP_URL ?? "https://tutorcarepoint.vercel.app"`
- **Featured District:** `"sirajganj"` (`FEATURED_DISTRICT`)
- **Job Expiry Duration:** `30` days (`JOB_EXPIRY_DAYS`)

---

## 2. Typography & Fonts
- **Primary Bengali Font:** `Noto Sans Bengali` (Google Fonts via `next/font/google`)
- **Font Variable:** `--font-bengali`
- **Fallback Stack:** `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Target Audience UX:** স্বল্পমূল্যের অ্যান্ড্রয়েড ফোন ও স্লো নেটওয়ার্কেও যেন দ্রুত লোড হয় এমন লাইটওয়েট ও ক্লিন টাইপোগ্রাফি।

---

## 3. Color Palette (Tailwind CSS v4)
- **Primary Brand Color (Emerald):**
  - Primary Base: `emerald-600` (`#059669`)
  - Primary Hover/Active: `emerald-700` (`#047857`)
  - Primary Light/Background: `emerald-50` (`#ecfdf5`)
  - Selection Highlight: `rgba(5, 150, 105, 0.25)`
- **Neutrals (Stone):**
  - Background: `stone-50` (`#fafaf9`)
  - Surface/Card: `white` (`#ffffff`)
  - Border: `stone-200` (`#e7e5e4`)
  - Subdued Text: `stone-500` / `stone-600`
  - Body Text: `stone-900` (`#1c1917`)
- **Status Colors:**
  - `PENDING_REVIEW` / `APPLIED`: `amber-600` (হলুদ/অ্যাম্বার)
  - `OPEN` / `CONFIRMED`: `emerald-600` (সবুজ)
  - `SHORTLISTED` / `DEMO`: `blue-600` (নীল)
  - `FILLED` / `COMPLETED`: `stone-600` (ধূসর)
  - `CANCELLED` / `EXPIRED`: `rose-600` (লাল)

---

## 4. Domain Constants & Enums (from `lib/site.ts`)
- **Districts:** ৬৪টি জেলা (Slug key + বাংলা নাম, বিভাগভিত্তিক সাজানো)।
- **Classes:** ১৪টি শ্রেণি (`১ম শ্রেণি` থেকে `এইচএসসি ২য় বর্ষ` + `ভর্তি পরীক্ষা`)।
- **Subjects:** ১৪টি বিষয় (`বাংলা`, `ইংরেজি`, `গণিত` ... `সব বিষয়`)।
- **Mediums:**
  - `BANGLA`: বাংলা মাধ্যম
  - `ENGLISH_MEDIUM`: ইংলিশ মিডিয়াম
  - `ENGLISH_VERSION`: ইংলিশ ভার্সন
  - `MADRASA`: মাদ্রাসা
- **Genders:**
  - `MALE`: পুরুষ
  - `FEMALE`: মহিলা
  - `ANY`: যেকোনো
