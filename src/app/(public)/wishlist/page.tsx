import { Metadata } from "next";
import { Suspense } from "react";
import WishlistPageClient from "@/app/components/pages/WishlistPageClient";

// Metadata for SEO
export const metadata: Metadata = {
  title: "Wishlist - Pluto Koi",
  description: "Kelola daftar keinginan Anda untuk lelang ikan koi terbaik. Simpan dan pantau item favorit Anda di Pluto Koi.",
  keywords: ["wishlist", "daftar keinginan", "lelang koi", "ikan koi", "pluto koi"],
};

export default function WishlistPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <WishlistPageClient />
    </Suspense>
  );
}
