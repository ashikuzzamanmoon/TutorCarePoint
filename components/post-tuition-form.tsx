"use client";

import { CheckboxGroup } from "@/components/auth-forms";
import { SubmitButton } from "@/components/submit-button";
import { inputClass, labelClass } from "@/components/ui";
import type { ActionResult } from "@/lib/actions/auth";
import { submitJob } from "@/lib/actions/jobs";
import {
  CLASSES,
  GENDERS,
  GENDER_LABELS,
  MEDIUMS,
  MEDIUM_LABELS,
  SUBJECTS,
  DISTRICTS,
} from "@/lib/site";
import { getUpazilas } from "@/lib/upazilas";
import { useActionState, useState } from "react";
import Link from "next/link";

const initialState: ActionResult = { ok: false };

export function PostTuitionForm() {
  const [state, action] = useActionState(submitJob, initialState);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const upazilas = getUpazilas(selectedDistrict);

  if (state.ok) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-bold text-emerald-800">
          আপনার টিউশনের চাহিদা জমা হয়েছে!
        </p>
        <p className="mt-2 text-stone-600">
          আমরা ফোনে যাচাই করে আপনার পোস্টটি প্রকাশ করবো। যাচাই শেষ হলে
          টিউটররা আবেদন করতে পারবে, আর উপযুক্ত টিউটর পেলে আমরা আপনাদের
          যোগাযোগ করিয়ে দেবো — সম্পূর্ণ ফ্রি।
        </p>
        <Link
          href="/jobs"
          className="mt-5 inline-block rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
        >
          টিউশন তালিকা দেখুন
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="guardianName" className={labelClass}>
            অভিভাবকের নাম
          </label>
          <input
            id="guardianName"
            name="guardianName"
            type="text"
            required
            placeholder="যেমন: আব্দুল করিম"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="guardianPhone" className={labelClass}>
            মোবাইল নম্বর
          </label>
          <input
            id="guardianPhone"
            name="guardianPhone"
            type="tel"
            required
            placeholder="01712-345678"
            className={inputClass}
          />
          <p className="mt-1 text-xs text-stone-500">
            নম্বরটি প্রকাশ্যে দেখানো হয় না — শুধু যাচাই ও যোগাযোগের জন্য
            ব্যবহৃত হয়।
          </p>
        </div>
        <div>
          <label htmlFor="className" className={labelClass}>
            শ্রেণি
          </label>
          <select id="className" name="className" required className={inputClass} defaultValue="">
            <option value="" disabled>
              বেছে নিন
            </option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="medium" className={labelClass}>
            মাধ্যম
          </label>
          <select id="medium" name="medium" required className={inputClass} defaultValue="BANGLA">
            {MEDIUMS.map((m) => (
              <option key={m} value={m}>
                {MEDIUM_LABELS[m]}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="district" className={labelClass}>
              জেলা
            </label>
            <select
              id="district"
              name="district"
              required
              className={inputClass}
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="" disabled>
                বেছে নিন
              </option>
              {DISTRICTS.map((u) => (
                <option key={u.key} value={u.key}>
                  {u.bn}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="upazila" className={labelClass}>
              উপজেলা
            </label>
            <select
              id="upazila"
              name="upazila"
              className={inputClass}
              defaultValue=""
              disabled={!selectedDistrict}
            >
              <option value="">
                {selectedDistrict ? "উপজেলা বেছে নিন" : "প্রথমে জেলা বেছে নিন"}
              </option>
              {upazilas.map((upz) => (
                <option key={upz} value={upz}>
                  {upz}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="area" className={labelClass}>
              এলাকা (ঐচ্ছিক)
            </label>
            <input
              id="area"
              name="area"
              type="text"
              placeholder="যেমন: পাড়া/মহল্লা, রোড নম্বর"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="salary" className={labelClass}>
            মাসিক বেতন (৳)
          </label>
          <input
            id="salary"
            name="salary"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="যেমন: ৩০০০"
            className={inputClass}
          />
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-stone-600">
            <input
              type="checkbox"
              name="salaryNegotiable"
              className="h-4 w-4 accent-emerald-600"
            />
            বেতন আলোচনা সাপেক্ষে
          </label>
        </div>
        <div>
          <label htmlFor="daysPerWeek" className={labelClass}>
            সপ্তাহে কত দিন
          </label>
          <select id="daysPerWeek" name="daysPerWeek" required className={inputClass} defaultValue="5">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <option key={d} value={d}>
                {d.toLocaleString("bn-BD")} দিন
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tutorGenderPreference" className={labelClass}>
            টিউটরের লিঙ্গ
          </label>
          <select
            id="tutorGenderPreference"
            name="tutorGenderPreference"
            required
            className={inputClass}
            defaultValue="ANY"
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {GENDER_LABELS[g]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <CheckboxGroup
        name="subjects"
        legend="যেসব বিষয় পড়াতে হবে"
        options={SUBJECTS}
      />

      <div>
        <label htmlFor="notes" className={labelClass}>
          অতিরিক্ত তথ্য (ঐচ্ছিক)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          maxLength={1000}
          placeholder="যেমন: সন্ধ্যায় পড়াতে হবে, ছাত্র দুর্বল — ধৈর্য নিয়ে পড়াতে হবে"
          className={inputClass}
        />
      </div>

      <SubmitButton pendingText="জমা হচ্ছে...">পোস্ট জমা দিন</SubmitButton>
      <p className="text-xs text-stone-500">
        পোস্ট করতে কোনো অ্যাকাউন্ট লাগে না, কোনো টাকা লাগে না। জমা দেওয়ার পর
        আমরা ফোনে যাচাই করে পোস্টটি প্রকাশ করবো।
      </p>
    </form>
  );
}
