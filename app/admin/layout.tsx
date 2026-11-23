import { requireAdmin } from "@/lib/auth-helpers";
import Link from "next/link";

const ADMIN_LINKS = [
  { href: "/admin", label: "সংক্ষিপ্ত বিবরণ" },
  { href: "/admin/jobs", label: "টিউশন" },
  { href: "/admin/tutors", label: "টিউটর" },
  { href: "/admin/applications", label: "আবেদন" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-900">অ্যাডমিন প্যানেল</h1>
        <Link
          href="/"
          className="text-sm font-bold text-emerald-700 hover:underline"
        >
          ← সাইটে ফিরুন
        </Link>
      </div>
      <nav className="mb-8 flex flex-wrap gap-1 border-b border-stone-200">
        {ADMIN_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-t-lg px-4 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
