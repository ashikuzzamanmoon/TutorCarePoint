"use server";

import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { CLASSES, SUBJECTS, DISTRICT_KEYS } from "@/lib/site";
import { normalizePhone } from "@/lib/utils";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "./auth";

const profileSchema = z.object({
  displayName: z.string().min(2, "নাম দিন"),
  phone: z
    .string()
    .min(1, "মোবাইল নম্বর দিন")
    .refine(
      (v) => /^01[3-9]\d{8}$/.test(normalizePhone(v)),
      "সঠিক মোবাইল নম্বর দিন (যেমন: 01712-345678)",
    ),
  district: z.string().refine((v) => DISTRICT_KEYS.includes(v), "জেলা বেছে নিন"),
  upazila: z.string().max(100).optional(),
  area: z.string().max(100).optional(),
  gender: z.enum(["MALE", "FEMALE", "ANY"]),
  educationLevel: z.string().min(2, "শিক্ষাগত যোগ্যতা লিখুন"),
  institution: z.string().max(150).optional(),
  subjects: z.array(z.string()).refine(
    (arr) => arr.every((s) => SUBJECTS.includes(s)),
    "বিষয় বেছে নিন",
  ),
  classes: z.array(z.string()).refine(
    (arr) => arr.every((c) => CLASSES.includes(c)),
    "শ্রেণি বেছে নিন",
  ),
  mediums: z
    .array(z.enum(["BANGLA", "ENGLISH_MEDIUM", "ENGLISH_VERSION", "MADRASA"]))
    .min(1, "কমপক্ষে একটি মাধ্যম বেছে নিন"),
  expectedSalary: z.number().int().min(0).max(100000).nullable(),
  daysPerWeek: z.number().int().min(1).max(7).nullable(),
  experienceYears: z.number().int().min(0).max(40),
  bio: z.string().max(1000).optional(),
});

/** Create or update the signed-in tutor's profile. */
export async function updateProfile(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();

  const num = (key: string): number | null => {
    const raw = formData.get(key);
    if (raw == null || raw === "") return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  };

  const parsed = profileSchema.safeParse({
    displayName: formData.get("displayName"),
    phone: formData.get("phone"),
    district: formData.get("district"),
    upazila: formData.get("upazila") || undefined,
    area: formData.get("area") || undefined,
    gender: formData.get("gender"),
    educationLevel: formData.get("educationLevel"),
    institution: formData.get("institution") || undefined,
    subjects: formData.getAll("subjects"),
    classes: formData.getAll("classes"),
    mediums: formData.getAll("mediums"),
    expectedSalary: num("expectedSalary"),
    daysPerWeek: num("daysPerWeek"),
    experienceYears: num("experienceYears") ?? 0,
    bio: formData.get("bio") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "তথ্য যাচাই করুন" };
  }
  const data = parsed.data;
  const phone = normalizePhone(data.phone);

  // Check if another tutor already uses this phone number
  const existingPhone = await prisma.tutorProfile.findFirst({
    where: {
      phone,
      NOT: { userId: user.id },
    },
  });
  if (existingPhone) {
    return {
      ok: false,
      error: "এই মোবাইল নম্বরটি ইতিমধ্যে অন্য একটি টিউটর প্রোফাইলে ব্যবহার করা হচ্ছে।",
    };
  }

  const profile = await prisma.tutorProfile.upsert({
    where: { userId: user.id },
    update: {
      displayName: data.displayName,
      phone,
      district: data.district,
      upazila: data.upazila ?? null,
      area: data.area ?? null,
      gender: data.gender,
      educationLevel: data.educationLevel,
      institution: data.institution ?? null,
      subjects: data.subjects,
      classes: data.classes,
      mediums: data.mediums,
      expectedSalary: data.expectedSalary,
      daysPerWeek: data.daysPerWeek,
      experienceYears: data.experienceYears,
      bio: data.bio ?? null,
    },
    create: {
      userId: user.id,
      displayName: data.displayName,
      phone,
      district: data.district,
      upazila: data.upazila ?? null,
      area: data.area ?? null,
      gender: data.gender,
      educationLevel: data.educationLevel,
      institution: data.institution ?? null,
      subjects: data.subjects,
      classes: data.classes,
      mediums: data.mediums,
      expectedSalary: data.expectedSalary,
      daysPerWeek: data.daysPerWeek,
      experienceYears: data.experienceYears,
      bio: data.bio ?? null,
    },
  });

  updateTag("tutors");
  updateTag(`tutor-${profile.id}`);
  revalidatePath("/dashboard");
  revalidatePath("/tutors");
  return { ok: true };
}
