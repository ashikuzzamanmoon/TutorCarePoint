import { ProfileForm } from "@/components/profile-form";
import { Card, SectionTitle } from "@/components/ui";
import { requireUser } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <SectionTitle
        title="আমার প্রোফাইল"
        subtitle="বিষয়, শ্রেণি ও বেতনসহ প্রোফাইল সম্পন্ন করুন — তাহলে টিউটর তালিকায় আপনাকে দেখা যাবে।"
      />
      {params.setup === "1" ? (
        <p className="mb-4 rounded-lg bg-sky-50 px-3 py-2.5 text-sm font-semibold text-sky-800">
          স্বাগতম! আবেদন করার আগে আপনার প্রোফাইলটি সম্পন্ন করুন।
        </p>
      ) : null}
      <Card className="p-6">
        <ProfileForm profile={user.tutorProfile} />
      </Card>
    </div>
  );
}
