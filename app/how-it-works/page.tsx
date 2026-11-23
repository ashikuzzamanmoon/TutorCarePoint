import { Card, SectionTitle } from "@/components/ui";
import { SITE_NAME_BN } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `কীভাবে কাজ করে — ${SITE_NAME_BN}`,
  description:
    "টিউটর ও অভিভাবকদের জন্য ধাপে ধাপে প্রক্রিয়া — আবেদন, শর্টলিস্ট, ডেমো ক্লাস, কনফার্ম ও যোগাযোগ। সবকিছু সম্পূর্ণ ফ্রি।",
};

const TUTOR_STEPS = [
  {
    title: "১. রেজিস্টার করুন (ফ্রি)",
    body: "ইমেইল ও মোবাইল নম্বর দিয়ে অ্যাকাউন্ট খুলুন। তারপর প্রোফাইলে বিষয়, শ্রেণি, মাধ্যম ও প্রত্যাশিত বেতন লিখুন।",
  },
  {
    title: "২. টিউশনে আবেদন করুন",
    body: "জব বোর্ড থেকে পছন্দের টিউশন খুঁজে আবেদন করুন। একই টিউশনে একবারই আবেদন করা যায়।",
  },
  {
    title: "৩. শর্টলিস্ট ও ডেমো ক্লাস",
    body: "আমরা আপনার প্রোফাইল অভিভাবকের কাছে পাঠাই। শর্টলিস্ট হলে একটি ফ্রি ডেমো ক্লাস নিন।",
  },
  {
    title: "৪. কনফার্ম ও যোগাযোগ",
    body: "অভিভাবক কনফার্ম করলে ড্যাশবোর্ডে অভিভাবকের ফোন নম্বর দেখতে পাবেন। এরপর সরাসরি কথা বলে পড়ানো শুরু করুন — বেতন পুরোটাই আপনার।",
  },
];

const GUARDIAN_STEPS = [
  {
    title: "১. চাহিদা পোস্ট করুন (অ্যাকাউন্ট লাগে না)",
    body: "শ্রেণি, বিষয়, এলাকা, বেতন ও দিন লিখে ফর্মটি জমা দিন। কোনো অ্যাকাউন্ট খুলতে হয় না, কোনো টাকা লাগে না।",
  },
  {
    title: "২. যাচাই",
    body: "আমরা আপনার নম্বরে ফোন করে পোস্টটি যাচাই করি, তারপর প্রকাশ করি। ভুয়া পোস্ট এখানে জায়গা পায় না।",
  },
  {
    title: "৩. শর্টলিস্ট দেখুন",
    body: "আবেদনকারী টিউটরদের মধ্যে থেকে আমরা উপযুক্তদের শর্টলিস্ট করে আপনাকে জানাই।",
  },
  {
    title: "৪. ফ্রি ডেমো ক্লাস ও কনফার্ম",
    body: "শর্টলিস্ট হওয়া টিউটর একটি ফ্রি ডেমো ক্লাস নেন। পছন্দ হলে কনফার্ম করুন — আমরা টিউটরের সাথে যোগাযোগ করিয়ে দেবো।",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <SectionTitle
        title="কীভাবে কাজ করে"
        subtitle="টিউটর আর অভিভাবক — দুজনের জন্যই পুরো প্রক্রিয়াটা সম্পূর্ণ ফ্রি।"
      />

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="font-bold text-emerald-800">
          এক কথায়: আমরা মাঝখানে থেকে টিউটর আর অভিভাবককে যোগাযোগ করিয়ে দিই।
        </p>
        <p className="mt-1 text-stone-600">
          অন্য মিডিয়ার মতো আমরা প্রথম মাসের বেতনের ৫০–৬০% কেটে রাখি না।
          এখানে কোনো কমিশন নেই, কোনো ভেরিফিকেশন ফি নেই, কোনো ডিপোজিট
          নেই — কখনোই না।
        </p>
      </div>

      <h2 className="mt-10 text-xl font-bold text-stone-900">
        টিউটরদের জন্য
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {TUTOR_STEPS.map((step) => (
          <Card key={step.title} className="p-5">
            <h3 className="font-bold text-stone-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">
              {step.body}
            </p>
          </Card>
        ))}
      </div>
      <p className="mt-4">
        <Link
          href="/register"
          className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
        >
          টিউটর হিসেবে রেজিস্টার করুন
        </Link>
      </p>

      <h2 className="mt-10 text-xl font-bold text-stone-900">
        অভিভাবকদের জন্য
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {GUARDIAN_STEPS.map((step) => (
          <Card key={step.title} className="p-5">
            <h3 className="font-bold text-stone-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-stone-500">
              {step.body}
            </p>
          </Card>
        ))}
      </div>
      <p className="mt-4">
        <Link
          href="/post-tuition"
          className="inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
        >
          টিউশন পোস্ট করুন
        </Link>
      </p>

      <Card className="mt-10 p-6">
        <h2 className="text-lg font-bold text-stone-900">
          গোপনীয়তা — ফোন নম্বর কখন দেখা যায়?
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-stone-600">
          <li>
            টিউটরের ফোন নম্বর কখনো প্রকাশ্যে দেখানো হয় না।
          </li>
          <li>
            অভিভাবকের ফোন নম্বর শুধু সেই টিউটর দেখতে পান, যার আবেদন কনফার্ম
            হয়েছে — ড্যাশবোর্ডে।
          </li>
          <li>
            পোস্ট করার সময় দেওয়া নম্বর শুধু যাচাই ও যোগাযোগের জন্য ব্যবহৃত
            হয়।
          </li>
        </ul>
      </Card>
    </div>
  );
}
