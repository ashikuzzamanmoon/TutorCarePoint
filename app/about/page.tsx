import { Card, SectionTitle } from "@/components/ui";
import { SITE_NAME_BN } from "@/lib/site";
import Link from "next/link";

export const metadata = {
  title: `আমাদের সম্পর্কে — ${SITE_NAME_BN}`,
  description:
    "সারা বাংলাদেশের টিউটর ও অভিভাবকদের জন্য সম্পূর্ণ ফ্রি টিউশন মিডিয়া — সিরাজগঞ্জ থেকে শুরু, কোনো কমিশন ছাড়া।",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <SectionTitle
        title="আমাদের সম্পর্কে"
        subtitle={`${SITE_NAME_BN} — সারা বাংলাদেশের টিউটর ও অভিভাবকদের জন্য সম্পূর্ণ ফ্রি টিউশন মিডিয়া।`}
      />

      <Card className="p-6">
        <h2 className="text-lg font-bold text-stone-900">আমরা কী করি</h2>
        <p className="mt-2 leading-relaxed text-stone-600">
          আমরা টিউটর আর অভিভাবককে যোগাযোগ করিয়ে দিই। অভিভাবক তার চাহিদা
          পোস্ট করেন, টিউটর আবেদন করেন — আমরা যাচাই করি, শর্টলিস্ট করি,
          ডেমো ক্লাসের ব্যবস্থা করি, আর কনফার্ম হলে দুজনকে সরাসরি যোগাযোগ
          করিয়ে দিই। সিরাজগঞ্জ থেকে শুরু হয়েছে এই যাত্রা — এখন সারা
          বাংলাদেশের ৬৪ জেলার জন্য।
        </p>
      </Card>

      <Card className="mt-4 border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-lg font-bold text-stone-900">
          আমাদের প্রতিশ্রুতি: সবসময় ফ্রি
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-stone-700">
          <li>টিউটরের বেতন থেকে কোনো কমিশন কাটা হয় না — ০%।</li>
          <li>কোনো ভেরিফিকেশন ফি নেই, কোনো ডিপোজিট নেই।</li>
          <li>অভিভাবকদের জন্য পোস্ট করা ও টিউটর খোঁজা সম্পূর্ণ ফ্রি।</li>
          <li>
            প্রথম মাসের পরেও কোনো টাকা দিতে হয় না — বেতন অভিভাবক সরাসরি
            টিউটরকে দেন।
          </li>
        </ul>
        <p className="mt-3 text-sm text-stone-500">
          অন্য টিউশন মিডিয়াগুলো সাধারণত প্রথম মাসের বেতনের ৫০–৬০% কেটে
          রাখে। আমরা মনে করি, টিউটর তার পুরো পরিশ্রমের টাকা পাওয়ার অধিকার
          রাখে।
        </p>
      </Card>

      <Card className="mt-4 p-6">
        <h2 className="text-lg font-bold text-stone-900">যেভাবে আস্থা রাখি</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-stone-600">
          <li>প্রতিটি টিউশন পোস্ট ফোনে যাচাই করে প্রকাশ করা হয়।</li>
          <li>
            যাচাইকৃত টিউটরদের প্রোফাইলে যাচাইকৃত ব্যাজ দেখানো হয়।
          </li>
          <li>
            ৩০ দিনের পুরনো পোস্ট স্বয়ংক্রিয়ভাবে সরিয়ে ফেলা হয় — বাসি
            পোস্ট এখানে থাকে না।
          </li>
          <li>
            ফোন নম্বর কখনো প্রকাশ্যে দেখানো হয় না — শুধু কনফার্ম হওয়ার
            পর সংশ্লিষ্ট পক্ষ দেখতে পায়।
          </li>
        </ul>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/jobs"
          className="rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
        >
          টিউশন খুঁজুন
        </Link>
        <Link
          href="/post-tuition"
          className="rounded-lg border border-emerald-600 px-5 py-2.5 font-bold text-emerald-700 hover:bg-emerald-50"
        >
          টিউশন পোস্ট করুন
        </Link>
        <Link
          href="/how-it-works"
          className="rounded-lg border border-stone-300 px-5 py-2.5 font-bold text-stone-700 hover:bg-stone-50"
        >
          কীভাবে কাজ করে
        </Link>
      </div>
    </div>
  );
}
