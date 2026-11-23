import { TutorCard } from "@/components/tutor-card";
import { TutorFilters } from "@/components/tutor-filters";
import { EmptyState, SectionTitle } from "@/components/ui";
import { getCachedDefaultTutors } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { DISTRICT_KEYS } from "@/lib/site";
import type { Prisma } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "দক্ষ ও অভিজ্ঞ টিউটর খুঁজুন",
  description:
    "আপনার সন্তানের জন্য সিরাজগঞ্জ ও সারা বাংলাদেশের বিভিন্ন স্বনামধন্য বিশ্ববিদ্যালয় ও কলেজের সেরা টিউটরদের প্রোফাইল দেখুন ও সরাসরি যুক্ত হন।",
  alternates: { canonical: "/tutors" },
};

interface SearchParams {
  district?: string;
  upazila?: string;
  className?: string;
  subject?: string;
  verified?: string;
}

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Only profiles with subjects filled in appear in the directory.
  const where: Prisma.TutorProfileWhereInput = {
    isPublished: true,
    subjects: { isEmpty: false },
  };
  if (params.district && DISTRICT_KEYS.includes(params.district)) {
    where.district = params.district;
  }
  if (params.upazila) where.upazila = params.upazila;
  if (params.className) where.classes = { has: params.className };
  if (params.subject) where.subjects = { has: params.subject };
  if (params.verified === "1") where.isVerified = true;

  const hasFilters = Boolean(
    params.district ||
    params.upazila ||
    params.className ||
    params.subject ||
    params.verified
  );

  const tutors = hasFilters
    ? await prisma.tutorProfile.findMany({
        where,
        orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
        take: 100,
      })
    : await getCachedDefaultTutors();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <SectionTitle
        title="টিউটর খুঁজুন"
        subtitle="টিউটরদের প্রোফাইল দেখুন। যোগাযোগের নম্বর প্রকাশ্যে দেওয়া হয় না — কনফার্ম হওয়ার পর আমরা যোগাযোগ করিয়ে দিই।"
      />
      <TutorFilters values={params} />
      <p className="mt-6 text-sm text-stone-500">
        {tutors.length.toLocaleString("bn-BD")} জন টিউটর পাওয়া গেছে
      </p>
      {tutors.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="এই ফিল্টারে কোনো টিউটর পাওয়া যায়নি"
            body="ফিল্টার বদলে আবার চেষ্টা করুন, অথবা টিউশন পোস্ট করুন — আমরা উপযুক্ত টিউটর খুঁজে দেবো।"
            action={
              <Link
                href="/post-tuition"
                className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
              >
                টিউশন পোস্ট করুন
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor) => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}
    </div>
  );
}
