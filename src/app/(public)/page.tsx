import Image from "next/image";
import HeroContent from "../components/sections/HeroContent";
import Footer from "../components/layout/public/Footer";
import { Metadata } from "next";
import { keywords } from "@/lib/constants";

// Metadata for SEO - Server-side rendering
export const metadata: Metadata = {
  title: "Pluto Koi",
  description: "Pluto Koi Centre, Shiro Utsuri Specialist. Est. 2014.",
  keywords: keywords,
  openGraph: {
    title: "Pluto Koi Centre",
    description: "Pluto Koi Centre, Shiro Utsuri Specialist",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/about/og-about.jpg`,
        width: 1200,
        height: 630,
        alt: "Pluto Koi Centre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pluto Koi Centre",
    description: "Pluto Koi Centre, Shiro Utsuri Specialist",
  },
};

// JSON-LD structured data for better SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Pluto Koi Centre",
  description: "Spesialis Koi Shiro Utsuri berkualitas sejak 2014, menyediakan ikan koi terbaik dengan passion dan dedikasi tinggi.",
  foundingDate: "2014",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://plutokoi.com",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://plutokoi.com"}/images/LOGO PLUTO-02.png`,
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
  },
  sameAs: ["https://www.instagram.com/pluto_koi_centre", "https://youtube.com/@plutokarpio1984", "https://www.tiktok.com/@plutokarpio"],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] flex items-center justify-center" id="beranda">
          {/* Background */}
          <Image src="/hero/hero-background.webp" alt="Koi Fish Background" fill className="object-cover object-center" priority />

          {/* Content */}
          <HeroContent />
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
