"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizePhone } from "@/lib/utils";
import { DISTRICT_KEYS } from "@/lib/site";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const phoneField = z
  .string()
  .min(1, "মোবাইল নম্বর দিন")
  .refine(
    (v) => /^01[3-9]\d{8}$/.test(normalizePhone(v)),
    "সঠিক মোবাইল নম্বর দিন (যেমন: 01712-345678)",
  );

const registerSchema = z.object({
  name: z.string().min(2, "নাম দিন"),
  email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"),
  phone: phoneField,
  district: z.string().refine((v) => DISTRICT_KEYS.includes(v), "জেলা বেছে নিন"),
  gender: z.enum(["MALE", "FEMALE", "ANY"]),
  educationLevel: z.string().min(2, "শিক্ষাগত যোগ্যতা লিখুন (যেমন: অনার্স ৩য় বর্ষ)"),
});

/** Create a tutor account + minimal profile, then send them to log in. */
export async function registerTutor(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    district: formData.get("district"),
    gender: formData.get("gender"),
    educationLevel: formData.get("educationLevel"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "তথ্য যাচাই করুন" };
  }
  const data = parsed.data;
  const email = data.email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে। লগ ইন করুন।" };
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  await prisma.user.create({
    data: {
      name: data.name,
      email,
      passwordHash,
      role: "TUTOR",
      tutorProfile: {
        create: {
          displayName: data.name,
          phone: normalizePhone(data.phone),
          district: data.district,
          gender: data.gender,
          educationLevel: data.educationLevel,
        },
      },
    },
  });

  redirect("/login?registered=1");
}

const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

/** Sign in with email + password. Admins land on /admin via the dashboard. */
export async function loginTutor(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "তথ্য যাচাই করুন" };
  }
  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "ইমেইল বা পাসওয়ার্ড ভুল। আবার চেষ্টা করুন।" };
    }
    throw error; // NEXT_REDIRECT — let it through.
  }
  return { ok: true };
}

/** Sign out and return to the home page. */
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

/** Sign in with Google OAuth. */
export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}
