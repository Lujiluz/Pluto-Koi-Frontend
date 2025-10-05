import { Metadata } from "next";
import { getGalleriesServer } from "@/services/galleryService";
import { GalleryApiResponse } from "@/lib/types";
import GalleryPageClient from "@/app/components/pages/GalleryPageClient";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Galeri - Pluto Koi",
  description: "Jelajahi koleksi momen berharga dan galeri ikan koi terbaik dari komunitas Pluto Koi. Temukan inspirasi dan kenangan indah dari setiap lelang dan acara.",
  keywords: ["galeri koi", "ikan koi", "lelang koi", "pluto koi", "galeri"],
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

  return <GalleryPageClient initialData={initialData} />;
}

// Enable static generation with revalidation
export const revalidate = 300; // Revalidate every 5 minutes
