import { Badge, Card } from "@/components/ui";
import { MEDIUM_LABELS, districtName } from "@/lib/site";
import { formatSalary, initials } from "@/lib/utils";
import type { TutorProfile } from "@prisma/client";
import Link from "next/link";

// Public card — never shows the tutor's phone number. Contact happens only
// through the mediated flow after confirmation.
export function TutorCard({ tutor }: { tutor: TutorProfile }) {
  return (
    <Link href={`/tutors/${tutor.id}`} prefetch={true} className="block">
      <Card className="h-full p-5 transition hover:border-emerald-300 hover:shadow">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-800">
            {initials(tutor.displayName)}
          </span>
          <div className="min-w-0">
            <h3 className="flex flex-wrap items-center gap-2 text-base font-bold text-stone-900">
              {tutor.displayName}
              {tutor.isVerified ? (
                <Badge tone="green">যাচাইকৃত</Badge>
              ) : null}
            </h3>
            <p className="mt-0.5 text-sm text-stone-500">
              {tutor.educationLevel}
              {tutor.institution ? `, ${tutor.institution}` : ""}
            </p>
            <p className="text-sm text-stone-500">
              {tutor.area
                ? `${tutor.area}, ${districtName(tutor.district)}`
                : districtName(tutor.district)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tutor.subjects.slice(0, 5).map((subject) => (
            <Badge key={subject} tone="neutral">
              {subject}
            </Badge>
          ))}
          {tutor.subjects.length > 5 ? (
            <Badge tone="neutral">
              +{(tutor.subjects.length - 5).toLocaleString("bn-BD")}টি
            </Badge>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {tutor.mediums.map((medium) => (
            <Badge key={medium} tone="blue">
              {MEDIUM_LABELS[medium]}
            </Badge>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 text-sm">
          <span className="font-bold text-emerald-700">
            {tutor.expectedSalary != null
              ? `${formatSalary(tutor.expectedSalary)}/মাস`
              : "বেতন আলোচনা সাপেক্ষে"}
          </span>
          <span className="text-stone-500">
            অভিজ্ঞতা: {tutor.experienceYears.toLocaleString("bn-BD")} বছর
          </span>
        </div>
      </Card>
    </Link>
  );
}
