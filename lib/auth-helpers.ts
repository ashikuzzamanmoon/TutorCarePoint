import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

/** The signed-in user with their tutor profile (if any), or null. */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: { tutorProfile: true },
  });
}

/** Require any signed-in user; redirects to /login otherwise. */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/** Require a signed-in tutor with a completed profile; redirects otherwise. */
export async function requireTutorProfile() {
  const user = await requireUser();
  if (!user.tutorProfile) redirect("/dashboard/profile?setup=1");
  return { user, profile: user.tutorProfile };
}

/** Require the ADMIN role; redirects non-admins to the tutor dashboard. */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}
