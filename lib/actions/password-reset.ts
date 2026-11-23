"use server";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

export interface PasswordResetResult {
  ok: boolean;
  message?: string;
  error?: string;
}

const emailSchema = z.object({
  email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
});

export async function requestPasswordReset(
  _prev: PasswordResetResult,
  formData: FormData,
): Promise<PasswordResetResult> {
  const parsed = emailSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "সঠিক ইমেইল দিন" };
  }
  const email = parsed.data.email.toLowerCase();

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Always return success message for security even if user doesn't exist
  if (!user) {
    return {
      ok: true,
      message:
        "যদি এই ইমেইলটি নিবন্ধিত থাকে, তবে পাসওয়ার্ড রিসেটের লিংক পাঠানো হয়েছে। ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।",
    };
  }

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Generate a cryptographically secure token valid for 1 hour
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  await sendPasswordResetEmail(email, resetLink);

  return {
    ok: true,
    message:
      "আপনার ইমেইলে পাসওয়ার্ড রিসেটের একটি লিংক পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন।",
  };
}

const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "অবৈধ টোকেন"),
    password: z.string().min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"),
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "উভয় পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"],
  });

export async function resetPasswordWithToken(
  _prev: PasswordResetResult,
  formData: FormData,
): Promise<PasswordResetResult> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "তথ্য সঠিকভাবে পূরণ করুন",
    };
  }

  const { token, password } = parsed.data;

  const verificationRecord = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationRecord || verificationRecord.expires < new Date()) {
    return {
      ok: false,
      error: "এই লিংকটির মেয়াদ শেষ হয়ে গেছে বা এটি ইতিমধ্যে ব্যবহার করা হয়েছে। নতুন করে অনুরোধ করুন।",
    };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { email: verificationRecord.identifier },
    data: { passwordHash },
  });

  // Delete the used token
  await prisma.verificationToken.delete({
    where: { token },
  });

  return { ok: true };
}
