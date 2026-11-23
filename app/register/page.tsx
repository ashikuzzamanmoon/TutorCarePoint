import { RegisterForm } from "@/components/auth-forms";
import { Card } from "@/components/ui";
import { SITE_NAME_BN } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `টিউটর রেজিস্টার — ${SITE_NAME_BN}`,
  description:
    "টিউটর হিসেবে ফ্রি রেজিস্টার করুন — কোনো ফি নেই, কোনো কমিশন নেই।",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-stone-900">
          টিউটর রেজিস্টার
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          সম্পূর্ণ ফ্রি — কোনো ফি নেই, কোনো কমিশন নেই।
        </p>
        <div className="mt-5">
          <RegisterForm />
        </div>
        <p className="mt-5 text-center text-sm text-stone-500">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/login"
            className="font-bold text-emerald-700 hover:underline"
          >
            লগ ইন করুন
          </Link>
        </p>
      </Card>
    </div>
  );
}
