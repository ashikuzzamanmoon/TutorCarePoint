"use client";

import { CheckboxGroup } from "@/components/auth-forms";
import { SubmitButton } from "@/components/submit-button";
import { inputClass, labelClass } from "@/components/ui";
import type { ActionResult } from "@/lib/actions/auth";
import { updateProfile } from "@/lib/actions/profile";
import {
  CLASSES,
  GENDERS,
  GENDER_LABELS,
  MEDIUMS,
  MEDIUM_LABELS,
  SUBJECTS,
  DISTRICTS,
} from "@/lib/site";
import { showErrorAlert, showSuccessAlert } from "@/lib/alerts";
import type { TutorProfile } from "@prisma/client";
import { useActionState, useEffect } from "react";

const initialState: ActionResult = { ok: false };

export function ProfileForm({ profile }: { profile: TutorProfile | null }) {
  const [state, action] = useActionState(updateProfile, initialState);

  useEffect(() => {
    if (state.error) {
      showErrorAlert(state.error);
    } else if (state.ok) {
      showSuccessAlert(
        "সংরক্ষিত হয়েছে!",
        "আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।",
      );
    }
  }, [state.error, state.ok]);

  return (
    <form action={action} className="space-y-5">
      {state.ok ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800">
          প্রোফাইল সংরক্ষিত হয়েছে।
        </p>
      ) : null}
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="displayName" className={labelClass}>
            পুরো নাম
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            defaultValue={profile?.displayName ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            মোবাইল নম্বর
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue={profile?.phone ?? ""}
            placeholder="01712-345678"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="district" className={labelClass}>
            জেলা
          </label>
          <select
            id="district"
            name="district"
            required
            defaultValue={profile?.district ?? ""}
            className={inputClass}
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
          <label htmlFor="area" className={labelClass}>
            এলাকা / উপজেলা (ঐচ্ছিক)
          </label>
          <input
            id="area"
            name="area"
            type="text"
            defaultValue={profile?.area ?? ""}
            placeholder="যেমন: কাজিপুর, মুজিব সড়ক"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="gender" className={labelClass}>
            লিঙ্গ
          </label>
          <select
            id="gender"
            name="gender"
            required
            defaultValue={profile?.gender ?? "ANY"}
            className={inputClass}
          >
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {GENDER_LABELS[g]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="educationLevel" className={labelClass}>
            শিক্ষাগত যোগ্যতা
          </label>
          <input
            id="educationLevel"
            name="educationLevel"
            type="text"
            required
            defaultValue={profile?.educationLevel ?? ""}
            placeholder="যেমন: অনার্স ৩য় বর্ষ"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="institution" className={labelClass}>
            প্রতিষ্ঠান (ঐচ্ছিক)
          </label>
          <input
            id="institution"
            name="institution"
            type="text"
            defaultValue={profile?.institution ?? ""}
            placeholder="যেমন: সরকারি কলেজ, সিরাজগঞ্জ"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="experienceYears" className={labelClass}>
            পড়ানোর অভিজ্ঞতা (বছর)
          </label>
          <input
            id="experienceYears"
            name="experienceYears"
            type="number"
            min={0}
            max={40}
            inputMode="numeric"
            defaultValue={profile?.experienceYears ?? 0}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="expectedSalary" className={labelClass}>
            প্রত্যাশিত বেতন/মাস (৳, ঐচ্ছিক)
          </label>
          <input
            id="expectedSalary"
            name="expectedSalary"
            type="number"
            min={0}
            inputMode="numeric"
            defaultValue={profile?.expectedSalary ?? ""}
            placeholder="খালি রাখলে 'আলোচনা সাপেক্ষে' দেখাবে"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="daysPerWeek" className={labelClass}>
            সপ্তাহে কত দিন পড়াতে পারবেন (ঐচ্ছিক)
          </label>
          <input
            id="daysPerWeek"
            name="daysPerWeek"
            type="number"
            min={1}
            max={7}
            inputMode="numeric"
            defaultValue={profile?.daysPerWeek ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <CheckboxGroup
        name="subjects"
        legend="যেসব বিষয় পড়াতে পারবেন"
        options={SUBJECTS}
        defaultChecked={profile?.subjects ?? []}
      />
      <CheckboxGroup
        name="classes"
        legend="যেসব শ্রেণি পড়াতে পারবেন"
        options={CLASSES}
        defaultChecked={profile?.classes ?? []}
      />

      <fieldset>
        <legend className={labelClass}>মাধ্যম</legend>
        <div className="flex flex-wrap gap-2">
          {MEDIUMS.map((m) => (
            <label
              key={m}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 has-checked:border-emerald-600 has-checked:bg-emerald-50 has-checked:text-emerald-800"
            >
              <input
                type="checkbox"
                name="mediums"
                value={m}
                defaultChecked={(profile?.mediums ?? []).includes(m)}
                className="h-4 w-4 shrink-0 accent-emerald-600"
              />
              {MEDIUM_LABELS[m]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="bio" className={labelClass}>
          নিজের সম্পর্কে (ঐচ্ছিক)
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={1000}
          defaultValue={profile?.bio ?? ""}
          placeholder="পড়ানোর ধরন, বিশেষত্ব — সংক্ষেপে লিখুন"
          className={inputClass}
        />
      </div>

      <p className="text-sm text-stone-500">
        বিষয় ও শ্রেণি বেছে নিলে আপনার প্রোফাইল টিউটর তালিকায় দেখা যাবে।
        মোবাইল নম্বর কখনো প্রকাশ্যে দেখানো হয় না।
      </p>

      <SubmitButton pendingText="সংরক্ষণ হচ্ছে...">
        প্রোফাইল সংরক্ষণ করুন
      </SubmitButton>
    </form>
  );
}
