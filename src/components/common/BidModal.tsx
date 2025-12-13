"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "react-feather";
import { formatCurrency } from "@/lib/utils";
import { AuctionData } from "@/data/auctions";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: AuctionData | null;
}

// Japanese pattern SVG as background for empty space
const JapanesePatternBg = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50">
    <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="seigaiha" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
          {/* Seigaiha (wave) pattern - traditional Japanese */}
          <path d="M0 20 Q10 10 20 20 Q30 10 40 20" fill="none" stroke="#c53030" strokeWidth="0.5" opacity="0.4" />
          <path d="M0 15 Q10 5 20 15 Q30 5 40 15" fill="none" stroke="#c53030" strokeWidth="0.5" opacity="0.3" />
          <path d="M0 10 Q10 0 20 10 Q30 0 40 10" fill="none" stroke="#c53030" strokeWidth="0.5" opacity="0.2" />
        </pattern>
        <pattern id="asanoha" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          {/* Asanoha (hemp leaf) pattern */}
          <path d="M12 0 L12 12 M0 12 L12 12 M24 12 L12 12 M12 24 L12 12 M0 0 L12 12 M24 0 L12 12 M0 24 L12 12 M24 24 L12 12" fill="none" stroke="#c53030" strokeWidth="0.3" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#seigaiha)" />
      <rect width="100%" height="100%" fill="url(#asanoha)" opacity="0.5" />
    </svg>
    {/* Decorative koi silhouette */}
    <div className="absolute bottom-2 right-2 opacity-10">
      <svg width="60" height="40" viewBox="0 0 60 40" fill="#c53030">
        <ellipse cx="25" cy="20" rx="20" ry="12" />
        <path d="M45 20 Q55 10 58 20 Q55 30 45 20" />
        <circle cx="12" cy="17" r="2" fill="#fff" opacity="0.5" />
      </svg>
    </div>
  </div>
);

// Helper function to check if media is video
const isVideoFile = (url: string): boolean => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
  const lowercaseUrl = url.toLowerCase();
  return videoExtensions.some((ext) => lowercaseUrl.includes(ext));
};

export default function BidModal({ isOpen, onClose, auction }: BidModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && auction) {
      setBidAmount((auction.highestBid + 50000).toString());
      setCurrentImageIndex(0);
    }
  }, [isOpen, auction]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const nextImage = () => {
    if (auction && currentImageIndex < auction.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the bid to your backend
    console.log("Submitting bid:", bidAmount);
    // Show success message or handle response
    onClose();
  };

  const formatBidAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setBidAmount(value);
  };

  if (!isOpen || !auction) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6" onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 sm:p-8 relative animate-in fade-in-0 zoom-in-95 duration-200
  w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-black">Masukkan Tawaran Anda</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600 text-sm">Silakan masukkan nominal BID</p>

          {/* Image/Video Carousel with 3:2 Aspect Ratio */}
          <div className="relative">
            {/* 3:2 aspect ratio container with Japanese pattern background */}
            <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: "3/2" }}>
              {/* Japanese pattern background for empty space */}
              <JapanesePatternBg />

              {/* Media container - centered with object-contain */}
              {isVideoFile(auction.images[currentImageIndex] || "") ? (
                <video key={currentImageIndex} src={auction.images[currentImageIndex]} className="absolute inset-0 w-full h-full object-contain z-10" controls playsInline preload="metadata" />
              ) : (
                <Image
                  src={auction.images[currentImageIndex] || "/images/placeholder-koi.jpg"}
                  alt={`${auction.title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain z-10"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}

              {/* Navigation Arrows */}
              {auction.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === auction.images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Image/Video Indicators */}
            {auction.images.length > 1 && (
              <div className="flex justify-center mt-3 space-x-2">
                {auction.images.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors relative ${index === currentImageIndex ? "bg-primary" : "bg-gray-300"}`}
                    title={isVideoFile(media) ? "Video" : "Image"}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Auction Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-black">{auction.title}</h3>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bid : {auction.bidCount.toLocaleString("id-ID")} orang</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mulai dari {formatCurrency(auction.startingPrice)}</span>
              <span className="font-semibold text-black">Bid Tertinggi {formatCurrency(auction.highestBid)}</span>
            </div>
          </div>

          {/* Bid Form */}
          <form onSubmit={handleBidSubmit} className="space-y-4">
            <div>
              <label htmlFor="bidAmount" className="block text-sm font-medium text-black mb-2">
                Nilai BID
              </label>
              <input
                type="text"
                id="bidAmount"
                value={formatBidAmount(bidAmount)}
                onChange={handleBidChange}
                placeholder="Rp 1.300.000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <button type="submit" className="w-full bg-primary hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              BID Sekarang
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
