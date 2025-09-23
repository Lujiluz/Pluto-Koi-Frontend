"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatCurrency, getTimeRemaining } from "@/lib/utils";
import { AuctionData } from "@/data/auctions";

interface AuctionCardProps {
  auction: AuctionData;
  onBidClick: (auction: AuctionData) => void;
}

export default function AuctionCard({ auction, onBidClick }: AuctionCardProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(auction.endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(auction.endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  const getStatusBadge = () => {
    if (timeRemaining.isExpired) {
      return <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-md text-sm font-medium">Lelang Selesai</div>;
    }

    if (timeRemaining.hours < 1) {
      return <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium">Lelang Selesai</div>;
    }

    return (
      <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-md text-sm font-medium">
        Berakhir dalam {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
      </div>
    );
  };

  const isAuctionEnded = timeRemaining.isExpired;

  return (
    <div className="card-hover overflow-hidden">
      {/* Image */}
      <div className="relative h-48 mb-4">
        <Image src={auction.images[0] || "/images/placeholder-koi.jpg"} alt={auction.title} fill className="object-cover rounded-lg" />
        {getStatusBadge()}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-black">{auction.title}</h3>

        {/* Price Info */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Mulai dari {formatCurrency(auction.startingPrice)}</p>
          <p className="text-sm text-gray-600">Bid Tertinggi {formatCurrency(auction.highestBid)}</p>
          <p className="text-sm text-gray-600">Bid : {auction.bidCount.toLocaleString("id-ID")} orang</p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onBidClick(auction)}
          disabled={isAuctionEnded}
          className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors ${
            isAuctionEnded ? "bg-gray-400 text-white cursor-not-allowed" : auction.status === "ending-soon" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-primary hover:bg-primary-600 text-white"
          }`}
        >
          {isAuctionEnded ? "Lelang Selesai" : "Ikut BID Sekarang"}
        </button>
      </div>
    </div>
  );
}
