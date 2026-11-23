import { SITE_NAME_BN } from "@/lib/site";
import Link from "next/link";

const SITE_LINKS = [
  { href: "/", label: "হোম" },
  { href: "/jobs", label: "টিউশন খুঁজুন" },
  { href: "/tutors", label: "টিউটর" },
  { href: "/post-tuition", label: "টিউশন পোস্ট করুন" },
  { href: "/how-it-works", label: "কীভাবে কাজ করে" },
  { href: "/about", label: "আমাদের সম্পর্কে" },
];

const TUTOR_LINKS = [
  { href: "/register", label: "টিউটর রেজিস্টার" },
  { href: "/login", label: "লগ ইন" },
  { href: "/dashboard", label: "ড্যাশবোর্ড" },
  { href: "/dashboard/profile", label: "প্রোফাইল সম্পাদনা" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-stone-900">{SITE_NAME_BN}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-500">
            সিরাজগঞ্জ জেলার টিউটর ও অভিভাবকদের জন্য সম্পূর্ণ ফ্রি টিউশন
            মিডিয়া। আমরা টিউটর আর অভিভাবককে যোগাযোগ করিয়ে দিই — কোনো
            কমিশন নেই, কোনো ফি নেই, কখনোই না।
          </p>
        </div>
        <div>
          <p className="text-sm font-bold text-stone-900">সাইট</p>
          <ul className="mt-3 space-y-2">
            {SITE_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-stone-500 hover:text-emerald-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-stone-900">টিউটর</p>
          <ul className="mt-3 space-y-2">
            {TUTOR_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-stone-500 hover:text-emerald-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-100">
        <p className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-stone-400">
          © {new Date().getFullYear()} {SITE_NAME_BN} — সিরাজগঞ্জের জন্য, সম্পূর্ণ ফ্রি।
        </p>
      </div>
    </footer>
  );
}
