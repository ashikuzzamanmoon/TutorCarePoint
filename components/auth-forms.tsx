"use client";

import { loginTutor, registerTutor, type ActionResult } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { checkboxClass, inputClass, labelClass } from "@/components/ui";
import { GENDERS, GENDER_LABELS, DISTRICTS } from "@/lib/site";
import { useActionState, useState } from "react";

const initialState: ActionResult = { ok: false };

function FormError({ state }: { state: ActionResult }) {
  if (state.ok || !state.error) return null;
  return (
    <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
      {state.error}
    </p>
  );
}

function PasswordInput({
  id = "password",
  name = "password",
  label = "পাসওয়ার্ড",
  autoComplete = "current-password",
  minLength,
  required = true,
}: {
  id?: string;
  name?: string;
  label?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          className={`${inputClass} pr-11`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 transition hover:text-stone-600 focus:outline-none"
          aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
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
      <PasswordInput
        id="password"
        name="password"
        label="পাসওয়ার্ড"
        autoComplete="current-password"
      />
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
      <PasswordInput
        id="password"
        name="password"
        label="পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)"
        minLength={8}
        autoComplete="new-password"
      />
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
