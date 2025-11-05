"use client";

import { useState, useRef, useEffect } from "react";
import { AuctionApiResponse } from "@/lib/types";
import { useInfiniteAuctions, useRefreshAuctions } from "@/hooks/useAuctions";
import AuctionCard from "../common/AuctionCard";

interface AuctionSectionClientProps {
  initialData?: AuctionApiResponse;
}

export default function AuctionSectionClient({ initialData }: AuctionSectionClientProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Use TanStack Query infinite scroll for data fetching
  const { data, isLoading, error, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteAuctions(8);

  // Mutation for manual refresh
  const refreshAuctions = useRefreshAuctions();

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = () => {
    refreshAuctions.mutate();
  };

  // Flatten all pages of auctions
  const allAuctions = data?.pages.flatMap((page) => (page.status === "success" ? page.data.auctions : [])) || [];

  // Get statistics from the first page
  const statistics = data?.pages[0]?.status === "success" ? data.pages[0].data.statistics : null;

  if (isLoading) {
    return (
      <section className="section-padding bg-white mx-8" id="lelang">
        <div className="container-custom">
          <div className="text-center py-12">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Lelang</span> Sedang Berlangsung
            </h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data lelang...</p>
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="section-padding bg-white mx-8" id="lelang">
        <div className="container-custom">
          <div className="text-center py-12">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Lelang</span> Sedang Berlangsung
            </h2>
            <p className="text-red-600 mb-4">{error instanceof Error ? error.message : "Gagal memuat data lelang. Silakan coba lagi nanti."}</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => refetch()} disabled={isLoading} className="bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white px-6 py-2 rounded-lg transition-colors">
                {isLoading ? "Memuat..." : "Coba Lagi"}
              </button>
              <button onClick={handleRefresh} disabled={refreshAuctions.isPending} className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors">
                {refreshAuctions.isPending ? "Menyegarkan..." : "Segarkan"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data || allAuctions.length === 0) {
    return (
      <section className="section-padding bg-white mx-8" id="lelang">
        <div className="container-custom">
          <div className="text-center py-12">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Lelang</span> Sedang Berlangsung
            </h2>
            <p className="text-gray-600">Tidak ada lelang yang tersedia saat ini.</p>
            <button onClick={handleRefresh} disabled={refreshAuctions.isPending} className="mt-4 bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white px-6 py-2 rounded-lg transition-colors">
              {refreshAuctions.isPending ? "Menyegarkan..." : "Segarkan Data"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section-padding bg-white mx-8" id="lelang">
        <div className="container-custom">
          {/* Section Header */}
          <div className="mb-12 flex md:flex-row flex-col justify-between">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Lelang</span> Sedang Berlangsung
            </h2>
            <div className="flex flex-col space-y-2">
              <p className="text-responsive-base text-gray-800 leading-relaxed max-w-2xl">Ikuti lelang real-time dan menangkan ikan koi impian Anda!</p>
              {statistics && (
                <div className="flex gap-4 text-sm text-gray-600 items-center">
                  <span>Total Lelang: {statistics.totalAuctions}</span>
                  <span>Aktif: {statistics.activeAuctions}</span>
                  <span>Selesai: {statistics.completedAuctions}</span>
                  <button onClick={handleRefresh} disabled={refreshAuctions.isPending} className="text-primary hover:text-primary/80 font-medium transition-colors text-xs" title="Segarkan data lelang">
                    {refreshAuctions.isPending ? "⟳ Menyegarkan..." : "⟳ Segarkan"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Auction Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allAuctions.map((auction) => (
              <AuctionCard key={auction._id} auction={auction} />
            ))}
          </div>

          {/* Load More Trigger */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="flex justify-center items-center py-8">
              {isFetchingNextPage ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-gray-600 text-sm">Memuat lebih banyak...</p>
                </div>
              ) : (
                <button onClick={() => fetchNextPage()} className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg transition-colors">
                  Muat Lebih Banyak
                </button>
              )}
            </div>
          )}

          {/* End of List Message */}
          {!hasNextPage && allAuctions.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Anda telah melihat semua lelang yang tersedia</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
