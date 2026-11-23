"use server";

import { requireAdmin } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import type { ApplicationStatus, JobStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "./auth";

function revalidateAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/admin/tutors");
  revalidatePath("/admin/applications");
  revalidatePath("/jobs");
  revalidatePath("/tutors");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

/** Approve a pending job: it goes OPEN with today's publish date. */
export async function approveJob(jobId: string): Promise<ActionResult> {
  await requireAdmin();
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "PENDING_REVIEW") {
    return { ok: false, error: "এই পোস্টটি যাচাইয়ের অপেক্ষায় নেই।" };
  }
  await prisma.job.update({
    where: { id: jobId },
    data: { status: "OPEN", publishedAt: new Date() },
  });
  revalidateAdmin();
  return { ok: true };
}

/** Reject a pending job (spam, duplicate, or unverifiable by phone). */
export async function rejectJob(jobId: string): Promise<ActionResult> {
  await requireAdmin();
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.status !== "PENDING_REVIEW") {
    return { ok: false, error: "এই পোস্টটি যাচাইয়ের অপেক্ষায় নেই।" };
  }
  await prisma.job.update({
    where: { id: jobId },
    data: { status: "CANCELLED" },
  });
  revalidateAdmin();
  return { ok: true };
}

/** Change a job's status. Reopening (OPEN) refreshes the 30-day window. */
export async function setJobStatus(
  jobId: string,
  status: JobStatus,
): Promise<ActionResult> {
  await requireAdmin();
  if (status === "PENDING_REVIEW") {
    return { ok: false, error: "এই অবস্থায় ফেরত নেওয়া যাবে না।" };
  }
  await prisma.job.update({
    where: { id: jobId },
    data:
      status === "OPEN"
        ? { status, publishedAt: new Date() }
        : { status },
  });
  revalidateAdmin();
  return { ok: true };
}

/** Toggle a tutor's verification badge. */
export async function toggleTutorVerified(
  tutorId: string,
): Promise<ActionResult> {
  await requireAdmin();
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
  });
  if (!tutor) return { ok: false, error: "টিউটর পাওয়া যায়নি।" };
  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { isVerified: !tutor.isVerified },
  });
  revalidateAdmin();
  return { ok: true };
}

/** Toggle whether a tutor appears in the public directory. */
export async function toggleTutorPublished(
  tutorId: string,
): Promise<ActionResult> {
  await requireAdmin();
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
  });
  if (!tutor) return { ok: false, error: "টিউটর পাওয়া যায়নি।" };
  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: { isPublished: !tutor.isPublished },
  });
  revalidateAdmin();
  return { ok: true };
}

/**
 * Move an application through the mediation pipeline. Confirming a tutor
 * fills the job — the guardian's phone is then revealed to that tutor on
 * their dashboard.
 */
export async function setApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
): Promise<ActionResult> {
  await requireAdmin();
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: true },
  });
  if (!application) {
    return { ok: false, error: "আবেদন পাওয়া যায়নি।" };
  }
  await prisma.$transaction(async (tx) => {
    await tx.application.update({
      where: { id: applicationId },
      data: { status },
    });
    if (status === "CONFIRMED" && application.job.status === "OPEN") {
      await tx.job.update({
        where: { id: application.jobId },
        data: { status: "FILLED" },
      });
    }
  });
  revalidateAdmin();
  return { ok: true };
}
