"use client";

import { useState } from "react";
import { AuctionApiResponse, BackendAuction } from "@/lib/types";
import { AuctionData } from "@/data/auctions";
import { useAuctions, useRefreshAuctions } from "@/hooks/useAuctions";
import AuctionCard from "../common/AuctionCard";
import BidModal from "../common/BidModal";

interface AuctionSectionClientProps {
  initialData?: AuctionApiResponse;
}

export default function AuctionSectionClient({ initialData }: AuctionSectionClientProps) {
  const [selectedAuction, setSelectedAuction] = useState<BackendAuction | AuctionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use TanStack Query for data fetching
  const { data: auctionData, isLoading, error, isError, refetch } = useAuctions();

  // Mutation for manual refresh
  const refreshAuctions = useRefreshAuctions();

  const handleBidClick = (auction: BackendAuction | AuctionData) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAuction(null);
  };

  const handleRefresh = () => {
    refreshAuctions.mutate();
  };

  // Convert BackendAuction to AuctionData format for BidModal compatibility
  const convertedAuction =
    selectedAuction && "_id" in selectedAuction
      ? ({
          id: selectedAuction._id,
          title: selectedAuction.itemName,
          images: selectedAuction.media.map((media) => media.fileUrl),
          currentPrice: selectedAuction.currentHighestBid || selectedAuction.startPrice,
          startingPrice: selectedAuction.startPrice,
          highestBid: selectedAuction.currentHighestBid || 0,
          bidCount: selectedAuction.currentWinner ? 1 : 0,
          endTime: selectedAuction.endDate,
          status: "active" as const,
        } as AuctionData)
      : (selectedAuction as AuctionData);

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

  if (!auctionData || auctionData.status !== "success") {
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

  const { auctions, statistics } = auctionData.data;

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
              <div className="flex gap-4 text-sm text-gray-600 items-center">
                <span>Total Lelang: {statistics.totalAuctions}</span>
                <span>Aktif: {statistics.activeAuctions}</span>
                <span>Selesai: {statistics.completedAuctions}</span>
                <button onClick={handleRefresh} disabled={refreshAuctions.isPending} className="text-primary hover:text-primary/80 font-medium transition-colors text-xs" title="Segarkan data lelang">
                  {refreshAuctions.isPending ? "⟳ Menyegarkan..." : "⟳ Segarkan"}
                </button>
              </div>
            </div>
          </div>

          {/* Auction Grid */}
          {auctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {auctions.map((auction) => (
                <AuctionCard key={auction._id} auction={auction} onBidClick={handleBidClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Tidak ada lelang yang tersedia saat ini.</p>
              <button onClick={handleRefresh} disabled={refreshAuctions.isPending} className="mt-4 bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white px-6 py-2 rounded-lg transition-colors">
                {refreshAuctions.isPending ? "Menyegarkan..." : "Segarkan Data"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Bid Modal */}
      <BidModal isOpen={isModalOpen} onClose={handleModalClose} auction={convertedAuction} />
    </>
  );
}
