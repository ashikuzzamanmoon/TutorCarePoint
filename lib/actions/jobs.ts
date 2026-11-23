"use server";

import { requireTutorProfile } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import {
  CLASSES,
  SUBJECTS,
  DISTRICT_KEYS,
  districtName,
} from "@/lib/site";
import { expiryCutoff, normalizePhone } from "@/lib/utils";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "./auth";

const submitJobSchema = z.object({
  guardianName: z.string().min(2, "অভিভাবকের নাম দিন"),
  guardianPhone: z
    .string()
    .min(1, "মোবাইল নম্বর দিন")
    .refine(
      (v) => /^01[3-9]\d{8}$/.test(normalizePhone(v)),
      "সঠিক মোবাইল নম্বর দিন (যেমন: 01712-345678)",
    ),
  className: z.string().refine((v) => CLASSES.includes(v), "শ্রেণি বেছে নিন"),
  subjects: z
    .array(z.string())
    .min(1, "কমপক্ষে একটি বিষয় বেছে নিন")
    .refine((arr) => arr.every((s) => SUBJECTS.includes(s)), "বিষয় বেছে নিন"),
  medium: z.enum(["BANGLA", "ENGLISH_MEDIUM", "ENGLISH_VERSION", "MADRASA"]),
  district: z.string().refine((v) => DISTRICT_KEYS.includes(v), "জেলা বেছে নিন"),
  area: z.string().max(100).optional(),
  salary: z.number().int().min(0).max(100000).nullable(),
  salaryNegotiable: z.boolean(),
  daysPerWeek: z.number().int().min(1).max(7),
  tutorGenderPreference: z.enum(["MALE", "FEMALE", "ANY"]),
  notes: z.string().max(1000).optional(),
});

/**
 * Public guardian form — no login required. The job is created as
 * PENDING_REVIEW; an admin verifies it by phone, then publishes it.
 */
export async function submitJob(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const salaryRaw = formData.get("salary");
  const salary =
    salaryRaw == null || salaryRaw === "" ? null : Number(salaryRaw);

  const parsed = submitJobSchema.safeParse({
    guardianName: formData.get("guardianName"),
    guardianPhone: formData.get("guardianPhone"),
    className: formData.get("className"),
    subjects: formData.getAll("subjects"),
    medium: formData.get("medium"),
    district: formData.get("district"),
    area: formData.get("area") || undefined,
    salary: Number.isFinite(salary) ? salary : null,
    salaryNegotiable: formData.get("salaryNegotiable") === "on",
    daysPerWeek: Number(formData.get("daysPerWeek") ?? 5),
    tutorGenderPreference: formData.get("tutorGenderPreference"),
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "তথ্য যাচাই করুন" };
  }
  const data = parsed.data;

  const title = `${data.className} — ${data.subjects.join(", ")} (${districtName(data.district)})`;

  await prisma.job.create({
    data: {
      guardianName: data.guardianName,
      guardianPhone: normalizePhone(data.guardianPhone),
      title,
      className: data.className,
      subjects: data.subjects,
      medium: data.medium,
      district: data.district,
      area: data.area ?? null,
      salary: data.salaryNegotiable ? null : data.salary,
      salaryNegotiable: data.salaryNegotiable,
      daysPerWeek: data.daysPerWeek,
      tutorGenderPreference: data.tutorGenderPreference,
      notes: data.notes ?? null,
      status: "PENDING_REVIEW",
    },
  });

  updateTag("jobs");
  return { ok: true };
}

/** A signed-in tutor applies to an OPEN, unexpired job (once per job). */
export async function applyToJob(
  jobId: string,
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const { profile } = await requireTutorProfile();

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "OPEN") {
    return { ok: false, error: "এই টিউশনে এখন আবেদন করা যাচ্ছে না।" };
  }
  if (job.publishedAt && job.publishedAt < expiryCutoff()) {
    return { ok: false, error: "এই টিউশনের মেয়াদ শেষ হয়ে গেছে।" };
  }

  const existing = await prisma.application.findUnique({
    where: { jobId_tutorId: { jobId, tutorId: profile.id } },
  });
  if (existing) {
    return { ok: false, error: "আপনি এই টিউশনে ইতিমধ্যে আবেদন করেছেন।" };
  }

  const note = (formData.get("note") as string | null)?.trim() || null;
  await prisma.application.create({
    data: { jobId, tutorId: profile.id, note },
  });

  updateTag("jobs");
  updateTag(`job-${jobId}`);
  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}
