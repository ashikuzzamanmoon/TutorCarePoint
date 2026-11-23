import {
  approveJob,
  rejectJob,
  setApplicationStatus,
  setJobStatus,
  toggleTutorPublished,
  toggleTutorVerified,
} from "@/lib/actions/admin";
import { APPLICATION_PIPELINE, APPLICATION_STATUS_LABELS } from "@/lib/site";
import type { ApplicationStatus, JobStatus } from "@prisma/client";

// Server-action forms — no client JavaScript needed.

export function JobReviewActions({ jobId }: { jobId: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <form
        action={async () => {
          "use server";
          await approveJob(jobId);
        }}
      >
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
        >
          যাচাই করে প্রকাশ করুন
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await rejectJob(jobId);
        }}
      >
        <button
          type="submit"
          className="rounded-lg border border-red-300 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50"
        >
          বাতিল করুন
        </button>
      </form>
    </div>
  );
}

const JOB_STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "OPEN", label: "আবেদন চলছে (আবার প্রকাশ)" },
  { value: "FILLED", label: "নিয়োগ সম্পন্ন" },
  { value: "EXPIRED", label: "মেয়াদ শেষ" },
  { value: "CANCELLED", label: "বাতিল" },
];

export function JobStatusForm({
  jobId,
  current,
}: {
  jobId: string;
  current: JobStatus;
}) {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        const status = formData.get("status") as JobStatus;
        if (status) await setJobStatus(jobId, status);
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <select
        name="status"
        defaultValue={current}
        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-800"
      >
        {JOB_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-bold text-white hover:bg-stone-900"
      >
        অবস্থা বদলান
      </button>
    </form>
  );
}

export function ApplicationStatusForm({
  applicationId,
  current,
}: {
  applicationId: string;
  current: ApplicationStatus;
}) {
  return (
    <form
      action={async (formData: FormData) => {
        "use server";
        const status = formData.get("status") as ApplicationStatus;
        if (status) await setApplicationStatus(applicationId, status);
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <select
        name="status"
        defaultValue={current}
        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-800"
      >
        {APPLICATION_PIPELINE.map((status) => (
          <option key={status} value={status}>
            {APPLICATION_STATUS_LABELS[status]}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-bold text-white hover:bg-stone-900"
      >
        সংরক্ষণ করুন
      </button>
    </form>
  );
}

export function TutorVerifyToggle({
  tutorId,
  isVerified,
}: {
  tutorId: string;
  isVerified: boolean;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await toggleTutorVerified(tutorId);
      }}
    >
      <button
        type="submit"
        className={
          isVerified
            ? "rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-bold text-stone-700 hover:bg-stone-50"
            : "rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-bold text-white hover:bg-emerald-700"
        }
      >
        {isVerified ? "যাচাই বাতিল" : "যাচাই করুন"}
      </button>
    </form>
  );
}

export function TutorPublishToggle({
  tutorId,
  isPublished,
}: {
  tutorId: string;
  isPublished: boolean;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await toggleTutorPublished(tutorId);
      }}
    >
      <button
        type="submit"
        className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-bold text-stone-700 hover:bg-stone-50"
      >
        {isPublished ? "তালিকা থেকে লুকান" : "তালিকায় দেখান"}
      </button>
    </form>
  );
}
