import { auth } from "@/auth";
import { signOutAction } from "@/lib/actions/auth";
import { SITE_NAME_BN } from "@/lib/site";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "হোম" },
  { href: "/jobs", label: "টিউশন খুঁজুন" },
  { href: "/tutors", label: "টিউটর" },
  { href: "/post-tuition", label: "টিউশন পোস্ট করুন" },
  { href: "/how-it-works", label: "কীভাবে কাজ করে" },
];

export async function SiteHeader() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-lg font-bold text-white">
            টি
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-bold text-stone-900">
              {SITE_NAME_BN}
            </span>
            <span className="block text-[11px] font-medium text-emerald-700">
              সম্পূর্ণ ফ্রি — কোনো কমিশন নেই
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link
                href={isAdmin ? "/admin" : "/dashboard"}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              >
                {isAdmin ? "অ্যাডমিন" : "ড্যাশবোর্ড"}
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
                >
                  লগ আউট
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50"
              >
                লগ ইন
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700"
              >
                টিউটর রেজিস্টার
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="border-t border-stone-100">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap px-3 py-2.5 text-sm font-semibold text-stone-600 hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
