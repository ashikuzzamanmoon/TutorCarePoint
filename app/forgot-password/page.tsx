import { ForgotPasswordForm } from "@/components/password-reset-forms";
import { Card } from "@/components/ui";
import { SITE_NAME_BN } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `পাসওয়ার্ড ভুলে গেছেন — ${SITE_NAME_BN}`,
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-stone-900">
          পাসওয়ার্ড ভুলে গেছেন?
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          আপনার অ্যাকাউন্টের ইমেইল ঠিকানা দিন। আমরা পাসওয়ার্ড রিসেট করার একটি
          লিংক পাঠাব।
        </p>

        <div className="mt-6">
          <ForgotPasswordForm />
        </div>

        <div className="mt-6 text-center text-sm text-stone-500">
          মনে পড়েছে?{" "}
          <Link
            href="/login"
            className="cursor-pointer font-bold text-emerald-700 hover:underline"
          >
            লগ ইন পেজে ফিরে যান
          </Link>
        </div>
      </Card>
    </div>
  );
}
