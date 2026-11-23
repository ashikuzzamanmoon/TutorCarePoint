import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { expiryCutoff } from "@/lib/utils";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tutors`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/post-tuition`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    // Dynamic open tuition posts
    const jobs = await prisma.job.findMany({
      where: {
        status: "OPEN",
        publishedAt: { gte: expiryCutoff() },
      },
      select: {
        id: true,
        updatedAt: true,
      },
      take: 500,
    });

    const jobRoutes: MetadataRoute.Sitemap = jobs.map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: job.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    // Dynamic public tutors
    const tutors = await prisma.tutorProfile.findMany({
      where: {
        isPublished: true,
        subjects: { isEmpty: false },
      },
      select: {
        id: true,
        updatedAt: true,
      },
      take: 500,
    });

    const tutorRoutes: MetadataRoute.Sitemap = tutors.map((tutor) => ({
      url: `${baseUrl}/tutors/${tutor.id}`,
      lastModified: tutor.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...jobRoutes, ...tutorRoutes];
  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
    return staticRoutes;
  }
}
