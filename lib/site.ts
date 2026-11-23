import type {
  ApplicationStatus,
  Gender,
  JobStatus,
  Medium,
} from "@prisma/client";

// ---------------------------------------------------------------------------
// Site identity — change the name here and it updates everywhere.
// No page copy hardcodes the site name; everything reads from this file.
// ---------------------------------------------------------------------------

export const SITE_NAME = "TutorCarePoint";
export const SITE_NAME_BN = "টিউটর কেয়ার পয়েন্ট";
export const SITE_TAGLINE =
  "সারা বাংলাদেশের টিউটর ও অভিভাবকদের জন্য সম্পূর্ণ ফ্রি টিউশন মিডিয়া";
export const SITE_DESCRIPTION =
  "সারা বাংলাদেশের টিউটর ও অভিভাবকদের সম্পূর্ণ ফ্রি টিউশন মিডিয়া — সিরাজগঞ্জ থেকে শুরু। কোনো কমিশন নেই, কোনো ফি নেই। আবেদন করুন, ডেমো ক্লাস নিন, কনফার্ম হলে আমরা যোগাযোগ করিয়ে দিই।";
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://tutorcarepoint.vercel.app";

// Open jobs older than this are hidden from the public board (auto-expiry).
export const JOB_EXPIRY_DAYS = 30;

// Launch-focus district: Sirajganj jobs are highlighted on the home page.
// The site serves all 64 districts; Sirajganj is the priority, not the boundary.
export const FEATURED_DISTRICT = "sirajganj";

// ---------------------------------------------------------------------------
// All 64 districts of Bangladesh — stored as slug keys, displayed in Bengali.
// Area/upazila is a free-text field on jobs and tutor profiles.
// ---------------------------------------------------------------------------

export interface District {
  key: string;
  bn: string;
}

export const DISTRICTS: District[] = [
  // Dhaka division
  { key: "dhaka", bn: "ঢাকা" },
  { key: "gazipur", bn: "গাজীপুর" },
  { key: "kishoreganj", bn: "কিশোরগঞ্জ" },
  { key: "manikganj", bn: "মানিকগঞ্জ" },
  { key: "munshiganj", bn: "মুন্সিগঞ্জ" },
  { key: "narayanganj", bn: "নারায়ণগঞ্জ" },
  { key: "narsingdi", bn: "নরসিংদী" },
  { key: "tangail", bn: "টাঙ্গাইল" },
  { key: "faridpur", bn: "ফরিদপুর" },
  { key: "gopalganj", bn: "গোপালগঞ্জ" },
  { key: "madaripur", bn: "মাদারীপুর" },
  { key: "rajbari", bn: "রাজবাড়ী" },
  { key: "shariatpur", bn: "শরীয়তপুর" },
  // Chattogram division
  { key: "chattogram", bn: "চট্টগ্রাম" },
  { key: "coxs-bazar", bn: "কক্সবাজার" },
  { key: "rangamati", bn: "রাঙ্গামাটি" },
  { key: "bandarban", bn: "বান্দরবান" },
  { key: "khagrachari", bn: "খাগড়াছড়ি" },
  { key: "feni", bn: "ফেনী" },
  { key: "noakhali", bn: "নোয়াখালী" },
  { key: "lakshmipur", bn: "লক্ষ্মীপুর" },
  { key: "cumilla", bn: "কুমিল্লা" },
  { key: "chandpur", bn: "চাঁদপুর" },
  { key: "brahmanbaria", bn: "ব্রাহ্মণবাড়িয়া" },
  // Rajshahi division
  { key: "rajshahi", bn: "রাজশাহী" },
  { key: "natore", bn: "নাটোর" },
  { key: "chapai-nawabganj", bn: "চাঁপাইনবাবগঞ্জ" },
  { key: "pabna", bn: "পাবনা" },
  { key: "sirajganj", bn: "সিরাজগঞ্জ" },
  { key: "bogura", bn: "বগুড়া" },
  { key: "joypurhat", bn: "জয়পুরহাট" },
  { key: "naogaon", bn: "নওগাঁ" },
  // Khulna division
  { key: "khulna", bn: "খুলনা" },
  { key: "bagerhat", bn: "বাগেরহাট" },
  { key: "satkhira", bn: "সাতক্ষীরা" },
  { key: "jessore", bn: "যশোর" },
  { key: "jhenaidah", bn: "ঝিনাইদহ" },
  { key: "magura", bn: "মাগুরা" },
  { key: "narail", bn: "নড়াইল" },
  { key: "kushtia", bn: "কুষ্টিয়া" },
  { key: "chuadanga", bn: "চুয়াডাঙ্গা" },
  { key: "meherpur", bn: "মেহেরপুর" },
  // Barishal division
  { key: "barishal", bn: "বরিশাল" },
  { key: "bhola", bn: "ভোলা" },
  { key: "patuakhali", bn: "পটুয়াখালী" },
  { key: "pirojpur", bn: "পিরোজপুর" },
  { key: "barguna", bn: "বরগুনা" },
  { key: "jhalokathi", bn: "ঝালকাঠি" },
  // Sylhet division
  { key: "sylhet", bn: "সিলেট" },
  { key: "moulvibazar", bn: "মৌলভীবাজার" },
  { key: "habiganj", bn: "হবিগঞ্জ" },
  { key: "sunamganj", bn: "সুনামগঞ্জ" },
  // Rangpur division
  { key: "rangpur", bn: "রংপুর" },
  { key: "dinajpur", bn: "দিনাজপুর" },
  { key: "kurigram", bn: "কুড়িগ্রাম" },
  { key: "gaibandha", bn: "গাইবান্ধা" },
  { key: "nilphamari", bn: "নীলফামারী" },
  { key: "lalmonirhat", bn: "লালমনিরহাট" },
  { key: "thakurgaon", bn: "ঠাকুরগাঁও" },
  { key: "panchagarh", bn: "পঞ্চগড়" },
  // Mymensingh division
  { key: "mymensingh", bn: "ময়মনসিংহ" },
  { key: "jamalpur", bn: "জামালপুর" },
  { key: "netrokona", bn: "নেত্রকোণা" },
  { key: "sherpur", bn: "শেরপুর" },
];

