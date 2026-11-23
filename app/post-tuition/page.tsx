import { PostTuitionForm } from "@/components/post-tuition-form";
import { Card, SectionTitle } from "@/components/ui";
import { SITE_NAME_BN } from "@/lib/site";

export const metadata = {
  title: `টিউশন পোস্ট করুন — ${SITE_NAME_BN}`,
  description:
    "আপনার সন্তানের জন্য টিউটর খুঁজুন। অ্যাকাউন্ট লাগে না, টাকা লাগে না — চাহিদা পোস্ট করুন, আমরা যাচাই করে উপযুক্ত টিউটর খুঁজে দেবো।",
};

export default function PostTuitionPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <SectionTitle
        title="টিউশন পোস্ট করুন"
        subtitle="অ্যাকাউন্ট লাগে না, টাকা লাগে না। চাহিদা লিখে জমা দিন — আমরা ফোনে যাচাই করে পোস্টটি প্রকাশ করবো।"
      />
      <Card className="p-6">
        <PostTuitionForm />
      </Card>

      <Card className="mt-4 p-6">
        <h2 className="text-lg font-bold text-stone-900">এরপর কী হবে?</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-stone-600">
          <li>
            আমরা আপনার দেওয়া নম্বরে ফোন করে পোস্টটি যাচাই করবো, তারপর
            প্রকাশ করবো।
          </li>
          <li>টিউটররা আপনার পোস্টে আবেদন করবে।</li>
          <li>
            আমরা উপযুক্ত টিউটর শর্টলিস্ট করে আপনাকে জানাবো, তারপর ফ্রি ডেমো
            ক্লাসের ব্যবস্থা করবো।
          </li>
          <li>
            ডেমো ক্লাস পছন্দ হলে কনফার্ম করুন — আমরা টিউটরের সাথে আপনার
            যোগাযোগ করিয়ে দেবো।
          </li>
          <li>
            এরপর থেকে বেতন আপনি সরাসরি টিউটরকে দেবেন। আমাদের কোনো কমিশন
            নেই — কখনোই না।
          </li>
        </ol>
      </Card>
    </div>
  );
}
