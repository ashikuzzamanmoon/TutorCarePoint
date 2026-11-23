import { LoginForm } from "@/components/auth-forms";
import { Card } from "@/components/ui";
import { SITE_NAME_BN } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `লগ ইন — ${SITE_NAME_BN}`,
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-stone-900">লগ ইন</h1>
        <p className="mt-1 text-sm text-stone-500">
          টিউটর অ্যাকাউন্টে লগ ইন করুন
        </p>
        {params.registered === "1" ? (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800">
            অ্যাকাউন্ট তৈরি হয়েছে! এখন লগ ইন করুন।
          </p>
        ) : null}
        <div className="mt-5">
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-sm text-stone-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/register"
            className="font-bold text-emerald-700 hover:underline"
          >
            রেজিস্টার করুন — ফ্রি
          </Link>
        </p>
      </Card>
    </div>
  );
}
