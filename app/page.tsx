import { JobCard } from "@/components/job-card";
import { Badge, EmptyState, SectionTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import {
  CLASSES,
  DISTRICTS,
  FEATURED_DISTRICT,
  JOB_EXPIRY_DAYS,
  SITE_NAME_BN,
  districtName,
} from "@/lib/site";
import { expiryCutoff } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    step: "০১",
    title: "পোস্ট বা আবেদন",
    body: "অভিভাবক কোনো অ্যাকাউন্ট ছাড়াই টিউশনের চাহিদা জানান। টিউটররা জব বোর্ড থেকে উপযুক্ত টিউশনে আবেদন করেন।",
    icon: (
      <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    step: "০২",
    title: "যাচাই ও শর্টলিস্ট",
    body: "আমরা অভিভাবকের সাথে ফোনে কথা বলে চাহিদা যাচাই করি এবং যোগ্য ও দায়িত্বশীল টিউটর শর্টলিস্ট করি।",
    icon: (
      <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    step: "০৩",
    title: "ফ্রি ডেমো ক্লাস",
    body: "শর্টলিস্ট হওয়া টিউটর একটি ফ্রি ডেমো ক্লাস নেন। উভয় পক্ষ সন্তুষ্ট হলে টিউশনটি নিশ্চিত করা হয়।",
    icon: (
      <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
      </svg>
    ),
  },
  {
    step: "০৪",
    title: "নিশ্চিত ও সরাসরি যোগাযোগ",
    body: "কনফার্ম হলে আমরা সরাসরি যোগাযোগ করিয়ে দিই। পারিশ্রমিক অভিভাবক সরাসরি টিউটরকেই প্রদান করেন।",
    icon: (
      <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
];

export default async function HomePage() {
  const recentJobs = await prisma.job.findMany({
    where: { status: "OPEN", publishedAt: { gte: expiryCutoff() } },
    orderBy: { publishedAt: "desc" },
    take: 12,
  });

  const featuredFirst = [
    ...recentJobs.filter((j) => j.district === FEATURED_DISTRICT),
    ...recentJobs.filter((j) => j.district !== FEATURED_DISTRICT),
  ].slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white">
        {/* Subtle Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-emerald-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          {/* Trust Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-200 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>সারা বাংলাদেশে ১০০% ফ্রি টিউশন প্ল্যাটফর্ম · ০% কমিশন</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl sm:leading-tight">
            যোগ্য টিউটর ও সেরা টিউশন —{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400 bg-clip-text text-transparent">
              সম্পূর্ণ বিনামূল্যে
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-emerald-100/90 sm:text-lg">
            টিউটর ও অভিভাবককে আমরা সরাসরি যোগাযোগ করিয়ে দিই। কোনো কমিশন নেই,
            কোনো রেজিস্ট্রেশন ফি নেই, কোনো ডিপোজিট নেই। আপনার মেধা ও পরিশ্রমের পুরো টাকাই আপনার।
          </p>

          {/* Interactive Hero Quick Search Box */}
          <div className="mt-8 max-w-3xl rounded-2xl border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-md">
            <form action="/jobs" method="GET" className="grid gap-2 sm:grid-cols-7">
              <div className="sm:col-span-3">
                <select
                  name="district"
                  defaultValue=""
                  className="w-full rounded-xl border border-white/20 bg-white/90 px-3.5 py-3 text-sm font-medium text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">সকল জেলা (সারাদেশ)</option>
                  <option value={FEATURED_DISTRICT}>সিরাজগঞ্জ (লঞ্চ ফোকাস)</option>
                  {DISTRICTS.filter((d) => d.key !== FEATURED_DISTRICT).map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.bn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  name="className"
                  defaultValue=""
                  className="w-full rounded-xl border border-white/20 bg-white/90 px-3.5 py-3 text-sm font-medium text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="">সকল শ্রেণি</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 active:scale-98"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <span>টিউশন খুঁজুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* Action Links & Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/post-tuition"
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-emerald-900 shadow-md transition hover:bg-emerald-50 active:scale-98"
            >
              <span>টিউশন পোস্ট করুন (ফ্রি)</span>
              <span>→</span>
            </Link>
            <Link
              href="/register"
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-800/40 px-6 py-3 font-bold text-white backdrop-blur-xs transition hover:bg-emerald-700/60 active:scale-98"
            >
              <span>টিউটর হিসেবে যোগ দিন</span>
            </Link>
          </div>

          {/* Quick Metrics / Guarantees */}
          <div className="mt-10 grid grid-cols-2 gap-3 border-t border-white/10 pt-8 sm:grid-cols-4">
            <div className="flex items-center gap-2 text-sm text-emerald-100">
              <span className="text-emerald-400">✓</span>
              <span>০% কমিশন গ্যারান্টি</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-100">
              <span className="text-emerald-400">✓</span>
              <span>ফ্রি ডেমো ক্লাস</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-100">
              <span className="text-emerald-400">✓</span>
              <span>১০০% নিরাপদ গোপন নম্বর</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-emerald-100">
              <span className="text-emerald-400">✓</span>
              <span>৬৪ জেলায় সেবা</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Interactive Bento Cards */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <Badge tone="green">সহজ ও নিরাপদ প্রক্রিয়া</Badge>
          <h2 className="mt-3 text-2xl font-extrabold text-stone-900 sm:text-3xl">
            কীভাবে কাজ করে {SITE_NAME_BN}?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-500 sm:text-base">
            চারটি স্বচ্ছ ধাপ — অভিভাবক এবং টিউটর, দুজনের জন্যই কোনো চার্জ ছাড়া শতভাগ ফ্রি।
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="group relative rounded-2xl border border-stone-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                  {s.icon}
                </div>
                <span className="text-2xl font-black text-stone-200 transition group-hover:text-emerald-300">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-stone-900 group-hover:text-emerald-700">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/how-it-works"
            className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 transition hover:gap-2.5 hover:text-emerald-800"
          >
            <span>সম্পূর্ণ মধ্যস্থতা প্রক্রিয়া বিস্তারিত দেখুন</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Differentiator Comparison Section (Why 100% Free) */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-b from-stone-50 to-white shadow-sm">
          <div className="border-b border-stone-200 bg-emerald-50/60 px-6 py-6 sm:px-10">
            <Badge tone="green">স্বচ্ছতার প্রতিশ্রুতি</Badge>
            <h2 className="mt-2 text-2xl font-bold text-stone-900 sm:text-3xl">
              অন্যান্য টিউশন মিডিয়া বনাম {SITE_NAME_BN}
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              আমরা কেন অন্যান্য প্ল্যাটফর্মের চেয়ে সম্পূর্ণ আলাদা?
            </p>
          </div>

          <div className="grid divide-y divide-stone-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {/* Competitor / Old Way */}
            <div className="p-6 sm:p-10 bg-stone-50/50">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
                  ✕
                </span>
                <h3 className="text-lg font-bold text-stone-800">অন্যান্য প্রচলিত মিডিয়া</h3>
              </div>
              <ul className="mt-6 space-y-4 text-sm text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>প্রথম মাসের বেতনের ৫০% থেকে ৬০% পর্যন্ত মোটা অঙ্কের কমিশন কেটে নেয়।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>রেজিস্ট্রেশন বা তথাকথিত "ভেরিফিকেশন ফি"-এর নামে ৫০০ থেকে ১,০০০ টাকা দিতে হয়।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>টিউশন কোনো কারণে বন্ধ হয়ে গেলে কমিশন ফেরতে দীর্ঘ হয়রানির শিকার হতে হয়।</span>
                </li>
              </ul>
            </div>

            {/* TutorCarePoint Way */}
            <div className="p-6 sm:p-10 bg-emerald-50/30">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  ✓
                </span>
                <h3 className="text-lg font-bold text-emerald-900">{SITE_NAME_BN} (আমরা)</h3>
              </div>
              <ul className="mt-6 space-y-4 text-sm text-stone-700 font-medium">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong className="text-emerald-900">০% কমিশন:</strong> আপনার উপার্জনের ১০০% টাকাই সরাসরি আপনার।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong className="text-emerald-900">সম্পূর্ণ ফ্রি:</strong> কোনো রেজিস্ট্রেশন ফি, ভেরিফিকেশন চার্জ বা হিডেন ফি নেই।</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 font-bold text-base">✓</span>
                  <span><strong className="text-emerald-900">নিরাপদ ডেমো ক্লাস:</strong> অভিভাবক ফোনে যাচাইকৃত এবং ডেমো ক্লাসে সন্তুষ্ট হলেই সংযোগ।</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Open Jobs Section */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-stone-900 sm:text-3xl">সাম্প্রতিক টিউশন</h2>
              {recentJobs.length > 0 ? (
                <Badge tone="green">{recentJobs.length.toLocaleString("bn-BD")}টি টিউশন খোলা</Badge>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-stone-500">
              সিরাজগঞ্জ ও সারা বাংলাদেশের সাম্প্রতিক টিউশনসমূহ — {JOB_EXPIRY_DAYS} দিনের পুরনো পোস্ট স্বয়ংক্রিয়ভাবে সরিয়ে ফেলা হয়।
            </p>
          </div>
          <Link
            href="/jobs"
            className="cursor-pointer text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            সব টিউশন দেখুন ({recentJobs.length.toLocaleString("bn-BD")}) →
          </Link>
        </div>

        {featuredFirst.length === 0 ? (
          <EmptyState
            title="এখনো কোনো টিউশন পোস্ট হয়নি"
            body="নতুন টিউশন পোস্ট হলে এখানে দেখা যাবে। অভিভাবক হলে এখনই কোনো অ্যাকাউন্ট ছাড়াই আপনার চাহিদা পোস্ট করতে পারেন।"
            action={
              <Link
                href="/post-tuition"
                className="cursor-pointer inline-block rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-700"
              >
                টিউশন পোস্ট করুন (ফ্রি)
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredFirst.map((job) => (
              <div key={job.id} className="transition-transform duration-200 hover:-translate-y-1">
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}

        {featuredFirst.length > 0 ? (
          <div className="mt-8 text-center">
            <Link
              href="/jobs"
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl border-2 border-emerald-600 bg-white px-6 py-3 font-bold text-emerald-700 shadow-xs transition hover:bg-emerald-50 active:scale-98"
            >
              <span>সকল টিউশন ফিল্টার করে দেখুন</span>
              <span>→</span>
            </Link>
          </div>
        ) : null}
      </section>

      {/* District Explorer */}
      <section className="border-y border-stone-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle
            title="জেলা অনুযায়ী টিউশন খুঁজুন"
            subtitle="সারা বাংলাদেশের ৬৪ জেলায় নির্ভরযোগ্য টিউশন — সিরাজগঞ্জ থেকে শুরু।"
          />

          {/* Featured District Highlight */}
          <Link
            href={`/jobs?district=${FEATURED_DISTRICT}`}
            className="group mb-6 block rounded-2xl border-2 border-emerald-500 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-5 shadow-xs transition hover:border-emerald-600 hover:shadow-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                  📍 আমাদের শুরু এখান থেকে
                </span>
                <h3 className="mt-2 text-xl font-bold text-stone-900 group-hover:text-emerald-800">
                  {districtName(FEATURED_DISTRICT)} জেলার সব টিউশন
                </h3>
                <p className="mt-0.5 text-xs text-stone-500">
                  সিরাজগঞ্জ সদর, উল্লাপাড়া, বেলকুচি, শাহজাদপুর, কাজিপুরসহ সব উপজেলার টিউশন ও টিউটর।
                </p>
              </div>
              <span className="font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                টিউশন দেখুন →
              </span>
            </div>
          </Link>

          {/* All Other Districts Grid */}
          <div className="flex flex-wrap gap-2">
            {DISTRICTS.filter((d) => d.key !== FEATURED_DISTRICT).map((d) => (
              <Link
                key={d.key}
                href={`/jobs?district=${d.key}`}
                className="cursor-pointer rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 text-sm font-semibold text-stone-700 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {d.bn}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dual CTA Section */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Guardian CTA */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white p-8 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">অভিভাবকদের জন্য</span>
            <h3 className="mt-2 text-2xl font-bold text-stone-900">গৃহশিক্ষক খুঁজছেন?</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              কোনো অ্যাকাউন্ট খোলার ঝামেলা ছাড়াই মাত্র ১ মিনিটে আপনার সন্তানের জন্য টিউশনের চাহিদা পোস্ট করুন। আমরা ফোনে যাচাই করে সেরা টিউটর খুঁজে দেব।
            </p>
            <div className="mt-6">
              <Link
                href="/post-tuition"
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700"
              >
                <span>টিউশন পোস্ট করুন</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Tutor CTA */}
          <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-br from-stone-50 via-white to-stone-100/50 p-8 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">টিউটরদের জন্য</span>
            <h3 className="mt-2 text-2xl font-bold text-stone-900">টিউশন খুঁজছেন?</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              এখনই গুগল বা ইমেইল দিয়ে রেজিস্টার করুন। আপনার এলাকার সেরা টিউশনগুলোতে আবেদন করুন এবং প্রথম মাসের বেতনের পুরো টাকাই নিজের কাছে রাখুন।
            </p>
            <div className="mt-6">
              <Link
                href="/register"
                className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-2.5 font-bold text-white shadow-md transition hover:bg-stone-800"
              >
                <span>রেজিস্টার করুন (ফ্রি)</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
