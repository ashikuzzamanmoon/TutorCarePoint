import {
  TutorPublishToggle,
  TutorVerifyToggle,
} from "@/components/admin-actions";
import { AdminResetPasswordModal } from "@/components/admin-reset-password";
import { Badge, EmptyState, SectionTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { districtName } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminTutorsPage() {
  const tutors = await prisma.tutorProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true } },
      _count: { select: { applications: true } },
    },
    take: 100,
  });

  return (
    <div>
      <SectionTitle
        title="টিউটর"
        subtitle="সব টিউটর — যাচাই ব্যাজ ও তালিকায় দেখানো নিয়ন্ত্রণ করুন।"
      />
      {tutors.length === 0 ? (
        <EmptyState title="এখনো কোনো টিউটর রেজিস্টার করেননি" />
      ) : (
        <div className="space-y-4">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/tutors/${tutor.id}`}
                    className="font-bold text-stone-900 hover:text-emerald-700 hover:underline"
                  >
                    {tutor.displayName}
                  </Link>
                  <p className="mt-1 text-sm text-stone-500">
                    {tutor.user.email} ·{" "}
                    <a
                      href={`tel:${tutor.phone}`}
                      className="font-semibold text-emerald-700 hover:underline"
                    >
                      {tutor.phone}
                    </a>{" "}
                    ·{" "}
                    {[tutor.area, tutor.upazila, districtName(tutor.district)]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="text-sm text-stone-500">
                    {tutor.educationLevel}
                    {tutor.institution ? `, ${tutor.institution}` : ""} ·{" "}
                    {tutor._count.applications.toLocaleString("bn-BD")}টি আবেদন
                    · যোগদান: {formatDate(tutor.createdAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tutor.subjects.slice(0, 6).map((s) => (
                      <Badge key={s} tone="neutral">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.isVerified ? (
                    <Badge tone="green">যাচাইকৃত</Badge>
                  ) : (
                    <Badge tone="stone">যাচাই হয়নি</Badge>
                  )}
                  {!tutor.isPublished ? (
                    <Badge tone="amber">তালিকায় লুকানো</Badge>
                  ) : null}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
                <TutorVerifyToggle
                  tutorId={tutor.id}
                  isVerified={tutor.isVerified}
                />
                <TutorPublishToggle
                  tutorId={tutor.id}
                  isPublished={tutor.isPublished}
                />
                <AdminResetPasswordModal
                  userId={tutor.user.id}
                  userEmail={tutor.user.email}
                  userName={tutor.displayName}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
