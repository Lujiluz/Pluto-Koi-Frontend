import { Metadata } from "next";
import { Suspense } from "react";
import { getGalleriesServer } from "@/services/galleryService";
import { GalleryApiResponse } from "@/lib/types";
import GalleryPageClient from "@/app/components/pages/GalleryPageClient";
import { keywords } from "@/lib/constants";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Galeri - Pluto Koi",
  description: "Jelajahi koleksi momen berharga dan galeri ikan koi shiro utsuri terbaik dari komunitas Pluto Koi. Temukan inspirasi dan kenangan indah dari setiap lelang dan acara.",
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

// This will be statically generated at build time
export default async function GalleryPage() {
  let initialData: GalleryApiResponse | null = null;

  try {
    // Fetch initial data for SSG
    initialData = await getGalleriesServer({
      page: 1,
      limit: 12, // Load more for gallery page
      isActive: true,
    });
  } catch (error) {
    console.error("Failed to fetch initial gallery data:", error);
    // Continue without initial data - client will handle loading
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <GalleryPageClient initialData={initialData} />
      </Suspense>
    </>
  );
}

// Enable static generation with revalidation
export const revalidate = 300; // Revalidate every 5 minutes
