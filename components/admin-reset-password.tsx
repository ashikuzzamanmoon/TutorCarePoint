"use client";

import { resetUserPassword } from "@/lib/actions/admin";
import { useState, useTransition } from "react";

export function AdminResetPasswordModal({
  userId,
  userEmail,
  userName,
}: {
  userId: string;
  userEmail: string;
  userName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ ok?: boolean; message?: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    setPassword(`Tutor!${randomDigits}`);
    setStatus(null);
  };

  const handleReset = () => {
    if (!password || password.length < 6) {
      setStatus({ ok: false, message: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।" });
      return;
    }
    startTransition(async () => {
      const res = await resetUserPassword(userId, password);
      if (res.ok) {
        setStatus({
          ok: true,
          message: `সফলভাবে পরিবর্তন হয়েছে! নতুন পাসওয়ার্ড: ${password}`,
        });
      } else {
        setStatus({ ok: false, message: res.error ?? "ব্যর্থ হয়েছে।" });
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setStatus(null);
          setPassword("");
        }}
        className="cursor-pointer rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-700 transition hover:bg-stone-50"
      >
        🔑 পাসওয়ার্ড রিসেট
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900">
              পাসওয়ার্ড রিসেট করুন
            </h3>
            <p className="mt-1 text-sm text-stone-600">
              <span className="font-semibold text-stone-900">{userName}</span> (
              {userEmail})-এর জন্য নতুন পাসওয়ার্ড সেট করুন।
            </p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-700">
                  নতুন পাসওয়ার্ড
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setStatus(null);
                    }}
                    placeholder="যেমন: Tutor1234!"
                    className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="cursor-pointer whitespace-nowrap rounded-lg border border-stone-300 bg-stone-100 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:bg-stone-200"
                    title="স্বয়ংক্রিয় পাসওয়ার্ড তৈরি"
                  >
                    তৈরি করুন
                  </button>
                </div>
              </div>

              {status ? (
                <div
                  className={`rounded-lg p-3 text-xs font-semibold ${
                    status.ok
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {status.message}
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-50"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isPending}
                className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {isPending ? "সেভ হচ্ছে..." : "সংরক্ষণ করুন"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
