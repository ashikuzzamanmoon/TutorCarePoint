import { ResetPasswordForm } from "@/components/password-reset-forms";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { SITE_NAME_BN } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `নতুন পাসওয়ার্ড নির্ধারণ — ${SITE_NAME_BN}`,
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <Card className="p-6 text-center">
          <p className="text-lg font-bold text-red-600">অবৈধ অনুরোধ</p>
          <p className="mt-2 text-sm text-stone-500">
            কোনো পাসওয়ার্ড রিসেট টোকেন পাওয়া যায়নি।
          </p>
          <div className="mt-5">
            <Link
              href="/forgot-password"
              className="cursor-pointer inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
            >
              নতুন লিংক অনুরোধ করুন
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  const isExpired = !record || record.expires < new Date();

  if (isExpired) {
    return (
      <div className="mx-auto max-w-md px-4 py-10">
        <Card className="p-6 text-center">
          <p className="text-lg font-bold text-red-600">লিংকটির মেয়াদ শেষ</p>
          <p className="mt-2 text-sm text-stone-500">
            এই পাসওয়ার্ড রিসেট লিংকটির মেয়াদ শেষ হয়ে গেছে বা এটি ইতিমধ্যে
            ব্যবহার করা হয়েছে।
          </p>
          <div className="mt-5">
            <Link
              href="/forgot-password"
              className="cursor-pointer inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
            >
              নতুন লিংক অনুরোধ করুন
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-stone-900">
          নতুন পাসওয়ার্ড দিন
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী নতুন পাসওয়ার্ড নির্ধারণ করুন।
        </p>

        <div className="mt-6">
          <ResetPasswordForm token={token} />
        </div>
      </Card>
    </div>
  );
}
