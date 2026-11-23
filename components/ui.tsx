import type { ApplicationStatus, JobStatus } from "@prisma/client";
import {
  APPLICATION_STATUS_LABELS,
  JOB_STATUS_LABELS,
} from "@/lib/site";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

// Shared form styles (Tailwind v4).
export const inputClass =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20";

export const labelClass =
  "mb-1.5 block text-sm font-semibold text-stone-700";

export const checkboxClass =
  "h-4 w-4 shrink-0 accent-emerald-600";

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200 bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "green" | "amber" | "red" | "blue" | "stone";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-stone-100 text-stone-700",
    green: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-sky-100 text-sky-800",
    stone: "bg-stone-200 text-stone-600",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const JOB_STATUS_TONES: Record<JobStatus, "green" | "amber" | "stone" | "red"> = {
  OPEN: "green",
  PENDING_REVIEW: "amber",
  FILLED: "stone",
  EXPIRED: "stone",
  CANCELLED: "red",
};

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return (
    <Badge tone={JOB_STATUS_TONES[status]}>{JOB_STATUS_LABELS[status]}</Badge>
  );
}

const APPLICATION_STATUS_TONES: Record<
  ApplicationStatus,
  "blue" | "amber" | "green" | "stone" | "red"
> = {
  APPLIED: "blue",
  SHORTLISTED: "amber",
  DEMO: "amber",
  CONFIRMED: "green",
  COMPLETED: "green",
  CANCELLED: "red",
};

export function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  return (
    <Badge tone={APPLICATION_STATUS_TONES[status]}>
      {APPLICATION_STATUS_LABELS[status]}
    </Badge>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="px-6 py-12 text-center">
      <p className="text-lg font-bold text-stone-800">{title}</p>
      {body ? <p className="mt-2 text-stone-500">{body}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-stone-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-stone-500">{subtitle}</p> : null}
    </div>
  );
}
