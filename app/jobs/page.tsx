import { JobCard } from "@/components/job-card";
import { JobFilters } from "@/components/job-filters";
import { EmptyState, SectionTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import {
  DISTRICT_KEYS,
  GENDERS,
  MEDIUMS,
} from "@/lib/site";
import { expiryCutoff } from "@/lib/utils";
import type { Gender, Medium, Prisma } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface SearchParams {
  district?: string;
  className?: string;
  subject?: string;
  medium?: string;
  gender?: string;
  salaryMin?: string;
  salaryMax?: string;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Prisma.JobWhereInput = {
    status: "OPEN",
    publishedAt: { gte: expiryCutoff() },
  };
  if (params.district && DISTRICT_KEYS.includes(params.district)) {
    where.district = params.district;
  }
  if (params.className) where.className = params.className;
  if (params.subject) where.subjects = { has: params.subject };
  if (params.medium && (MEDIUMS as string[]).includes(params.medium)) {
    where.medium = params.medium as Medium;
  }
  if (params.gender && (GENDERS as string[]).includes(params.gender)) {
    // A job open to "any" gender accepts every tutor.
    where.tutorGenderPreference = {
      in: [params.gender as Gender, "ANY"],
    };
  }
  const salaryMin = params.salaryMin ? Number(params.salaryMin) : NaN;
  const salaryMax = params.salaryMax ? Number(params.salaryMax) : NaN;
  if (Number.isFinite(salaryMin) || Number.isFinite(salaryMax)) {
    // Negotiable-salary jobs stay visible in range results — the salary
    // may well fall inside the range.
    where.OR = [
      {
        salary: {
          ...(Number.isFinite(salaryMin) ? { gte: salaryMin } : {}),
          ...(Number.isFinite(salaryMax) ? { lte: salaryMax } : {}),
        },
      },
      { salary: null },
    ];
  }

  const jobs = await prisma.job.findMany({
    where,
    orderBy: { publishedAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SectionTitle
        title="টিউশন খুঁজুন"
        subtitle="চলতি টিউশনগুলো — ৩০ দিনের পুরনো পোস্ট স্বয়ংক্রিয়ভাবে সরিয়ে ফেলা হয়।"
      />
      <JobFilters values={params} />
      <p className="mt-6 text-sm text-stone-500">
        {jobs.length.toLocaleString("bn-BD")}টি টিউশন পাওয়া গেছে
      </p>
      {jobs.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="এই ফিল্টারে কোনো টিউশন পাওয়া যায়নি"
            body="ফিল্টার বদলে আবার চেষ্টা করুন, অথবা সব টিউশন দেখুন।"
            action={
              <Link
                href="/jobs"
                className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
              >
                সব টিউশন দেখুন
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
