"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency, getTimeRemaining } from "@/lib/utils";
import { AuctionData } from "@/data/auctions";
import { BackendAuction } from "@/lib/types";
import { getAuctionStatus, formatPrice, getTimeRemaining as getTimeRemainingFromService, getTimeRemainingObject, getMediaType, isVideoUrl, getFallbackMedia } from "@/services/auctionService";
import { WishlistButton } from "../icons/WishlistIcon";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";

interface AuctionCardProps {
  auction: AuctionData | BackendAuction;
}

// Type guard to check if auction is from backend
const isBackendAuction = (auction: AuctionData | BackendAuction): auction is BackendAuction => {
  return "_id" in auction;
};

export default function AuctionCard({ auction }: AuctionCardProps) {
  const [mediaError, setMediaError] = useState(false);
  const { isAuthenticated } = useAuth();
  const { isInWishlist, addItemToWishlist, removeItemFromWishlist, isAddingToWishlist, isRemovingFromWishlist } = useWishlist();

  // Normalize auction data based on type
  const normalizedAuction = isBackendAuction(auction)
    ? {
        id: auction._id,
        title: auction.itemName,
        images: auction.media.map((media) => media.fileUrl),
        startingPrice: auction.startPrice,
        highestBid: auction.currentHighestBid || 0,
        bidCount: auction.currentWinner ? 1 : 0, // You might want to get actual bid count from another endpoint
        endTime: auction.endDate,
        status: getAuctionStatus(auction.startDate, auction.endDate),
        currentPrice: auction.currentHighestBid || auction.startPrice,
      }
    : auction;

  const [timeRemaining, setTimeRemaining] = useState(isBackendAuction(auction) ? getTimeRemainingObject(auction.endDate) : getTimeRemaining(auction.endTime));

  useEffect(() => {
    // Reset media error when auction changes
    setMediaError(false);

    const timer = setInterval(() => {
      if (isBackendAuction(auction)) {
        setTimeRemaining(getTimeRemainingObject(auction.endDate));
      } else {
        setTimeRemaining(getTimeRemaining(auction.endTime));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  const getStatusBadge = () => {
    if (isBackendAuction(auction)) {
      const status = getAuctionStatus(auction.startDate, auction.endDate);

      if (status === "completed" || timeRemaining.isExpired) {
        return <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-md text-sm font-medium">Lelang Selesai</div>;
      }

      if (status === "ending-soon" || timeRemaining.hours < 1) {
        return <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium">Segera Berakhir</div>;
      }

      return (
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-md text-sm font-medium">
          Berakhir dalam {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
        </div>
      );
    } else {
      // Original logic for mock data using timeRemaining state
      if (timeRemaining.isExpired) {
        return <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-md text-sm font-medium">Lelang Selesai</div>;
      }

      if (timeRemaining.hours < 1) {
        return <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium">Segera Berakhir</div>;
      }

      return (
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-md text-sm font-medium">
          Berakhir dalam {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
        </div>
      );
    }
  };

  const isAuctionEnded = isBackendAuction(auction) ? getAuctionStatus(auction.startDate, auction.endDate) === "completed" || timeRemaining.isExpired : timeRemaining.isExpired;

  const formatPriceDisplay = (price: number) => {
    return isBackendAuction(auction) ? formatPrice(price) : formatCurrency(price);
  };

  // Wishlist functionality
  const itemInWishlist = isInWishlist(normalizedAuction.id, "auction");
  const isWishlistLoading = isAddingToWishlist || isRemovingFromWishlist;

  const handleWishlistToggle = async () => {
    try {
      if (itemInWishlist) {
        await removeItemFromWishlist(normalizedAuction.id, "auction");
      } else {
        await addItemToWishlist(normalizedAuction.id, "auction");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const getImageSrc = () => {
    const images = normalizedAuction.images;
    return images && images.length > 0 ? images[0] : "/images/koi/contoh_ikan.png";
  };

  const getFirstMediaUrl = () => {
    const images = normalizedAuction.images;
    return images && images.length > 0 ? images[0] : "/images/koi/contoh_ikan.png";
  };

  const renderMedia = () => {
    const mediaUrl = getFirstMediaUrl();
    const isVideo = isVideoUrl(mediaUrl);

    // If media error, always show fallback image
    if (mediaError) {
      return <Image src="/images/koi/contoh_ikan.png" alt={normalizedAuction.title} fill className="object-cover rounded-lg" />;
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
          alt={normalizedAuction.title}
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

  return (
    <div className="card-hover overflow-hidden">
      {/* Media (Image or Video) */}
      <div className="relative h-48 mb-4">
        {renderMedia()}
        {getStatusBadge()}

        {/* Wishlist Button */}
        <div className="absolute top-4 right-4">
          <WishlistButton isInWishlist={itemInWishlist} isLoading={isWishlistLoading} onToggle={handleWishlistToggle} size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-black">{normalizedAuction.title}</h3>

        {/* Price Info */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Mulai dari {formatPriceDisplay(normalizedAuction.startingPrice)}</p>
          <p className="text-sm text-gray-600">Bid Tertinggi {formatPriceDisplay(normalizedAuction.highestBid)}</p>
          {isBackendAuction(auction) && auction.currentWinner ? (
            <p className="text-sm text-gray-600">Pemenang Sementara: {auction.currentWinner.userId.name}</p>
          ) : (
            <p className="text-sm text-gray-600">Bid : {normalizedAuction.bidCount.toLocaleString("id-ID")} orang</p>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/lelang/${normalizedAuction.id}`} className="block w-full py-3 px-4 rounded-lg font-medium text-sm transition-colors text-center bg-primary hover:bg-primary-600 text-white">
          Detail
        </Link>
      </div>
    </div>
  );
}
