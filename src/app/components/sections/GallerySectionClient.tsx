"use client";

import { useState } from "react";
import { useGalleries, useRefreshGalleries } from "@/hooks/useGalleries";
import { GalleryQueryParams } from "@/services/galleryService";
import GalleryCard from "@/app/components/common/GalleryCard";
import { RefreshCw, AlertCircle } from "react-feather";
import Link from "next/link";

export default function GallerySectionClient() {
  const [queryParams, setQueryParams] = useState<GalleryQueryParams>({
    page: 1,
    limit: 4, // Show 6 items in bento grid
    isActive: true, // Only show active galleries
  });

  const { data, isLoading, error, refetch } = useGalleries(queryParams);
  const refreshGalleries = useRefreshGalleries();

  const handleRefresh = () => {
    refreshGalleries.mutate(queryParams);
  };

  const handleLoadMore = () => {
    if (data?.data.metadata.hasNextPage) {
      setQueryParams((prev) => ({
        ...prev,
        page: (prev.page || 1) + 1,
      }));
    }
  };

  if (isLoading) {
    return (
      <section className="section-padding mx-6 bg-[#FFE6E630]" id="galeri">
        <div className="container-custom">
          <div className="text-center py-12">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Galeri</span> & Momen
            </h2>
            <div className="flex justify-center">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
            <p className="text-gray-600 mt-4">Memuat galeri...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding mx-6" id="galeri">
        <div className="container-custom">
          <div className="text-center py-12">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Galeri</span> & Momen
            </h2>
            <div className="flex justify-center items-center space-x-3 text-red-500">
              <AlertCircle size={24} />
              <p>Gagal memuat galeri</p>
            </div>
            <button onClick={handleRefresh} disabled={refreshGalleries.isPending} className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50">
              {refreshGalleries.isPending ? "Memuat..." : "Coba Lagi"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  const galleries = data?.data.galleries || [];

  return (
    <section className="section-padding mx-6" id="galeri">
      <div className="container-custom">
        {/* Section Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-12">
          <div>
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Galeri</span> & Momen
            </h2>
            {data?.data.statistics && (
              <>
                <Link href="/galeri">
                  <span className="text-sm text-gray-600 underline hover:text-primary transition-colors leading-tight">Lihat Semua Galeri</span>
                </Link>
              </>
            )}
          </div>
          <div className="flex items-start justify-between">
            <p className="text-responsive-base text-gray-800 leading-relaxed max-w-2xl">
              Jelajahi koleksi momen berharga dan galeri ikan koi terbaik dari komunitas Pluto Koi. Temukan inspirasi dan kenangan indah dari setiap lelang dan acara yang telah berlangsung.
            </p>
            <button onClick={handleRefresh} disabled={refreshGalleries.isPending} className="ml-4 p-2 text-gray-500 hover:text-primary transition-colors disabled:opacity-50" title="Refresh galeri">
              <RefreshCw size={20} className={refreshGalleries.isPending ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {galleries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Belum ada galeri tersedia</p>
          </div>
        ) : (
          <>
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 mb-8">
              {galleries.slice(0, 6).map((gallery, index) => {
                // Bento grid layout logic
                let className = "";
                switch (index) {
                  case 0:
                    className = "md:col-span-2 md:row-span-1";
                    break;
                  case 1:
                    className = "md:col-span-1 md:row-span-1";
                    break;
                  case 2:
                    className = "md:col-span-1 md:row-span-1";
                    break;
                  case 3:
                    className = "md:col-span-2 md:row-span-1";
                    break;
                  default:
                    className = "md:col-span-1";
                }

                return <GalleryCard key={gallery._id} gallery={gallery} size="medium" className={className} />;
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
