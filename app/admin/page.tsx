import { Card, SectionTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import {
  APPLICATION_STATUS_LABELS,
  districtName,
} from "@/lib/site";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [
    tutorCount,
    verifiedTutorCount,
    openJobCount,
    pendingJobCount,
    filledJobCount,
    applicationGroups,
    pendingJobs,
    recentApplications,
  ] = await Promise.all([
    prisma.tutorProfile.count(),
    prisma.tutorProfile.count({ where: { isVerified: true } }),
    prisma.job.count({ where: { status: "OPEN" } }),
    prisma.job.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.job.count({ where: { status: "FILLED" } }),
    prisma.application.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.job.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
    prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { job: true, tutor: true },
    }),
  ]);

  const stats = [
    { label: "মোট টিউটর", value: tutorCount, href: "/admin/tutors" },
    { label: "যাচাইকৃত টিউটর", value: verifiedTutorCount, href: "/admin/tutors" },
    { label: "সক্রিয় টিউশন", value: openJobCount, href: "/admin/jobs?status=OPEN" },
    { label: "যাচাইয়ের অপেক্ষায়", value: pendingJobCount, href: "/admin/jobs?status=PENDING_REVIEW" },
    { label: "নিয়োগ সম্পন্ন", value: filledJobCount, href: "/admin/jobs?status=FILLED" },
  ];

  return (
    <div>
      <SectionTitle title="সংক্ষিপ্ত বিবরণ" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-5 transition hover:border-emerald-300">
              <p className="text-3xl font-bold text-stone-900">
                {stat.value.toLocaleString("bn-BD")}
              </p>
              <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-bold text-stone-900">আবেদনের অবস্থা</h2>
          {applicationGroups.length === 0 ? (
            <p className="mt-3 text-sm text-stone-500">
              এখনো কোনো আবেদন জমা হয়নি।
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {applicationGroups.map((group) => (
                <li
                  key={group.status}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-stone-600">
                    {APPLICATION_STATUS_LABELS[group.status]}
                  </span>
                  <span className="font-bold text-stone-900">
                    {group._count.status.toLocaleString("bn-BD")}টি
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4">
            <Link
              href="/admin/applications"
              className="text-sm font-bold text-emerald-700 hover:underline"
            >
              সব আবেদন দেখুন →
            </Link>
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="font-bold text-stone-900">
            যাচাইয়ের অপেক্ষায় থাকা পোস্ট
          </h2>
          {pendingJobs.length === 0 ? (
            <p className="mt-3 text-sm text-stone-500">
              যাচাইয়ের অপেক্ষায় কোনো পোস্ট নেই।
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {pendingJobs.map((job) => (
                <li key={job.id}>
                  <Link
                    href={`/admin/jobs/${job.id}`}
                    className="font-semibold text-stone-800 hover:text-emerald-700 hover:underline"
                  >
                    {job.title}
                  </Link>
                  <p className="text-xs text-stone-500">
                    {districtName(job.district)} · {timeAgo(job.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4">
            <Link
              href="/admin/jobs?status=PENDING_REVIEW"
              className="text-sm font-bold text-emerald-700 hover:underline"
            >
              সব পোস্ট দেখুন →
            </Link>
          </p>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <h2 className="font-bold text-stone-900">সাম্প্রতিক আবেদন</h2>
        {recentApplications.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            এখনো কোনো আবেদন জমা হয়নি।
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {recentApplications.map((application) => (
              <li key={application.id} className="text-sm">
                <span className="font-semibold text-stone-800">
                  {application.tutor.displayName}
                </span>{" "}
                <span className="text-stone-500">আবেদন করেছেন —</span>{" "}
                <Link
                  href={`/admin/jobs/${application.job.id}`}
                  className="font-semibold text-stone-800 hover:text-emerald-700 hover:underline"
                >
                  {application.job.title}
                </Link>
                <span className="text-stone-500">
                  {" "}
                  · {APPLICATION_STATUS_LABELS[application.status]} ·{" "}
                  {timeAgo(application.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
