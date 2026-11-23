import { JobCard } from "@/components/job-card";
import { Badge, EmptyState, SectionTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import {
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
    title: "১. পোস্ট বা আবেদন",
    body: "অভিভাবক টিউশনের চাহিদা পোস্ট করেন (অ্যাকাউন্ট লাগে না)। টিউটর জব বোর্ড থেকে পছন্দের টিউশনে আবেদন করেন।",
  },
  {
    title: "২. শর্টলিস্ট",
    body: "আমরা আবেদনগুলো দেখে উপযুক্ত টিউটর শর্টলিস্ট করি এবং অভিভাবকের সাথে কথা বলি।",
  },
  {
    title: "৩. ডেমো ক্লাস",
    body: "শর্টলিস্ট হওয়া টিউটর একটি ফ্রি ডেমো ক্লাস নেন। অভিভাবক পছন্দ করলে কনফার্ম করেন।",
  },
  {
    title: "৪. কনফার্ম ও যোগাযোগ",
    body: "কনফার্ম হলে আমরা টিউটর আর অভিভাবককে সরাসরি যোগাযোগ করিয়ে দিই। এরপর বেতন অভিভাবক সরাসরি টিউটরকে দেন।",
  },
];

export default async function HomePage() {
  // Latest open jobs, with the launch-focus district (Sirajganj) first.
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
    <div>
      {/* Hero */}
      <section className="border-b border-emerald-100 bg-emerald-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            সারা বাংলাদেশে টিউশন খুঁজুন — সম্পূর্ণ ফ্রি
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-emerald-100 sm:text-lg">
            টিউটর আর অভিভাবককে আমরা যোগাযোগ করিয়ে দিই। কোনো কমিশন নেই,
            কোনো ভেরিফিকেশন ফি নেই, কোনো ডিপোজিট নেই — কখনোই না। সিরাজগঞ্জ
            থেকে শুরু — এখন সারা দেশের জন্য।
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="rounded-lg bg-white px-5 py-3 font-bold text-emerald-800 hover:bg-emerald-50"
            >
              টিউশন খুঁজুন
            </Link>
            <Link
              href="/post-tuition"
              className="rounded-lg border-2 border-white px-5 py-3 font-bold text-white hover:bg-emerald-600"
            >
              টিউশন পোস্ট করুন
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-emerald-900 px-5 py-3 font-bold text-white hover:bg-emerald-950"
            >
              টিউটর হিসেবে যোগ দিন
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="green" className="bg-emerald-600 text-white">
              ০% কমিশন
            </Badge>
            <Badge tone="green" className="bg-emerald-600 text-white">
              ফ্রি ডেমো ক্লাস
            </Badge>
            <Badge tone="green" className="bg-emerald-600 text-white">
              যাচাইকৃত পোস্ট
            </Badge>
            <Badge tone="green" className="bg-emerald-600 text-white">
              ৬৪ জেলা
            </Badge>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionTitle
          title="কীভাবে কাজ করে"
          subtitle="চারটি সহজ ধাপ — টিউটর আর অভিভাবক, দুজনের জন্যই সম্পূর্ণ ফ্রি।"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.title}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <h3 className="font-bold text-stone-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                {step.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4">
          <Link
            href="/how-it-works"
            className="text-sm font-bold text-emerald-700 hover:underline"
          >
            বিস্তারিত প্রক্রিয়া দেখুন →
          </Link>
        </p>
      </section>

      {/* Latest jobs */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <SectionTitle
          title="সাম্প্রতিক টিউশন"
          subtitle={`সিরাজগঞ্জের টিউশন আগে দেখানো হয় — ${JOB_EXPIRY_DAYS} দিনের পুরনো পোস্ট স্বয়ংক্রিয়ভাবে সরিয়ে ফেলা হয়।`}
        />
        {featuredFirst.length === 0 ? (
          <EmptyState
            title="এখনো কোনো টিউশন পোস্ট হয়নি"
            body="নতুন টিউশন পোস্ট হলে এখানে দেখা যাবে। অভিভাবক হলে এখনই আপনার চাহিদা পোস্ট করতে পারেন।"
            action={
              <Link
                href="/post-tuition"
                className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
              >
                টিউশন পোস্ট করুন
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredFirst.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <p className="mt-5 text-center">
              <Link
                href="/jobs"
                className="inline-block rounded-lg border border-emerald-600 px-5 py-2.5 font-bold text-emerald-700 hover:bg-emerald-50"
              >
                সব টিউশন দেখুন
              </Link>
            </p>
          </>
        )}
      </section>

      {/* Districts */}
      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <SectionTitle
            title="জেলা অনুযায়ী খুঁজুন"
            subtitle="সারা বাংলাদেশের ৬৪ জেলায় টিউশন — সিরাজগঞ্জ থেকে শুরু।"
          />
          <Link
            href={`/jobs?district=${FEATURED_DISTRICT}`}
            className="mb-4 block rounded-xl border-2 border-emerald-600 bg-emerald-50 p-4 hover:bg-emerald-100"
          >
            <span className="font-bold text-emerald-800">
              {districtName(FEATURED_DISTRICT)} — আমাদের শুরু এখান থেকে
            </span>
            <span className="mt-1 block text-sm text-emerald-700">
              সিরাজগঞ্জের সব টিউশন দেখুন →
            </span>
          </Link>
          <div className="flex flex-wrap gap-2">
            {DISTRICTS.filter((d) => d.key !== FEATURED_DISTRICT).map((d) => (
              <Link
                key={d.key}
                href={`/jobs?district=${d.key}`}
                className="rounded-full border border-stone-300 bg-stone-50 px-4 py-2 text-sm font-semibold text-stone-700 hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {d.bn}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Free promise */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-stone-900">
            {SITE_NAME_BN} কেন ফ্রি?
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-stone-600">
            অন্য টিউশন মিডিয়াগুলো টিউটরের প্রথম মাসের বেতনের ৫০–৬০% কেটে
            রাখে। আমরা বিশ্বাস করি, টিউটর তার পুরো পরিশ্রমের টাকা পাওয়ার
            অধিকার রাখে। তাই এই সাইটে কোনো কমিশন নেই, কোনো ভেরিফিকেশন ফি
            নেই, কোনো ডিপোজিট নেই — টিউটর আর অভিভাবক, দুজনের জন্যই সবকিছু
            সম্পূর্ণ ফ্রি, সবসময়।
          </p>
          <p className="mt-4">
            <Link
              href="/about"
              className="text-sm font-bold text-emerald-700 hover:underline"
            >
              আমাদের সম্পর্কে আরও জানুন →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
