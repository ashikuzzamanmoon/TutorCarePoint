import {
  ApplicationStatusForm,
  JobReviewActions,
  JobStatusForm,
} from "@/components/admin-actions";
import {
  ApplicationStatusBadge,
  Badge,
  Card,
  JobStatusBadge,
} from "@/components/ui";
import { prisma } from "@/lib/prisma";
import {
  GENDER_LABELS,
  MEDIUM_LABELS,
  districtName,
} from "@/lib/site";
import { formatDate, formatSalary, timeAgo } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      applications: {
        include: { tutor: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!job) notFound();

  const location = job.area
    ? `${job.area}, ${districtName(job.district)}`
    : districtName(job.district);

  return (
    <div>
      <Link
        href="/admin/jobs"
        className="text-sm font-bold text-emerald-700 hover:underline"
      >
        ← সব টিউশন
      </Link>

      <Card className="mt-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-stone-900">{job.title}</h1>
          <JobStatusBadge status={job.status} />
        </div>
        <p className="mt-2 text-stone-500">{location}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.subjects.map((s) => (
            <Badge key={s} tone="neutral">
              {s}
            </Badge>
          ))}
          <Badge tone="blue">{MEDIUM_LABELS[job.medium]}</Badge>
          <Badge tone="neutral">
            {GENDER_LABELS[job.tutorGenderPreference]} টিউটর
          </Badge>
        </div>

        <dl className="mt-5 grid gap-4 border-t border-stone-100 pt-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase text-stone-400">শ্রেণি</dt>
            <dd className="mt-1 font-semibold text-stone-800">{job.className}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-stone-400">বেতন</dt>
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
              {formatDate(job.createdAt)} ({timeAgo(job.createdAt)})
              {job.publishedAt
                ? ` · প্রকাশ: ${formatDate(job.publishedAt)}`
                : ""}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-stone-400">
              অভিভাবক (শুধু অ্যাডমিন দেখতে পায়)
            </dt>
            <dd className="mt-1 font-semibold text-stone-800">
              {job.guardianName} ·{" "}
              <a
                href={`tel:${job.guardianPhone}`}
                className="text-emerald-700 hover:underline"
              >
                {job.guardianPhone}
              </a>
            </dd>
          </div>
        </dl>

        {job.notes ? (
          <div className="mt-5 border-t border-stone-100 pt-4">
            <p className="text-xs font-bold uppercase text-stone-400">
              অভিভাবকের নোট
            </p>
            <p className="mt-1 whitespace-pre-wrap text-stone-700">{job.notes}</p>
          </div>
        ) : null}

        <div className="mt-6 border-t border-stone-100 pt-5">
          {job.status === "PENDING_REVIEW" ? (
            <>
              <p className="mb-3 text-sm text-stone-500">
                প্রকাশের আগে অভিভাবকের নম্বরে ফোন করে যাচাই করুন।
              </p>
              <JobReviewActions jobId={job.id} />
            </>
          ) : (
            <JobStatusForm jobId={job.id} current={job.status} />
          )}
        </div>
      </Card>

      <h2 className="mt-8 text-lg font-bold text-stone-900">
        আবেদন ({job.applications.length.toLocaleString("bn-BD")}টি)
      </h2>
      {job.applications.length === 0 ? (
        <p className="mt-3 text-sm text-stone-500">
          এই টিউশনে এখনো কোনো আবেদন জমা হয়নি।
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {job.applications.map((application) => (
            <Card key={application.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/tutors/${application.tutor.id}`}
                    className="font-bold text-stone-900 hover:text-emerald-700 hover:underline"
                  >
                    {application.tutor.displayName}
                  </Link>
                  <p className="mt-1 text-sm text-stone-500">
                    {application.tutor.educationLevel}
                    {application.tutor.institution
                      ? `, ${application.tutor.institution}`
                      : ""}{" "}
                    · {districtName(application.tutor.district)} · ফোন:{" "}
                    <a
                      href={`tel:${application.tutor.phone}`}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      {application.tutor.phone}
                    </a>
                  </p>
                  <p className="text-sm text-stone-500">
                    {application.tutor.subjects.join(", ")} · আবেদন:{" "}
                    {formatDate(application.createdAt)}
                  </p>
                  {application.note ? (
                    <p className="mt-2 text-sm text-stone-600">
                      বার্তা: {application.note}
                    </p>
                  ) : null}
                </div>
                <ApplicationStatusBadge status={application.status} />
              </div>
              <div className="mt-4 border-t border-stone-100 pt-4">
                <ApplicationStatusForm
                  applicationId={application.id}
                  current={application.status}
                />
                <p className="mt-2 text-xs text-stone-400">
                  কনফার্ম করলে টিউশনটি &quot;নিয়োগ সম্পন্ন&quot; হবে, আর
                  টিউটর ড্যাশবোর্ডে অভিভাবকের ফোন নম্বর দেখতে পাবে।
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
