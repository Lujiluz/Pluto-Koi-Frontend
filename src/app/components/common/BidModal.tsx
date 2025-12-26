"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, XCircle } from "react-feather";
import { formatCurrency } from "@/lib/utils";
import { AuctionData } from "@/data/auctions";
import { getMediaType, isVideoUrl, getFallbackMedia } from "@/services/auctionService";
import { placeBid, validateBidAmount } from "@/services/auctionActivityService";
import { useToast } from "@/components/common/Toast";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: AuctionData | null;
  onSuccess?: () => void; // Callback to refresh auction data after successful bid
}

// Japanese pattern SVG as background for empty space
const JapanesePatternBg = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50">
    <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="seigaiha-bid" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
          {/* Seigaiha (wave) pattern - traditional Japanese */}
          <path d="M0 20 Q10 10 20 20 Q30 10 40 20" fill="none" stroke="#c53030" strokeWidth="0.5" opacity="0.4" />
          <path d="M0 15 Q10 5 20 15 Q30 5 40 15" fill="none" stroke="#c53030" strokeWidth="0.5" opacity="0.3" />
          <path d="M0 10 Q10 0 20 10 Q30 0 40 10" fill="none" stroke="#c53030" strokeWidth="0.5" opacity="0.2" />
        </pattern>
        <pattern id="asanoha-bid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          {/* Asanoha (hemp leaf) pattern */}
          <path d="M12 0 L12 12 M0 12 L12 12 M24 12 L12 12 M12 24 L12 12 M0 0 L12 12 M24 0 L12 12 M0 24 L12 12 M24 24 L12 12" fill="none" stroke="#c53030" strokeWidth="0.3" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#seigaiha-bid)" />
      <rect width="100%" height="100%" fill="url(#asanoha-bid)" opacity="0.5" />
    </svg>
    {/* Decorative koi silhouette */}
    <div className="absolute bottom-2 right-2 opacity-10">
      <Image src="/images/LOGO PLUTO-01.png" alt="Koi Silhouette" width={60} height={40} />
    </div>
  </div>
);

export default function BidModal({ isOpen, onClose, auction, onSuccess }: BidModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [mediaError, setMediaError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  // TAMBAH STATE isMounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Pastikan mount di client
  }, []);

  useEffect(() => {
    if (isOpen && auction) {
      // Set default bid amount hanya sekali pas modal dibuka
      const defaultBidAmount = (auction.highestBid + 50000).toString();
      setBidAmount(defaultBidAmount);
      setCurrentImageIndex(0);
      setMediaError(false); // Reset media error when opening modal
    } else if (!isOpen) {
      // Reset bidAmount saat modal ditutup
      setBidAmount("");
    }
  }, [isOpen]);

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
      setMediaError(false); // Reset error when changing media
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setMediaError(false); // Reset error when changing media
    }
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!auction) {
      setError("Informasi lelang tidak ditemukan");
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert bidAmount to number
      const numericBidAmount = parseInt(bidAmount.replace(/\D/g, ""));

      // Validate bid amount
      const validationError = validateBidAmount(numericBidAmount, auction.highestBid);
      if (validationError) {
        setError(validationError);
        showToast({
          type: "error",
          title: "Validasi Gagal",
          message: validationError,
        });
        setIsSubmitting(false);
        return;
      }

      // Place bid
      const response = await placeBid({
        auctionId: auction.id,
        bidAmount: numericBidAmount,
        bidType: "initial",
      });

      if (response.status === "success") {
        showToast({
          type: "success",
          title: "Bid Berhasil!",
          message: `Bid Anda sebesar ${formatCurrency(numericBidAmount)} berhasil ditempatkan.`,
        });

        // Reset form and close modal
        setBidAmount("");
        setError("");
        onClose();

        // Trigger callback to refresh auction data
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error("Error submitting bid:", err);
      const errorMessage = err.message || "Terjadi kesalahan saat menempatkan bid";
      setError(errorMessage);
      showToast({
        type: "error",
        title: "Bid Gagal",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatBidAmount = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleBidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setBidAmount(value);
  };

  const renderCurrentMedia = () => {
    if (!auction || !auction.images || auction.images.length === 0) {
      return (
        <>
          <JapanesePatternBg />
          <Image src="/images/koi/contoh_ikan.png" alt={auction?.title || "Auction item"} fill className="object-contain z-10" />
        </>
      );
    }

    const currentMediaUrl = auction.images[currentImageIndex];
    const isVideo = isVideoUrl(currentMediaUrl);

    // If media error, always show fallback image
    if (mediaError) {
      return (
        <>
          <JapanesePatternBg />
          <Image src="/images/koi/contoh_ikan.png" alt={auction.title} fill className="object-contain z-10" />
        </>
      );
    }

    if (isVideo) {
      return (
        <>
          <JapanesePatternBg />
          <video
            src={currentMediaUrl}
            className="absolute inset-0 w-full h-full object-contain z-10"
            controls={true}
            muted
            playsInline
            onError={() => {
              console.warn(`Video failed to load: ${currentMediaUrl}`);
              setMediaError(true);
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <JapanesePatternBg />
          <Image
            src={currentMediaUrl}
            alt={`${auction.title} - Media ${currentImageIndex + 1}`}
            fill
            className="object-contain z-10"
            onError={() => {
              console.warn(`Image failed to load: ${currentMediaUrl}`);
              setMediaError(true);
            }}
          />
        </>
      );
    }
  };

  if (!isOpen || !auction) return null;
  // TAMBAH CEK isMounted
  if (!isMounted) return null;

  // WRAP DENGAN createPortal
  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 sm:p-6" onClick={handleOverlayClick} data-testid="bid-modal-overlay">
      <div
        className="bg-white rounded-2xl relative animate-in fade-in-0 zoom-in-95 duration-200
  w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
        data-testid="bid-modal"
        role="dialog"
        aria-modal="true"
      >
        {/* Tombol Close Fix */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 z-10 bg-white hover:bg-gray-100 rounded-full transition-colors shadow-md border border-gray-100">
          {/* Ganti ikon kembali ke X biasa biar konsisten dengan modal lain */}
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pt-6 pl-6 pr-14">
          {" "}
          {/* Atur padding biar nggak ketimpa tombol X */}
          <h2 className="text-2xl font-semibold text-black">Masukkan Tawaran Anda</h2>
          {/* Hapus tombol X lama dari sini */}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-600 text-md">Silakan masukkan nominal BID</p>

          {/* Media Carousel with 3:2 Aspect Ratio */}
          <div className="relative">
            <div className="relative w-full rounded-lg overflow-hidden" style={{ aspectRatio: "3/2" }}>
              {renderCurrentMedia()}

              {/* Navigation Arrows */}
              {auction.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#FFE6E6] text-[#FD0001] cursor-pointer rounded-full p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === auction.images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FFE6E6] text-[#FD0001] cursor-pointer rounded-full p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-20"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Media Indicators */}
            {auction.images.length > 1 && (
              <div className="flex justify-center mt-3 space-x-2">
                {auction.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setMediaError(false); // Reset error when changing media
                    }}
                    className={`w-2 h-2 rounded-full transition duration-500 ${index === currentImageIndex ? "bg-primary w-6" : "bg-gray-300"}`}
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
              <span className="font-semibold text-black/80">Bid Tertinggi {formatCurrency(auction.highestBid)}</span>
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${error ? "border-red-500" : "border-gray-300"}`}
                disabled={isSubmitting}
                required
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !bidAmount}
              className="w-full cursor-pointer bg-primary hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses BID...
                </>
              ) : (
                "BID Sekarang"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body // TARGET PORTAL
  );
}
