import { ApplyForm } from "@/components/apply-form";
import { Badge, Card, JobStatusBadge } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth-helpers";
import { getCachedJobById } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import {
  GENDER_LABELS,
  MEDIUM_LABELS,
  SITE_NAME_BN,
  SITE_URL,
  districtName,
} from "@/lib/site";
import { formatDate, formatSalary, isJobExpired, timeAgo } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getCachedJobById(id);
  if (!job) {
    return { title: "টিউশন পাওয়া যায়নি" };
  }
  const districtBn = districtName(job.district);
  const title = `${job.title} — ${districtBn}`;
  const description = `${job.className} এর জন্য ${job.subjects.join(", ")} বিষয় পড়ানোর গৃহশিক্ষক আবশ্যক। এলাকা: ${job.area ? `${job.area}, ` : ""}${districtBn}। বেতন: ${job.salary ? `${job.salary} টাকা` : "আলোচনা সাপেক্ষে"}।`;

  return {
    title,
    description,
    alternates: { canonical: `/jobs/${id}` },
    openGraph: {
      title,
      description,
      url: `/jobs/${id}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [job, user] = await Promise.all([
    getCachedJobById(id),
    getCurrentUser(),
  ]);
  if (!job) notFound();
  const isAdmin = user?.role === "ADMIN";
  const expired = job.status === "OPEN" && isJobExpired(job.publishedAt);
  const canApply = job.status === "OPEN" && !expired;

  let alreadyApplied = false;
  if (user?.tutorProfile) {
    const existing = await prisma.application.findUnique({
      where: {
        jobId_tutorId: { jobId: job.id, tutorId: user.tutorProfile.id },
      },
    });
    alreadyApplied = !!existing;
  }

  const location = job.area
    ? `${job.area}, ${districtName(job.district)}`
    : districtName(job.district);
  const posted = job.publishedAt ?? job.createdAt;

  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `${job.className} এর জন্য ${job.subjects.join(", ")} বিষয় পড়ানোর গৃহশিক্ষক প্রয়োজন।`,
    datePosted: posted.toISOString(),
    validThrough: new Date(posted.getTime() + 30 * 86400000).toISOString(),
    employmentType: "PART_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: SITE_NAME_BN,
      sameAs: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.area || districtName(job.district),
        addressRegion: districtName(job.district),
        addressCountry: "BD",
      },
    },
    ...(job.salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "BDT",
            value: {
              "@type": "QuantitativeValue",
              value: job.salary,
              unitText: "MONTH",
            },
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />
      <Link
        href="/jobs"
        className="text-sm font-bold text-emerald-700 hover:underline"
      >
        ← সব টিউশন
      </Link>

      <Card className="mt-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-stone-900">{job.title}</h1>
          <JobStatusBadge status={job.status} />
        </div>
        <p className="mt-2 text-stone-500">{location}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.subjects.map((subject) => (
            <Badge key={subject} tone="neutral">
              {subject}
            </Badge>
          ))}
          <Badge tone="blue">{MEDIUM_LABELS[job.medium]}</Badge>
          <Badge tone="neutral">
            {GENDER_LABELS[job.tutorGenderPreference]} টিউটর
          </Badge>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-stone-100 pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase text-stone-400">শ্রেণি</dt>
            <dd className="mt-1 font-semibold text-stone-800">{job.className}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-stone-400">মাসিক বেতন</dt>
            <dd className="mt-1 font-semibold text-emerald-700">
              {job.salaryNegotiable || job.salary == null
                ? "আলোচনা সাপেক্ষে"
                : `${formatSalary(job.salary)}/মাস`}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-stone-400">সপ্তাহে</dt>
            <dd className="mt-1 font-semibold text-stone-800">
              {job.daysPerWeek.toLocaleString("bn-BD")} দিন
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-stone-400">পোস্ট</dt>
            <dd className="mt-1 font-semibold text-stone-800">
              {formatDate(posted)} ({timeAgo(posted)})
            </dd>
          </div>
        </dl>

        {job.notes ? (
          <div className="mt-5 border-t border-stone-100 pt-5">
            <p className="text-xs font-bold uppercase text-stone-400">
              অতিরিক্ত তথ্য
            </p>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed text-stone-700">
              {job.notes}
            </p>
          </div>
        ) : null}
      </Card>

      <Card className="mt-4 p-6">
        <h2 className="text-lg font-bold text-stone-900">আবেদন করুন</h2>
        {!canApply ? (
          <p className="mt-2 text-stone-500">
            {job.status === "FILLED"
              ? "এই টিউশনে ইতিমধ্যে টিউটর নিয়োগ হয়ে গেছে।"
              : expired
                ? "এই টিউশনের মেয়াদ শেষ হয়ে গেছে।"
                : "এই টিউশনে এখন আবেদন করা যাচ্ছে না।"}
          </p>
        ) : isAdmin ? (
          <p className="mt-2 text-stone-500">
            আপনি অ্যাডমিন হিসেবে লগ ইন করেছেন। এই পোস্টটি অ্যাডমিন প্যানেল
            থেকে পরিচালনা করুন।{" "}
            <Link
              href={`/admin/jobs/${job.id}`}
              className="font-bold text-emerald-700 hover:underline"
            >
              অ্যাডমিন প্যানেলে দেখুন →
            </Link>
          </p>
        ) : !user ? (
          <div className="mt-2">
            <p className="text-stone-500">
              আবেদন করতে টিউটর অ্যাকাউন্টে লগ ইন করুন — রেজিস্টার করা সম্পূর্ণ
              ফ্রি।
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
              >
                লগ ইন
              </Link>
              <Link
                href="/register"
                className="rounded-lg border border-emerald-600 px-5 py-2.5 font-bold text-emerald-700 hover:bg-emerald-50"
              >
                টিউটর রেজিস্টার
              </Link>
            </div>
          </div>
        ) : !user.tutorProfile ? (
          <p className="mt-2 text-stone-500">
            আবেদন করার আগে আপনার টিউটর প্রোফাইল সম্পন্ন করুন।{" "}
            <Link
              href="/dashboard/profile"
              className="font-bold text-emerald-700 hover:underline"
            >
              প্রোফাইল সম্পন্ন করুন →
            </Link>
          </p>
        ) : alreadyApplied ? (
          <p className="mt-2 text-stone-500">
            আপনি এই টিউশনে ইতিমধ্যে আবেদন করেছেন। আবেদনের অবস্থা ড্যাশবোর্ডে
            দেখতে পারবেন।{" "}
            <Link
              href="/dashboard"
              className="font-bold text-emerald-700 hover:underline"
            >
              ড্যাশবোর্ড →
            </Link>
          </p>
        ) : (
          <div className="mt-4">
            <ApplyForm jobId={job.id} />
          </div>
        )}
        <p className="mt-4 text-xs text-stone-400">
          আবেদন করলে আমরা আপনার প্রোফাইল অভিভাবকের কাছে পাঠাবো। শর্টলিস্ট
          হলে ডেমো ক্লাসের ব্যবস্থা হবে — সম্পূর্ণ ফ্রি, কোনো কমিশন নেই।
        </p>
      </Card>
    </div>
  );
}
