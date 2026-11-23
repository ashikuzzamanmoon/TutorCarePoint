import { Badge, Card, JobStatusBadge } from "@/components/ui";
import {
  GENDER_LABELS,
  MEDIUM_LABELS,
  districtName,
} from "@/lib/site";
import { formatDate, formatSalary, timeAgo } from "@/lib/utils";
import type { Job } from "@prisma/client";
import Link from "next/link";

export function JobCard({ job }: { job: Job }) {
  const location = [job.area, job.upazila, districtName(job.district)]
    .filter(Boolean)
    .join(", ");
  const posted = job.publishedAt ?? job.createdAt;

  return (
    <Link href={`/jobs/${job.id}`} prefetch={true} className="block">
      <Card className="h-full p-5 transition hover:border-emerald-300 hover:shadow">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold leading-snug text-stone-900">
            {job.title}
          </h3>
          <JobStatusBadge status={job.status} />
        </div>

        <p className="mt-2 text-sm text-stone-500">{location}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3 text-sm">
          <span className="font-bold text-emerald-700">
            {job.salaryNegotiable || job.salary == null
              ? "বেতন আলোচনা সাপেক্ষে"
              : `${formatSalary(job.salary)}/মাস`}
          </span>
          <span className="text-stone-500">
            সপ্তাহে {job.daysPerWeek.toLocaleString("bn-BD")} দিন
          </span>
        </div>

        <p className="mt-2 text-xs text-stone-400">
          পোস্ট: {formatDate(posted)} ({timeAgo(posted)})
        </p>
      </Card>
    </Link>
  );
}
