"use client";

import { SubmitButton } from "@/components/submit-button";
import { inputClass, labelClass } from "@/components/ui";
import type { ActionResult } from "@/lib/actions/auth";
import { applyToJob } from "@/lib/actions/jobs";
import { useActionState } from "react";
import Link from "next/link";

const initialState: ActionResult = { ok: false };

export function ApplyForm({ jobId }: { jobId: string }) {
  const [state, action] = useActionState(
    applyToJob.bind(null, jobId),
    initialState,
  );

  if (state.ok) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="font-bold text-emerald-800">আবেদন জমা হয়েছে!</p>
        <p className="mt-1 text-sm text-stone-600">
          শর্টলিস্ট হলে আমরা আপনাকে জানাবো। আবেদনের অবস্থা ড্যাশবোর্ডে দেখতে
          পারবেন।
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
        >
          ড্যাশবোর্ড দেখুন
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="note" className={labelClass}>
          অভিভাবকের জন্য বার্তা (ঐচ্ছিক)
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          maxLength={500}
          placeholder="নিজের সম্পর্কে সংক্ষেপে লিখুন — অভিজ্ঞতা, পড়ানোর ধরন"
          className={inputClass}
        />
      </div>
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}
      <SubmitButton className="w-full" pendingText="আবেদন জমা হচ্ছে...">
        এই টিউশনে আবেদন করুন
      </SubmitButton>
    </form>
  );
}
