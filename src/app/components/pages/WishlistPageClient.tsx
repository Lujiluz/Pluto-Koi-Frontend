"use client";

import { useState, useEffect } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { WishlistItem } from "@/lib/types";
import AuctionCard from "@/app/components/common/AuctionCard";
import { RefreshCw, AlertCircle, Heart, Trash2 } from "react-feather";
import Link from "next/link";
import Footer from "@/app/components/layout/public/Footer";

export default function WishlistPageClient() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { auctionItems, isLoading, error, removeItemFromWishlist, clearUserWishlist, refreshWishlist, isRemovingFromWishlist } = useWishlist();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleRefresh = () => {
    refreshWishlist();
  };

  const handleClearWishlist = async () => {
    const success = await clearUserWishlist();
    if (success) {
      setShowClearConfirm(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItemFromWishlist(itemId, "auction");
  };

  // Convert wishlist items to auction format for AuctionCard
  const convertWishlistToAuction = (item: WishlistItem) => ({
    _id: item.itemId,
    itemName: item.itemData.itemName,
    startPrice: item.itemData.price,
    endPrice: item.itemData.price,
    startDate: new Date().toISOString(), // Placeholder
    endDate: new Date().toISOString(), // Placeholder
    highestBid: item.itemData.price,
    media: [{ fileUrl: item.itemData.imageUrl, _id: "1" }],
    createdAt: item.addedAt,
    updatedAt: item.addedAt,
    __v: 0,
    currentHighestBid: item.itemData.price,
    currentWinner: null,
  });

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-24">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-24">
          <div className="text-center">
            <Heart className="mx-auto mb-6 text-gray-300" size={64} />
            <h1 className="text-responsive-3xl font-bold text-black mb-6">
              <span className="text-primary">Wishlist</span> Saya
            </h1>
            <p className="text-responsive-lg text-gray-600 mb-8 max-w-2xl mx-auto">Anda perlu masuk untuk melihat daftar keinginan Anda. Simpan lelang favorit dan kelola dengan mudah.</p>
            <div className="space-y-4">
              <Link href="/" className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
                Masuk Sekarang
              </Link>
              <p className="text-sm text-gray-500">
                Belum punya akun?{" "}
                <Link href="/" className="text-primary hover:underline cursor-pointer">
                  Daftar di sini
                </Link>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading state while fetching wishlist data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-custom py-24">
          <div className="text-center">
            <h1 className="text-responsive-3xl font-bold text-black mb-6">
              <span className="text-primary">Wishlist</span> Saya
            </h1>
            <div className="flex justify-center mb-4">
              <RefreshCw className="animate-spin text-primary" size={32} />
            </div>
            <p className="text-gray-600">Memuat wishlist...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container-custom py-24 px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-responsive-3xl font-bold text-black mb-6">
            <span className="text-primary">Wishlist</span> Saya
          </h1>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">Kelola daftar keinginan Anda untuk lelang ikan koi terbaik. Pantau item favorit dan jangan lewatkan kesempatan untuk mendapatkannya.</p>

          {auctionItems.length > 0 && <div className="mt-6 text-sm text-gray-600">{auctionItems.length} item dalam wishlist</div>}
        </div>

        {/* Action Bar */}
        {auctionItems.length > 0 && (
          <div className="mb-8 flex justify-between items-center">
            <button onClick={handleRefresh} disabled={isLoading} className="flex items-center px-4 py-2 text-gray-600 hover:text-primary transition-colors cursor-pointer disabled:opacity-50" title="Refresh wishlist">
              <RefreshCw size={20} className={isLoading ? "animate-spin mr-2" : "mr-2"} />
              Refresh
            </button>

            <button onClick={() => setShowClearConfirm(true)} className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 transition-colors cursor-pointer" title="Hapus semua item">
              <Trash2 size={20} className="mr-2" />
              Hapus Semua
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="flex justify-center items-center space-x-3 text-red-500 mb-4">
              <AlertCircle size={24} />
              <p>{error}</p>
            </div>
            <button onClick={handleRefresh} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {auctionItems.length === 0 && !error && (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Wishlist Anda Kosong</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Mulai jelajahi lelang ikan koi dan tambahkan item favorit Anda ke wishlist. Dengan wishlist, Anda dapat dengan mudah melacak lelang yang menarik minat Anda.</p>
            <Link href="/lelang" className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
              Jelajahi Lelang
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        {auctionItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {auctionItems.map((item) => (
              <div key={item.itemId} className="relative">
                <AuctionCard auction={convertWishlistToAuction(item)} />

                {/* Remove from wishlist button */}
                <button
                  onClick={() => handleRemoveItem(item.itemId)}
                  disabled={isRemovingFromWishlist}
                  className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Hapus dari wishlist"
                >
                  <Trash2 size={16} />
                </button>

                {/* Added date */}
                <div className="mt-2 text-xs text-gray-500 text-center">Ditambahkan {new Date(item.addedAt).toLocaleDateString("id-ID")}</div>
              </div>
            ))}
          </div>
        )}

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Hapus Semua</h3>
              <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus semua item dari wishlist? Tindakan ini tidak dapat dibatalkan.</p>
              <div className="flex space-x-3">
                <button onClick={() => setShowClearConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  Batal
                </button>
                <button onClick={handleClearWishlist} disabled={isLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer">
                  {isLoading ? "Menghapus..." : "Hapus Semua"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
