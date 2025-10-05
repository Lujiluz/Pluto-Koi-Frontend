"use client";

import { useState } from "react";
import AuctionCard from "../common/AuctionCard";
import BidModal from "../common/BidModal";
import { mockAuctionData, auctionSection, AuctionData } from "@/data/auctions";
import { BackendAuction } from "@/lib/types";

export default function AuctionSection() {
  const [selectedAuction, setSelectedAuction] = useState<AuctionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBidClick = (auction: AuctionData | BackendAuction) => {
    setSelectedAuction(auction as AuctionData);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAuction(null);
  };

  return (
    <>
      <section className="section-padding bg-white mx-8" id="lelang">
        <div className="container-custom">
          {/* Section Header */}
          <div className="mb-12 flex md:flex-row flex-col justify-between">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Lelang</span> Sedang Berlangsung
            </h2>
            <p className="text-responsive-base text-gray-800 leading-relaxed max-w-2xl">{auctionSection.subtitle}</p>
          </div>

          {/* Auction Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockAuctionData.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} onBidClick={handleBidClick} />
            ))}
          </div>
        </div>
      </section>

      {/* Bid Modal */}
      <BidModal isOpen={isModalOpen} onClose={handleModalClose} auction={selectedAuction} />
    </>
  );
}
