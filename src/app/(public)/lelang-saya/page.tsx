import MyAuctionsPageClient from "@/app/components/pages/MyAuctionsPageClient";
import { Metadata } from "next";
import { Suspense } from "react";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Lelang Saya | Pluto Koi",
  description: "Lihat semua lelang yang Anda ikuti dan konfirmasi kemenangan lelang di Pluto Koi",
  keywords: ["lelang saya", "bid history", "auction history", "ikan koi", "pluto koi"],
};

export default function MyAuctionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <MyAuctionsPageClient />
    </Suspense>
  );
}
