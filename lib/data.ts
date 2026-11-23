import { prisma } from "@/lib/prisma";
import { expiryCutoff } from "@/lib/utils";
import { unstable_cache } from "next/cache";

/**
 * Cache recent open jobs for the home page.
 * Cached for 60 seconds or until the 'jobs' tag is revalidated.
 */
export const getCachedRecentJobs = unstable_cache(
  async () => {
    return prisma.job.findMany({
      where: { status: "OPEN", publishedAt: { gte: expiryCutoff() } },
      orderBy: { publishedAt: "desc" },
      take: 12,
    });
  },
  ["home-recent-jobs"],
  { revalidate: 60, tags: ["jobs"] }
);

/**
 * Cache single job detail query by ID.
 */
export const getCachedJobById = (id: string) =>
  unstable_cache(
    async () => {
      return prisma.job.findUnique({
        where: { id },
      });
    },
    [`job-${id}`],
    { revalidate: 60, tags: ["jobs", `job-${id}`] }
  )();

/**
 * Cache verified / public tutors directory list.
 */
export const getCachedFeaturedTutors = unstable_cache(
  async () => {
    return prisma.tutorProfile.findMany({
      where: {
        isPublished: true,
        subjects: { isEmpty: false },
      },
      orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
      take: 60,
    });
  },
  ["featured-tutors-list"],
  { revalidate: 60, tags: ["tutors"] }
);

/**
 * Cache default (unfiltered) open jobs directory.
 */
export const getCachedOpenJobs = unstable_cache(
  async () => {
    return prisma.job.findMany({
      where: {
        status: "OPEN",
        publishedAt: { gte: expiryCutoff() },
      },
      orderBy: { publishedAt: "desc" },
      take: 100,
    });
  },
  ["default-open-jobs"],
  { revalidate: 60, tags: ["jobs"] }
);

/**
 * Cache default (unfiltered) public tutors directory.
 */
export const getCachedDefaultTutors = unstable_cache(
  async () => {
    return prisma.tutorProfile.findMany({
      where: {
        isPublished: true,
        subjects: { isEmpty: false },
      },
      orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
      take: 100,
    });
  },
  ["default-tutors"],
  { revalidate: 60, tags: ["tutors"] }
);

/**
 * Cache single tutor profile query by ID.
 */
export const getCachedTutorById = (id: string) =>
  unstable_cache(
    async () => {
      return prisma.tutorProfile.findUnique({
        where: { id },
      });
    },
    [`tutor-${id}`],
    { revalidate: 60, tags: ["tutors", `tutor-${id}`] }
  )();
