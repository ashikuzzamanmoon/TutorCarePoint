"use client";

import { loginTutor, registerTutor, type ActionResult } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { checkboxClass, inputClass, labelClass } from "@/components/ui";
import { GENDERS, GENDER_LABELS, DISTRICTS } from "@/lib/site";
import { useActionState } from "react";

const initialState: ActionResult = { ok: false };

function FormError({ state }: { state: ActionResult }) {
  if (state.ok || !state.error) return null;
  return (
    <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
      {state.error}
    </p>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(loginTutor, initialState);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className={labelClass}>
          ইমেইল
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          পাসওয়ার্ড
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>
      <FormError state={state} />
      <SubmitButton className="w-full">লগ ইন</SubmitButton>
    </form>
  );
}

export function RegisterForm() {
  const [state, action] = useActionState(registerTutor, initialState);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelClass}>
          পুরো নাম
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="যেমন: রহিম উদ্দিন"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>
          ইমেইল
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="password" className={labelClass}>
          পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
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
          autoComplete="tel"
          placeholder="01712-345678"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-stone-500">
          নম্বরটি প্রকাশ্যে দেখানো হয় না — শুধু কনফার্ম হওয়ার পর অভিভাবককে
          দেওয়া হয়।
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="district" className={labelClass}>
            জেলা
          </label>
          <select id="district" name="district" required className={inputClass} defaultValue="">
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
          <label htmlFor="gender" className={labelClass}>
            লিঙ্গ
          </label>
          <select id="gender" name="gender" required className={inputClass} defaultValue="ANY">
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {GENDER_LABELS[g]}
              </option>
            ))}
          </select>
        </div>
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
          placeholder="যেমন: অনার্স ৩য় বর্ষ, বিএসসি সম্পন্ন"
          className={inputClass}
        />
      </div>
      <FormError state={state} />
      <SubmitButton className="w-full" pendingText="অ্যাকাউন্ট তৈরি হচ্ছে...">
        রেজিস্টার করুন
      </SubmitButton>
      <p className="text-xs text-stone-500">
        রেজিস্টার করার পর ড্যাশবোর্ড থেকে বিষয়, শ্রেণি ও বেতনসহ পুরো প্রোফাইল
        সম্পন্ন করতে পারবেন।
      </p>
    </form>
  );
}

export function CheckboxGroup({
  name,
  legend,
  options,
  defaultChecked = [],
}: {
  name: string;
  legend: string;
  options: string[];
  defaultChecked?: string[];
}) {
  return (
    <fieldset>
      <legend className={labelClass}>{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 has-checked:border-emerald-600 has-checked:bg-emerald-50 has-checked:text-emerald-800"
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              defaultChecked={defaultChecked.includes(option)}
              className={checkboxClass}
            />
            {option}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
