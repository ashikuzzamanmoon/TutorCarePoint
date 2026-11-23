// Seed script — LOCAL TESTING ONLY. Never run against production.
//
// Creates clearly-marked SAMPLE data so you can click through the whole
// mediation flow locally: an admin, three sample tutors, six sample jobs
// across Sirajganj district (launch focus), and sample applications in different pipeline
// stages (including one CONFIRMED application, so the contact-reveal step
// is visible on the tutor dashboard).
//
// Run:  npm run db:seed        (or: npx prisma db seed)
// Test logins (local only):
//   Admin:  admin@demo.local / Demo1234!
//   Tutor:  tutor@demo.local / Demo1234!
//
// The script refuses to run when NODE_ENV=production. It upserts the demo
// accounts by email and replaces any previous SAMPLE jobs, so re-running
// it does not duplicate data. To clear the demo data, delete the demo
// users and the jobs whose guardian name starts with "SAMPLE"
// (see README.md).

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// Load .env for DATABASE_URL (Node 22.6+ built-in; no dotenv dependency).
process.loadEnvFile?.();

if (process.env.NODE_ENV === "production") {
  console.error("Refusing to seed: NODE_ENV=production. This script is for local testing only.");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env and fill it in first.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const PASSWORD_HASH = await bcrypt.hash("Demo1234!", 12);

async function upsertUser(email, name, role) {
  return prisma.user.upsert({
    where: { email },
    update: { name, role },
    create: { email, name, role, passwordHash: PASSWORD_HASH },
  });
}

async function main() {
  console.log("Seeding SAMPLE data (local testing only)...");

  // Clear previous SAMPLE jobs (applications cascade-delete with them).
  await prisma.job.deleteMany({ where: { guardianName: { startsWith: "SAMPLE" } } });

  // Admin
  await upsertUser("admin@demo.local", "Sample Admin", "ADMIN");

  // Tutor 1 — Sirajganj Sadar, Math/Physics, verified
  const tutor1 = await upsertUser("tutor@demo.local", "Rahim Uddin (SAMPLE)", "TUTOR");
  const profile1 = await prisma.tutorProfile.upsert({
    where: { userId: tutor1.id },
    update: {},
    create: {
      userId: tutor1.id,
      displayName: "Rahim Uddin (SAMPLE)",
      gender: "MALE",
      phone: "01700000001",
      district: "sirajganj",
      area: "মুজিব সড়ক",
      educationLevel: "অনার্স ৩য় বর্ষ",
      institution: "সরকারি কলেজ, সিরাজগঞ্জ",
      subjects: ["গণিত", "পদার্থবিজ্ঞান"],
      classes: ["৮ম শ্রেণি", "৯ম শ্রেণি", "১০ম শ্রেণি", "এইচএসসি ১ম বর্ষ"],
      mediums: ["BANGLA"],
      expectedSalary: 3000,
      daysPerWeek: 5,
      experienceYears: 2,
      bio: "নমুনা প্রোফাইল — গণিত ও পদার্থবিজ্ঞান পড়াই।",
      isVerified: true,
    },
  });

  // Tutor 2 — Kazipur, English/Bangla
  const tutor2 = await upsertUser("tutor2@demo.local", "Nasrin Akter (SAMPLE)", "TUTOR");
  const profile2 = await prisma.tutorProfile.upsert({
    where: { userId: tutor2.id },
    update: {},
    create: {
      userId: tutor2.id,
      displayName: "Nasrin Akter (SAMPLE)",
      gender: "FEMALE",
      phone: "01700000002",
      district: "sirajganj",
      area: "কাজিপুর বাজার",
      educationLevel: "বিএসসি সম্পন্ন",
      institution: "জাতীয় বিশ্ববিদ্যালয়",
      subjects: ["ইংরেজি", "বাংলা"],
      classes: ["৫ম শ্রেণি", "৬ষ্ঠ শ্রেণি", "৭ম শ্রেণি", "৮ম শ্রেণি"],
      mediums: ["BANGLA", "ENGLISH_VERSION"],
      expectedSalary: 2500,
      daysPerWeek: 6,
      experienceYears: 3,
      bio: "নমুনা প্রোফাইল — ইংরেজি ও বাংলা পড়াই।",
      isVerified: false,
    },
  });

  // Tutor 3 — Shahjadpur, ICT/Chemistry
  const tutor3 = await upsertUser("tutor3@demo.local", "Mehedi Hasan (SAMPLE)", "TUTOR");
  await prisma.tutorProfile.upsert({
    where: { userId: tutor3.id },
    update: {},
    create: {
      userId: tutor3.id,
      displayName: "Mehedi Hasan (SAMPLE)",
      gender: "MALE",
      phone: "01700000003",
      district: "sirajganj",
      area: "শাহজাদপুর পৌরসভা",
      educationLevel: "ডিপ্লোমা ইন ইঞ্জিনিয়ারিং",
      institution: "সিরাজগঞ্জ পলিটেকনিক",
      subjects: ["আইসিটি", "রসায়ন"],
      classes: ["৯ম শ্রেণি", "১০ম শ্রেণি", "এইচএসসি ১ম বর্ষ", "এইচএসসি ২য় বর্ষ"],
      mediums: ["BANGLA"],
      expectedSalary: 3500,
      daysPerWeek: 4,
      experienceYears: 1,
      bio: "নমুনা প্রোফাইল — আইসিটি ও রসায়ন পড়াই।",
      isVerified: false,
    },
  });

  const now = new Date();
  const daysAgo = (n) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  // Six sample jobs across Sirajganj (realistic local salaries: ৳2,000–4,000).
  const job1 = await prisma.job.create({
    data: {
      guardianName: "SAMPLE Guardian 1",
      guardianPhone: "01800000001",
      title: "৮ম শ্রেণি — গণিত, সাধারণ বিজ্ঞান (সিরাজগঞ্জ)",
      className: "৮ম শ্রেণি",
      subjects: ["গণিত", "সাধারণ বিজ্ঞান"],
      medium: "BANGLA",
      district: "sirajganj",
      area: "মুজিব সড়ক",
      salary: 3000,
      daysPerWeek: 5,
      tutorGenderPreference: "ANY",
      notes: "সন্ধ্যায় পড়াতে হবে।",
      status: "OPEN",
      publishedAt: daysAgo(2),
    },
  });

  await prisma.job.create({
    data: {
      guardianName: "SAMPLE Guardian 2",
      guardianPhone: "01800000002",
      title: "৫ম শ্রেণি — সব বিষয় (সিরাজগঞ্জ)",
      className: "৫ম শ্রেণি",
      subjects: ["সব বিষয়"],
      medium: "BANGLA",
      district: "sirajganj",
      area: "কাজিপুর সদর",
      salary: 2000,
      daysPerWeek: 6,
      tutorGenderPreference: "FEMALE",
      status: "OPEN",
      publishedAt: daysAgo(5),
    },
  });

  await prisma.job.create({
    data: {
      guardianName: "SAMPLE Guardian 3",
      guardianPhone: "01800000003",
      title: "এইচএসসি ১ম বর্ষ — পদার্থবিজ্ঞান, রসায়ন (সিরাজগঞ্জ)",
      className: "এইচএসসি ১ম বর্ষ",
      subjects: ["পদার্থবিজ্ঞান", "রসায়ন"],
      medium: "BANGLA",
      district: "sirajganj",
      area: "শাহজাদপুর",
      salary: 4000,
      daysPerWeek: 4,
      tutorGenderPreference: "ANY",
      status: "OPEN",
      publishedAt: daysAgo(1),
    },
  });

  await prisma.job.create({
    data: {
      guardianName: "SAMPLE Guardian 4",
      guardianPhone: "01800000004",
      title: "১০ম শ্রেণি — ইংরেজি (সিরাজগঞ্জ)",
      className: "১০ম শ্রেণি",
      subjects: ["ইংরেজি"],
      medium: "ENGLISH_VERSION",
      district: "sirajganj",
      area: "বেলকুচি",
      salary: 2500,
      daysPerWeek: 5,
      tutorGenderPreference: "ANY",
      status: "OPEN",
      publishedAt: daysAgo(3),
    },
  });

  // Pending review — shows up in the admin queue.
  await prisma.job.create({
    data: {
      guardianName: "SAMPLE Guardian 5",
      guardianPhone: "01800000005",
      title: "৯ম শ্রেণি — গণিত, উচ্চতর গণিত (সিরাজগঞ্জ)",
      className: "৯ম শ্রেণি",
      subjects: ["গণিত", "উচ্চতর গণিত"],
      medium: "BANGLA",
      district: "sirajganj",
      area: "উল্লাপাড়া",
      salary: 3500,
      daysPerWeek: 5,
      tutorGenderPreference: "MALE",
      status: "PENDING_REVIEW",
    },
  });

  // Filled job with a CONFIRMED application — demos the contact reveal.
  const job6 = await prisma.job.create({
    data: {
      guardianName: "SAMPLE Guardian 6",
      guardianPhone: "01800000006",
      title: "৭ম শ্রেণি — ইংরেজি, বাংলা (সিরাজগঞ্জ)",
      className: "৭ম শ্রেণি",
      subjects: ["ইংরেজি", "বাংলা"],
      medium: "BANGLA",
      district: "sirajganj",
      area: "পদ্মাপুকুর",
      salary: 2500,
      daysPerWeek: 5,
      tutorGenderPreference: "ANY",
      status: "FILLED",
      publishedAt: daysAgo(12),
    },
  });

  // Sample applications in different pipeline stages.
  await prisma.application.create({
    data: { jobId: job1.id, tutorId: profile2.id, status: "APPLIED", note: "আমি এই টিউশনটি করতে আগ্রহী।" },
  });
  await prisma.application.create({
    data: { jobId: job6.id, tutorId: profile1.id, status: "CONFIRMED" },
  });

  console.log("Seed complete.");
  console.log("  Admin: admin@demo.local / Demo1234!");
  console.log("  Tutor: tutor@demo.local / Demo1234!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
