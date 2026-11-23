"use client";

import { checkboxClass, inputClass, labelClass } from "@/components/ui";
import { CLASSES, SUBJECTS, DISTRICTS } from "@/lib/site";
import { getUpazilas } from "@/lib/upazilas";
import Link from "next/link";
import { useState } from "react";

export interface TutorFilterValues {
  district?: string;
  upazila?: string;
  className?: string;
  subject?: string;
  verified?: string;
}

// Plain GET form — works without JavaScript and keeps filters in the URL.
export function TutorFilters({ values }: { values: TutorFilterValues }) {
  const [selectedDistrict, setSelectedDistrict] = useState(values.district ?? "");
  const upazilas = getUpazilas(selectedDistrict);
  return (
    <form
      method="get"
      action="/tutors"
      className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor="district" className={labelClass}>
            জেলা
          </label>
          <select
            id="district"
            name="district"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className={inputClass}
          >
            <option value="">সব জেলা</option>
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
            defaultValue={values.upazila ?? ""}
            disabled={!selectedDistrict}
            className={inputClass}
          >
            <option value="">
              {selectedDistrict ? "সব উপজেলা" : "প্রথমে জেলা বেছে নিন"}
            </option>
            {upazilas.map((upz) => (
              <option key={upz} value={upz}>
                {upz}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="className" className={labelClass}>
            শ্রেণি
          </label>
          <select
            id="className"
            name="className"
            defaultValue={values.className ?? ""}
            className={inputClass}
          >
            <option value="">সব শ্রেণি</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="subject" className={labelClass}>
            বিষয়
          </label>
          <select
            id="subject"
            name="subject"
            defaultValue={values.subject ?? ""}
            className={inputClass}
          >
            <option value="">সব বিষয়</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 px-3 py-2.5 text-sm font-semibold text-stone-700">
            <input
              type="checkbox"
              name="verified"
              value="1"
              defaultChecked={values.verified === "1"}
              className={checkboxClass}
            />
            শুধু যাচাইকৃত
          </label>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700"
          >
            খুঁজুন
          </button>
          <Link
            href="/tutors"
            className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-50"
          >
            সব দেখুন
          </Link>
        </div>
      </div>
    </form>
  );
}
