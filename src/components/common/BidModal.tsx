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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div ref={modalRef} className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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

          {/* Image Carousel */}
          <div className="relative">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image src={auction.images[currentImageIndex] || "/images/placeholder-koi.jpg"} alt={`${auction.title} - Image ${currentImageIndex + 1}`} fill className="object-cover" />

              {/* Navigation Arrows */}
              {auction.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={currentImageIndex === auction.images.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Image Indicators */}
            {auction.images.length > 1 && (
              <div className="flex justify-center mt-3 space-x-2">
                {auction.images.map((_, index) => (
                  <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? "bg-primary" : "bg-gray-300"}`} />
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
