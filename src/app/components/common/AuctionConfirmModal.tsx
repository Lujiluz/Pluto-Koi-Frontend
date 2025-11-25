"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, Upload, X } from "react-feather";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/common/Toast";
import { confirmAuctionWin, validatePaymentProof } from "@/services/auctionActivityService";
import { AuctionWithBidStatus } from "@/services/auctionActivityService";
import { WHATSAPP_TEMPLATES } from "@/lib/constants";

interface AuctionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: AuctionWithBidStatus | null;
  onSuccess?: () => void;
}

export default function AuctionConfirmModal({ isOpen, onClose, auction, onSuccess }: AuctionConfirmModalProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = originalStyle;
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  const resetForm = () => {
    setPaymentProof(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPaymentProof(file);

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!auction) {
      setError("Auction information is missing");
      setIsSubmitting(false);
      return;
    }

    try {
      // Validate payment proof
      const validationError = validatePaymentProof(paymentProof);
      if (validationError) {
        setError(validationError);
        setIsSubmitting(false);
        return;
      }

      // Confirm auction win
      const response = await confirmAuctionWin({
        auctionId: auction.auction._id,
        paymentProof: paymentProof!,
      });

      if (response.success) {
        console.log("Auction confirmation successful:", response.data);

        // Prepare WhatsApp message with payment proof info
        const whatsappMessage = WHATSAPP_TEMPLATES.auctionWinConfirmation(auction.auction.itemName, user?.name || "User");

        // Get WhatsApp number from environment or use default
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6285780004878";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

        showToast({
          type: "success",
          title: "Konfirmasi Berhasil!",
          message: "Anda akan diarahkan ke WhatsApp untuk mengirim bukti pembayaran.",
        });

        resetForm();
        onClose();
        onSuccess?.();

        // Redirect to WhatsApp after a short delay
        setTimeout(() => {
          window.open(whatsappUrl, "_blank");
        }, 1500);
      } else {
        setError("Konfirmasi gagal. Silakan coba lagi.");
      }
    } catch (error: any) {
      console.error("Confirmation error:", error);
      setError(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !auction) return null;
  if (!isMounted) return null;

  const winningBid = auction.userBidInfo.highestBid;
  const bankPayment = process.env.NEXT_PUBLIC_BANK_PAYMENT || "BCA";
  const paymentAccountNumber = process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER || "1234567890";
  const paymentName = process.env.NEXT_PUBLIC_PAYMENT_NAME || "Pluto Koi";

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={handleBackdropClick}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative animate-in fade-in-0 zoom-in-95 duration-200 overflow-y-auto max-h-[90vh] no-scrollbar" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 z-10 bg-white hover:bg-gray-100 rounded-full transition-colors shadow-md border border-gray-100">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6 pt-1">
          <h2 className="text-xl md:text-2xl leading-tight font-bold mb-2">Konfirmasi Kemenangan Lelang</h2>
          <p className="text-gray-600 text-sm">Selamat! Anda memenangkan lelang kali ini.</p>
        </div>

        {/* Auction Info */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 mb-6 border border-green-200">
          <div className="flex gap-4">
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={auction.auction.media?.[0]?.fileUrl || "/images/koi/contoh_ikan.png"} alt={auction.auction.itemName} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{auction.auction.itemName}</h3>
                  <p className="text-xs text-green-700">🏆 Pemenang Lelang</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-600">Bid Pemenang</p>
                  <p className="text-sm md:text-lg font-bold text-green-700">{formatCurrency(winningBid)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <AlertCircle size={18} />
            Instruksi Pembayaran
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>Silakan lakukan pembayaran melalui rekening berikut:</p>
            <div className="bg-white rounded-lg p-3 border border-blue-200">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-600">Bank</p>
                  <p className="font-semibold">{bankPayment}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Nomor Rekening</p>
                  <p className="font-semibold font-mono">{paymentAccountNumber}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-600">Atas Nama</p>
                  <p className="font-semibold">{paymentName}</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-blue-200">
                  <p className="text-xs text-gray-600">Jumlah Transfer</p>
                  <p className="font-bold text-lg text-green-700">{formatCurrency(winningBid)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Payment Proof Upload */}
          <div>
            <label htmlFor="paymentProof" className="block text-sm font-medium mb-2">
              Bukti Pembayaran <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${error ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">{paymentProof ? `File dipilih: ${paymentProof.name}` : "Klik untuk upload bukti pembayaran"}</p>
              <p className="text-xs text-gray-500">Format yang didukung: JPG, PNG, WebP (Max 5MB)</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" required />
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <p className="text-xs text-yellow-800">
              <span className="font-semibold">Info:</span> Setelah konfirmasi, Anda akan diarahkan ke WhatsApp untuk mengirim bukti pembayaran kepada admin.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/70 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : (
              "Konfirmasi Pembayaran"
            )}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
