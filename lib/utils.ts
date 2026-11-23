import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { JOB_EXPIRY_DAYS } from "@/lib/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a BDT amount with Bengali digits, e.g. ৳৩,০০০ */
export function formatSalary(amount: number | null | undefined): string {
  if (amount == null) return "আলোচনা সাপেক্ষে";
  return `৳${amount.toLocaleString("bn-BD")}`;
}

/** Format a date in Bengali, e.g. ২২ নভেম্বর ২০২৬ */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Short relative time in Bengali, e.g. "আজ", "গতকাল", "৩ দিন আগে" */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return "আজ";
  if (diffDays === 1) return "গতকাল";
  if (diffDays < 30) return `${diffDays.toLocaleString("bn-BD")} দিন আগে`;
  const months = Math.floor(diffDays / 30);
  return `${months.toLocaleString("bn-BD")} মাস আগে`;
}

/** Initials avatar text from a Bengali/English name (first letter). */
export function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  // First grapheme — works for Bengali letters too.
  return [...trimmed][0];
}

/** The earliest publishedAt a job may have and still be shown publicly. */
export function expiryCutoff(): Date {
  return new Date(Date.now() - JOB_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
}

/** True when an OPEN job is past its public shelf life. */
export function isJobExpired(publishedAt: Date | string | null): boolean {
  if (!publishedAt) return false;
  const d = typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
  return d.getTime() < expiryCutoff().getTime();
}

/** Normalize a Bangladeshi phone number for display (digits only, 01XXXXXXXXX). */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("880")) return `0${digits.slice(3)}`;
  return digits;
}
