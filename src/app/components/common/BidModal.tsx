"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom"; // <-- DITAMBAH
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, XCircle } from "react-feather";
import { formatCurrency } from "@/lib/utils";
import { AuctionData } from "@/data/auctions";
import { getMediaType, isVideoUrl, getFallbackMedia } from "@/services/auctionService";

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: AuctionData | null;
}

export default function BidModal({ isOpen, onClose, auction }: BidModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [mediaError, setMediaError] = useState(false);

  // TAMBAH STATE isMounted
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Pastikan mount di client
  }, []);

  useEffect(() => {
    if (isOpen && auction) {
      // Pastikan bidAmount adalah string, dan tambahkan 50000 (sesuai logika awal lu)
      setBidAmount((auction.highestBid + 50000).toString());
      setCurrentImageIndex(0);
      setMediaError(false); // Reset media error when opening modal
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
      setMediaError(false); // Reset error when changing media
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setMediaError(false); // Reset error when changing media
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

  const renderCurrentMedia = () => {
    if (!auction || !auction.images || auction.images.length === 0) {
      return <Image src="/images/koi/contoh_ikan.png" alt={auction?.title || "Auction item"} fill className="object-cover" />;
    }

    const currentMediaUrl = auction.images[currentImageIndex];
    const isVideo = isVideoUrl(currentMediaUrl);

    // If media error, always show fallback image
    if (mediaError) {
      return <Image src="/images/koi/contoh_ikan.png" alt={auction.title} fill className="object-cover" />;
    }

    if (isVideo) {
      return (
        <video
          src={currentMediaUrl}
          className="w-full h-full object-cover"
          controls={true}
          muted
          onError={() => {
            console.warn(`Video failed to load: ${currentMediaUrl}`);
            setMediaError(true);
          }}
        />
      );
    } else {
      return (
        <Image
          src={currentMediaUrl}
          alt={`${auction.title} - Media ${currentImageIndex + 1}`}
          fill
          className="object-cover"
          onError={() => {
            console.warn(`Image failed to load: ${currentMediaUrl}`);
            setMediaError(true);
          }}
        />
      );
    }
  };

  if (!isOpen || !auction) return null;
  // TAMBAH CEK isMounted
  if (!isMounted) return null;

  // WRAP DENGAN createPortal
  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 sm:p-6" onClick={handleOverlayClick}>
      <div
        className="bg-white rounded-2xl relative animate-in fade-in-0 zoom-in-95 duration-200
  w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
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

          {/* Media Carousel */}
          <div className="relative">
            <div className="relative h-64 rounded-lg overflow-hidden">
              {renderCurrentMedia()}

              {/* Navigation Arrows */}
              {auction.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#FFE6E6] text-[#FD0001] cursor-pointer rounded-full p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === auction.images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#FFE6E6] text-[#FD0001] cursor-pointer rounded-full p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <button type="submit" className="w-full cursor-pointer bg-primary hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              BID Sekarang
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body // TARGET PORTAL
  );
}
