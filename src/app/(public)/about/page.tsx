import { Metadata } from "next";
import AboutPageClient from "@/app/components/pages/AboutPageClient";
import { keywords } from "@/lib/constants";

// Metadata for SEO - Server-side rendering
export const metadata: Metadata = {
  title: "Tentang Kami - Pluto Koi",
  description: "Kenali sejarah dan perjalanan Pluto Koi Centre, pusat ikan koi berkualitas sejak 2014. Temukan kisah passion kami dalam menghadirkan koi terbaik untuk Anda.",
  keywords: keywords,
  openGraph: {
    title: "Tentang Kami - Pluto Koi Centre",
    description: "Kenali sejarah dan perjalanan Pluto Koi Centre, pusat ikan koi berkualitas sejak 2014.",
    type: "website",
    images: [
      {
        url: "/images/about/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "Pluto Koi Centre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentang Kami - Pluto Koi Centre",
    description: "Kenali sejarah dan perjalanan Pluto Koi Centre, pusat ikan koi berkualitas sejak 2014.",
  },
};

// JSON-LD structured data for better SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pluto Koi Centre",
  description: "Pusat ikan koi berkualitas sejak 2014, menyediakan ikan koi terbaik dengan passion dan dedikasi tinggi.",
  foundingDate: "2014",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://plutokoi.com",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://plutokoi.com"}/images/LOGO PLUTO-02.png`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
  },
  sameAs: ["https://www.instagram.com/pluto_koi_centre", "https://youtube.com/@plutokarpio1984", "https://www.tiktok.com/@plutokarpio"],
};

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutPageClient />
    </>
  );
}

export const revalidate = 3600;
