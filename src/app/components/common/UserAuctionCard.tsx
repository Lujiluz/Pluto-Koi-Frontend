"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatCurrency, getTimeRemaining } from "@/lib/utils";
import { AuctionWithBidStatus } from "@/services/auctionActivityService";
import { getAuctionStatus, formatPrice, getTimeRemainingObject, isVideoUrl } from "@/services/auctionService";
import { Award, TrendingUp } from "react-feather";
import AuctionLeaderboardModal from "./AuctionLeaderboardModal";
import AuctionConfirmModal from "./AuctionConfirmModal";
import { BackendAuctionDetail } from "@/lib/types";

interface UserAuctionCardProps {
  auction: AuctionWithBidStatus;
  onConfirmSuccess?: () => void;
}

export default function UserAuctionCard({ auction, onConfirmSuccess }: UserAuctionCardProps) {
  const [mediaError, setMediaError] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemainingObject(auction.auction.endDate));
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    // Reset media error when auction changes
    setMediaError(false);

    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemainingObject(auction.auction.endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  const getStatusBadge = () => {
    const status = auction.auctionStatus;

    if (status === "completed" || timeRemaining.isExpired) {
      return <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-md text-sm font-medium">Lelang Selesai</div>;
    }

    if (status === "ending-soon") {
      return <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium">Segera Berakhir</div>;
    }

    if (status === "active") {
      return (
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-md text-sm font-medium">
          Berakhir dalam {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
        </div>
      );
    }

    return null;
  };

  const isAuctionEnded = auction.auctionStatus === "completed" || timeRemaining.isExpired;
  const isWinner = auction.userBidInfo.isCurrentWinner;
  const userHighestBid = auction.userBidInfo.highestBid;
  const userTotalBids = auction.userBidInfo.totalBids;

  const getImageSrc = () => {
    const images = auction.auction.media;
    return images && images.length > 0 ? images[0].fileUrl : "/images/koi/contoh_ikan.png";
  };

  const renderMedia = () => {
    const mediaUrl = getImageSrc();
    const isVideo = isVideoUrl(mediaUrl);

    // If media error, always show fallback image
    if (mediaError) {
      return <Image src="/images/koi/contoh_ikan.png" alt={auction.auction.itemName} fill className="object-cover rounded-lg" />;
    }

    if (isVideo) {
      return (
        <video
          src={mediaUrl}
          className="w-full h-full object-cover rounded-lg"
          controls={false}
          muted
          autoPlay
          loop
          playsInline
          onError={() => {
            console.warn(`Video failed to load: ${mediaUrl}`);
            setMediaError(true);
          }}
        />
      );
    } else {
      return (
        <Image
          src={mediaUrl}
          alt={auction.auction.itemName}
          fill
          className="object-cover rounded-lg"
          onError={() => {
            console.warn(`Image failed to load: ${mediaUrl}`);
            setMediaError(true);
          }}
        />
      );
    }
  };

  // Convert AuctionWithBidStatus to BackendAuctionDetail for the modal
  const auctionDetailForModal: BackendAuctionDetail = {
    _id: auction.auction._id,
    itemName: auction.auction.itemName,
    note: auction.auction.note,
    startPrice: auction.auction.startPrice,
    endPrice: auction.auction.endPrice,
    startDate: auction.auction.startDate,
    endDate: auction.auction.endDate,
    endTime: auction.auction.endTime,
    extraTime: auction.auction.extraTime,
    highestBid: auction.auction.highestBid,
    media: auction.auction.media.map((m, idx) => ({ fileUrl: m.fileUrl, _id: `media-${idx}` })),
    createdAt: auction.auction.createdAt,
    updatedAt: auction.auction.updatedAt,
    currentHighestBid: auction.currentHighestBid,
    currentWinner: null, // We don't have winner details in this response
    __v: 0,
  };

  return (
    <>
      <div className="card-hover overflow-hidden">
        {/* Media (Image or Video) */}
        <div className="relative h-48 mb-4">
          {renderMedia()}
          {getStatusBadge()}

          {/* Winner Badge */}
          {isWinner && isAuctionEnded && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-md text-sm font-bold flex items-center gap-1 shadow-lg">
              <Award size={16} />
              Pemenang
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-black">{auction.auction.itemName}</h3>

          {/* Bid Info */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Mulai dari {formatPrice(auction.auction.startPrice)}</p>
            <p className="text-sm text-gray-600">Bid Tertinggi {formatPrice(auction.currentHighestBid)}</p>

            {/* User's Bid Info */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Bid Anda</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-blue-600">Tertinggi</p>
                  <p className="font-semibold text-blue-900">{formatPrice(userHighestBid)}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Total Bid</p>
                  <p className="font-semibold text-blue-900">{userTotalBids}x</p>
                </div>
              </div>
            </div>

            {/* Winner Status */}
            {isWinner && isAuctionEnded && (
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3 border border-green-200">
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Selamat! Anda Pemenang</p>
                    <p className="text-xs text-green-700">Bid Pemenang: {formatPrice(auction.userBidInfo.highestBid)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Leaderboard Button */}
            <button onClick={() => setIsLeaderboardModalOpen(true)} className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors text-center bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2">
              <Award size={16} />
              Lihat Leaderboard
            </button>

            {/* Confirm Button (only for winners) */}
            {isWinner && isAuctionEnded && (
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                className="w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors text-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white flex items-center justify-center gap-2"
              >
                <Award size={16} />
                Konfirmasi Lelang
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AuctionLeaderboardModal isOpen={isLeaderboardModalOpen} auction={auctionDetailForModal} onClose={() => setIsLeaderboardModalOpen(false)} />

      <AuctionConfirmModal isOpen={isConfirmModalOpen} auction={auction} onClose={() => setIsConfirmModalOpen(false)} onSuccess={onConfirmSuccess} />
    </>
  );
}
