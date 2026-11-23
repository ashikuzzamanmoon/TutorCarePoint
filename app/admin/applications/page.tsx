import { ApplicationStatusForm } from "@/components/admin-actions";
import {
  ApplicationStatusBadge,
  EmptyState,
  SectionTitle,
} from "@/components/ui";
import { prisma } from "@/lib/prisma";
import {
  APPLICATION_PIPELINE,
  APPLICATION_STATUS_LABELS,
  districtName,
} from "@/lib/site";
import { formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter =
    params.status && (APPLICATION_PIPELINE as string[]).includes(params.status)
      ? (params.status as ApplicationStatus)
      : undefined;

  const applications = await prisma.application.findMany({
    where: statusFilter ? { status: statusFilter } : {},
    orderBy: { updatedAt: "desc" },
    include: { job: true, tutor: true },
    take: 100,
  });

  return (
    <div>
      <SectionTitle
        title="আবেদন"
        subtitle="সব আবেদন — পাইপলাইনের ধাপ বদলান: আবেদন → শর্টলিস্ট → ডেমো → কনফার্ম।"
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/applications"
          className={`rounded-full px-4 py-2 text-sm font-bold ${!statusFilter ? "bg-emerald-600 text-white" : "border border-stone-300 text-stone-700 hover:bg-stone-50"}`}
        >
          সব
        </Link>
        {APPLICATION_PIPELINE.map((status) => (
          <Link
            key={status}
            href={`/admin/applications?status=${status}`}
            className={`rounded-full px-4 py-2 text-sm font-bold ${statusFilter === status ? "bg-emerald-600 text-white" : "border border-stone-300 text-stone-700 hover:bg-stone-50"}`}
          >
            {APPLICATION_STATUS_LABELS[status]}
          </Link>
        ))}
      </div>

      {applications.length === 0 ? (
        <EmptyState title="কোনো আবেদন পাওয়া যায়নি" />
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-stone-900">
                    <Link
                      href={`/tutors/${application.tutor.id}`}
                      className="font-bold hover:text-emerald-700 hover:underline"
                    >
                      {application.tutor.displayName}
                    </Link>{" "}
                    <span className="text-stone-500">→</span>{" "}
                    <Link
                      href={`/admin/jobs/${application.job.id}`}
                      className="font-bold hover:text-emerald-700 hover:underline"
                    >
                      {application.job.title}
                    </Link>
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    টিউটর ফোন:{" "}
                    <a
                      href={`tel:${application.tutor.phone}`}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      {application.tutor.phone}
                    </a>{" "}
                    · অভিভাবক: {application.job.guardianName} ·{" "}
                    <a
                      href={`tel:${application.job.guardianPhone}`}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      {application.job.guardianPhone}
                    </a>
                  </p>
                  <p className="text-sm text-stone-500">
                    {districtName(application.job.district)} · আবেদন:{" "}
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
