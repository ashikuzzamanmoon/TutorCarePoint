import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_NAME_BN,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME_BN} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME_BN}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME_BN,
  keywords: [
    "টিউশন",
    "টিউটর",
    "সিরাজগঞ্জ টিউশন",
    "সিরাজগঞ্জ টিউটর",
    "হোম টিউটর সিরাজগঞ্জ",
    "টিউশন মিডিয়া বাংলাদেশ",
    "ফ্রি টিউশন প্ল্যাটফর্ম",
    "গৃহশিক্ষক",
    "টিউশন জব",
    "TutorCarePoint",
    "Tuition Media Bangladesh",
    "Free Home Tutor Bangladesh",
    "Sirajganj Home Tutor",
  ],
  authors: [{ name: SITE_NAME_BN, url: SITE_URL }],
  creator: SITE_NAME_BN,
  publisher: SITE_NAME_BN,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME_BN} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME_BN,
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME_BN} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME_BN,
      alternateName: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "bn-BD",
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/jobs?district={district}`,
        "query-input": "required name=district",
      },
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME_BN,
      alternateName: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      description: SITE_DESCRIPTION,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${notoSansBengali.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-stone-50">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
