"use client";

import {
  requestPasswordReset,
  resetPasswordWithToken,
  type PasswordResetResult,
} from "@/lib/actions/password-reset";
import { SubmitButton } from "@/components/submit-button";
import { inputClass, labelClass } from "@/components/ui";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";

const initialState: PasswordResetResult = { ok: false };

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className={labelClass}>
          ইমেইল ঠিকানা
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

      {state.error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.ok && state.message ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
          {state.message}
        </div>
      ) : null}

      <SubmitButton className="w-full" pendingText="লিংক পাঠানো হচ্ছে...">
        রিসেট লিংক পাঠান
      </SubmitButton>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useActionState(resetPasswordWithToken, initialState);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.ok) {
      router.push("/login?reset=1");
    }
  }, [state.ok, router]);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="password" className={labelClass}>
          নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
            placeholder="নতুন পাসওয়ার্ড দিন"
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

      <div>
        <label htmlFor="confirmPassword" className={labelClass}>
          পাসওয়ার্ড নিশ্চিত করুন
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="পুনরায় নতুন পাসওয়ার্ড দিন"
          className={inputClass}
        />
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton className="w-full" pendingText="সংরক্ষণ হচ্ছে...">
        নতুন পাসওয়ার্ড সংরক্ষণ করুন
      </SubmitButton>
    </form>
  );
}
