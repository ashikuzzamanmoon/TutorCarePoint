import { Badge, Card } from "@/components/ui";
import { getCachedTutorById } from "@/lib/data";
import {
  GENDER_LABELS,
  MEDIUM_LABELS,
  districtName,
} from "@/lib/site";
import { formatSalary, initials } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// Public tutor profile — never shows the phone number.
export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = await getCachedTutorById(id);
  if (!tutor || !tutor.isPublished) notFound();

  const location = tutor.area
    ? `${tutor.area}, ${districtName(tutor.district)}`
    : districtName(tutor.district);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/tutors"
        className="text-sm font-bold text-emerald-700 hover:underline"
      >
        ← সব টিউটর
      </Link>

      <Card className="mt-4 p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-800">
            {initials(tutor.displayName)}
          </span>
          <div>
            <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-stone-900">
              {tutor.displayName}
              {tutor.isVerified ? (
                <Badge tone="green">যাচাইকৃত টিউটর</Badge>
              ) : null}
            </h1>
            <p className="mt-1 text-stone-500">
              {tutor.educationLevel}
              {tutor.institution ? `, ${tutor.institution}` : ""}
            </p>
            <p className="text-stone-500">{location}</p>
          </div>
        </div>

        {tutor.bio ? (
          <p className="mt-5 whitespace-pre-wrap leading-relaxed text-stone-700">
            {tutor.bio}
          </p>
        ) : null}

        <div className="mt-6 grid gap-5 border-t border-stone-100 pt-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase text-stone-400">বিষয়</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tutor.subjects.map((s) => (
                <Badge key={s} tone="neutral">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-stone-400">শ্রেণি</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tutor.classes.map((c) => (
                <Badge key={c} tone="neutral">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-stone-400">মাধ্যম</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tutor.mediums.map((m) => (
                <Badge key={m} tone="blue">
                  {MEDIUM_LABELS[m]}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-stone-400">লিঙ্গ</p>
            <p className="mt-2 font-semibold text-stone-800">
              {GENDER_LABELS[tutor.gender]}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-stone-400">
              প্রত্যাশিত বেতন
            </p>
            <p className="mt-2 font-semibold text-emerald-700">
              {tutor.expectedSalary != null
                ? `${formatSalary(tutor.expectedSalary)}/মাস`
                : "আলোচনা সাপেক্ষে"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-stone-400">অভিজ্ঞতা</p>
            <p className="mt-2 font-semibold text-stone-800">
              {tutor.experienceYears.toLocaleString("bn-BD")} বছর
              {tutor.daysPerWeek
                ? ` · সপ্তাহে ${tutor.daysPerWeek.toLocaleString("bn-BD")} দিন`
                : ""}
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-6">
        <h2 className="text-lg font-bold text-stone-900">
          এই টিউটরকে দিয়ে পড়াতে চান?
        </h2>
        <p className="mt-2 text-stone-500">
          টিউটরের ফোন নম্বর প্রকাশ্যে দেওয়া হয় না। আপনার টিউশনের চাহিদা
          পোস্ট করুন — অতিরিক্ত তথ্যে এই টিউটরের নাম লিখে দিন। আমরা যাচাই
          করে যোগাযোগ করিয়ে দেবো, সম্পূর্ণ ফ্রি।
        </p>
        <Link
          href="/post-tuition"
          className="mt-4 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
        >
          টিউশন পোস্ট করুন
        </Link>
      </Card>
    </div>
  );
}
