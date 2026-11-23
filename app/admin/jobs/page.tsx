import { JobReviewActions } from "@/components/admin-actions";
import { EmptyState, JobStatusBadge, SectionTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { JOB_STATUS_LABELS, districtName } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import type { JobStatus } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUSES: JobStatus[] = [
  "PENDING_REVIEW",
  "OPEN",
  "FILLED",
  "EXPIRED",
  "CANCELLED",
];

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter =
    params.status && (STATUSES as string[]).includes(params.status)
      ? (params.status as JobStatus)
      : undefined;

  const jobs = await prisma.job.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
    take: 100,
  });

  return (
    <div>
      <SectionTitle title="টিউশন" subtitle="সব পোস্ট — যাচাই, প্রকাশ ও অবস্থা পরিচালনা।" />
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/jobs"
          className={`rounded-full px-4 py-2 text-sm font-bold ${!statusFilter ? "bg-emerald-600 text-white" : "border border-stone-300 text-stone-700 hover:bg-stone-50"}`}
        >
          সব
        </Link>
        {STATUSES.map((status) => (
          <Link
            key={status}
            href={`/admin/jobs?status=${status}`}
            className={`rounded-full px-4 py-2 text-sm font-bold ${statusFilter === status ? "bg-emerald-600 text-white" : "border border-stone-300 text-stone-700 hover:bg-stone-50"}`}
          >
            {JOB_STATUS_LABELS[status]}
          </Link>
        ))}
      </div>

      {jobs.length === 0 ? (
        <EmptyState title="কোনো টিউশন পাওয়া যায়নি" />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="font-bold text-stone-900 hover:text-emerald-700 hover:underline"
                  >
                    {job.title}
                  </Link>
                  <p className="mt-1 text-sm text-stone-500">
                    {[job.area, job.upazila, districtName(job.district)]
                      .filter(Boolean)
                      .join(", ")}{" "}
                    · অভিভাবক: {job.guardianName} · {job.guardianPhone} ·{" "}
                    {job._count.applications.toLocaleString("bn-BD")}টি আবেদন
                    · {formatDate(job.createdAt)}
                  </p>
                </div>
                <JobStatusBadge status={job.status} />
              </div>
              {job.status === "PENDING_REVIEW" ? (
                <div className="mt-4">
                  <p className="mb-2 text-xs text-stone-500">
                    প্রকাশের আগে অভিভাবকের নম্বরে ফোন করে যাচাই করুন।
                  </p>
                  <JobReviewActions jobId={job.id} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