export const DISTRICT_KEYS = DISTRICTS.map((d) => d.key);

export function districtName(key: string): string {
  return DISTRICTS.find((d) => d.key === key)?.bn ?? key;
}

// ---------------------------------------------------------------------------
// Classes, subjects, mediums, genders
// ---------------------------------------------------------------------------

export const CLASSES = [
  "১ম শ্রেণি",
  "২য় শ্রেণি",
  "৩য় শ্রেণি",
  "৪র্থ শ্রেণি",
  "৫ম শ্রেণি",
  "৬ষ্ঠ শ্রেণি",
  "৭ম শ্রেণি",
  "৮ম শ্রেণি",
  "৯ম শ্রেণি",
  "১০ম শ্রেণি",
  "এসএসসি",
  "এইচএসসি ১ম বর্ষ",
  "এইচএসসি ২য় বর্ষ",
  "ভর্তি পরীক্ষা",
];

export const SUBJECTS = [
  "বাংলা",
  "ইংরেজি",
  "গণিত",
  "পদার্থবিজ্ঞান",
  "রসায়ন",
  "জীববিজ্ঞান",
  "উচ্চতর গণিত",
  "আইসিটি",
  "হিসাববিজ্ঞান",
  "অর্থনীতি",
  "ইসলাম শিক্ষা",
  "সাধারণ বিজ্ঞান",
  "সমাজবিজ্ঞান",
  "সব বিষয়",
];

export const MEDIUMS: Medium[] = [
  "BANGLA",
  "ENGLISH_MEDIUM",
  "ENGLISH_VERSION",
  "MADRASA",
];

export const MEDIUM_LABELS: Record<Medium, string> = {
  BANGLA: "বাংলা মাধ্যম",
  ENGLISH_MEDIUM: "ইংলিশ মিডিয়াম",
  ENGLISH_VERSION: "ইংলিশ ভার্সন",
  MADRASA: "মাদ্রাসা",
};

export const GENDERS: Gender[] = ["MALE", "FEMALE", "ANY"];

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "পুরুষ",
  FEMALE: "মহিলা",
  ANY: "যেকোনো",
};

// ---------------------------------------------------------------------------
// Status labels (Bengali)
// ---------------------------------------------------------------------------

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  PENDING_REVIEW: "যাচাই চলছে",
  OPEN: "আবেদন চলছে",
  FILLED: "নিয়োগ সম্পন্ন",
  EXPIRED: "মেয়াদ শেষ",
  CANCELLED: "বাতিল",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: "আবেদন করা হয়েছে",
  SHORTLISTED: "শর্টলিস্ট হয়েছে",
  DEMO: "ডেমো ক্লাস",
  CONFIRMED: "কনফার্ম হয়েছে",
  COMPLETED: "সম্পন্ন",
  CANCELLED: "বাতিল",
};

// Pipeline order shown in the admin panel.
export const APPLICATION_PIPELINE: ApplicationStatus[] = [
  "APPLIED",
  "SHORTLISTED",
  "DEMO",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];
