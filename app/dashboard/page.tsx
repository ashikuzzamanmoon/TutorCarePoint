import {
  ApplicationStatusBadge,
  Card,
  EmptyState,
  SectionTitle,
} from "@/components/ui";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { districtName } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();
  if (user.role === "ADMIN") redirect("/admin");

  const profile = user.tutorProfile;
  const profileIncomplete =
    !profile || profile.subjects.length === 0 || profile.classes.length === 0;

  const applications = profile
    ? await prisma.application.findMany({
        where: { tutorId: profile.id },
        include: { job: true },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <SectionTitle
        title={`স্বাগতম, ${profile?.displayName ?? user.name ?? "টিউটর"}`}
        subtitle="আপনার আবেদনগুলোর অবস্থা এখানে দেখতে পারবেন।"
      />

      {profileIncomplete ? (
        <Card className="mb-6 border-amber-200 bg-amber-50 p-5">
          <p className="font-bold text-amber-800">
            আপনার প্রোফাইল এখনো সম্পূর্ণ হয়নি
          </p>
          <p className="mt-1 text-sm text-amber-700">
            বিষয় ও শ্রেণি বেছে নিলে আপনার প্রোফাইল টিউটর তালিকায় দেখা
            যাবে, আর অভিভাবকরা আপনাকে খুঁজে পাবে।
          </p>
          <Link
            href="/dashboard/profile"
            className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
          >
            প্রোফাইল সম্পন্ন করুন
          </Link>
        </Card>
      ) : null}

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/dashboard/profile"
          className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
        >
          প্রোফাইল সম্পাদনা
        </Link>
        <Link
          href="/jobs"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
        >
          টিউশন খুঁজুন
        </Link>
      </div>

      <h2 className="text-lg font-bold text-stone-900">আমার আবেদন</h2>
      {applications.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="আপনি এখনো কোনো টিউশনে আবেদন করেননি"
            body="জব বোর্ড থেকে পছন্দের টিউশন খুঁজে আবেদন করুন।"
            action={
              <Link
                href="/jobs"
                className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
              >
                টিউশন খুঁজুন
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="font-bold text-stone-900 hover:text-emerald-700 hover:underline"
                  >
                    {application.job.title}
                  </Link>
                  <p className="mt-1 text-sm text-stone-500">
                    {application.job.area
                      ? `${application.job.area}, ${districtName(application.job.district)}`
                      : districtName(application.job.district)}{" "}
                    · আবেদন: {formatDate(application.createdAt)}
                  </p>
                </div>
                <ApplicationStatusBadge status={application.status} />
              </div>

              {application.note ? (
                <p className="mt-3 text-sm text-stone-500">
                  আপনার বার্তা: {application.note}
                </p>
              ) : null}

              {/* Guardian contact is revealed ONLY on confirmation. */}
              {application.status === "CONFIRMED" ||
              application.status === "COMPLETED" ? (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <p className="font-bold text-emerald-800">
                    অভিনন্দন! এই টিউশনটি কনফার্ম হয়েছে।
                  </p>
                  <p className="mt-2 text-sm text-stone-700">
                    অভিভাবক: {application.job.guardianName}
                  </p>
                  <p className="mt-1 text-sm text-stone-700">
                    ফোন:{" "}
                    <a
                      href={`tel:${application.job.guardianPhone}`}
                      className="font-bold text-emerald-700 hover:underline"
                    >
                      {application.job.guardianPhone}
                    </a>
                  </p>
                  <p className="mt-2 text-xs text-stone-500">
                    অভিভাবকের সাথে কথা বলে পড়ানোর সময় ঠিক করে নিন। বেতন
                    অভিভাবক সরাসরি আপনাকে দেবেন — আমাদের কোনো কমিশন নেই।
                  </p>
                </div>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
