"use client";

import { useState, useEffect } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { WishlistItem } from "@/lib/types";
import AuctionCard from "@/app/components/common/AuctionCard";
import ProductCard from "@/app/components/common/ProductCard";
import { RefreshCw, AlertCircle, Heart, Trash2, Package, Archive } from "react-feather";
import Link from "next/link";
import Footer from "@/app/components/layout/public/Footer";

export default function WishlistPageClient() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { wishlistItems, auctionItems, productItems, isLoading, error, removeItemFromWishlist, clearUserWishlist, refreshWishlist, isRemovingFromWishlist } = useWishlist();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "auctions" | "products">("all");

  const handleRefresh = () => {
    refreshWishlist();
  };

  const handleClearWishlist = async () => {
    const success = await clearUserWishlist();
    if (success) {
      setShowClearConfirm(false);
    }
  };

  const handleRemoveItem = async (itemId: string, itemType: "auction" | "product") => {
    await removeItemFromWishlist(itemId, itemType);
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

  // Convert wishlist items to product format for ProductCard
  const convertWishlistToProduct = (item: WishlistItem) => ({
    _id: item.itemId,
    productName: item.itemData.itemName,
    productPrice: item.itemData.price,
    productType: "Produk" as const,
    productCategory: { _id: "", name: "Umum" },
    isActive: true,
    media: [{ fileUrl: item.itemData.imageUrl, _id: "1" }],
    createdAt: item.addedAt,
    updatedAt: item.addedAt,
    __v: 0,
  });

  // Filter items based on active tab
  const getDisplayItems = () => {
    switch (activeTab) {
      case "auctions":
        return auctionItems;
      case "products":
        return productItems;
      default:
        return wishlistItems;
    }
  };

  const displayItems = getDisplayItems();

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
            <p className="text-responsive-lg text-gray-600 mb-8 max-w-2xl mx-auto">Anda perlu masuk untuk melihat daftar keinginan Anda. Simpan lelang dan produk favorit, kelola dengan mudah.</p>
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
        <div className="text-center mb-8">
          <h1 className="text-responsive-3xl font-bold text-black mb-6">
            <span className="text-primary">Wishlist</span> Saya
          </h1>
          <p className="text-responsive-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">Kelola daftar keinginan Anda untuk lelang ikan koi dan produk terbaik. Pantau item favorit dan jangan lewatkan kesempatan untuk mendapatkannya.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 rounded-lg p-1 inline-flex">
            <button onClick={() => setActiveTab("all")} className={`px-6 py-2 rounded-md transition-colors ${activeTab === "all" ? "bg-white shadow-sm text-primary font-medium" : "text-gray-600 hover:text-gray-800"}`}>
              Semua ({wishlistItems.length})
            </button>
            <button
              onClick={() => setActiveTab("auctions")}
              className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${activeTab === "auctions" ? "bg-white shadow-sm text-primary font-medium" : "text-gray-600 hover:text-gray-800"}`}
            >
              <Archive size={16} />
              Lelang ({auctionItems.length})
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${activeTab === "products" ? "bg-white shadow-sm text-primary font-medium" : "text-gray-600 hover:text-gray-800"}`}
            >
              <Package size={16} />
              Produk ({productItems.length})
            </button>
          </div>
        </div>

        {/* Action Bar */}
        {displayItems.length > 0 && (
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

        {/* Empty State */}
        {displayItems.length === 0 && (
          <div className="text-center py-12">
            <Heart size={64} className="mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{activeTab === "all" ? "Wishlist Anda Kosong" : activeTab === "auctions" ? "Tidak Ada Lelang di Wishlist" : "Tidak Ada Produk di Wishlist"}</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {activeTab === "all"
                ? "Mulai jelajahi lelang ikan koi dan produk, tambahkan item favorit Anda ke wishlist."
                : activeTab === "auctions"
                ? "Jelajahi lelang ikan koi dan tambahkan yang menarik ke wishlist Anda."
                : "Jelajahi produk koi berkualitas dan tambahkan yang Anda inginkan ke wishlist."}
            </p>
            <div className="flex gap-4 justify-center">
              {(activeTab === "all" || activeTab === "auctions") && (
                <Link href="/lelang" className="inline-block px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors cursor-pointer">
                  Jelajahi Lelang
                </Link>
              )}
              {(activeTab === "all" || activeTab === "products") && (
                <Link href="/belanja" className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                  Jelajahi Produk
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Wishlist Grid */}
        {displayItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayItems.map((item) => (
              <div key={`${item.itemType}-${item.itemId}`} className="relative">
                {item.itemType === "auction" ? <AuctionCard auction={convertWishlistToAuction(item)} /> : <ProductCard product={convertWishlistToProduct(item)} />}

                {/* Remove from wishlist button */}
                <button
                  onClick={() => handleRemoveItem(item.itemId, item.itemType)}
                  disabled={isRemovingFromWishlist}
                  className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer z-10"
                  title="Hapus dari wishlist"
                >
                  <Trash2 size={16} />
                </button>

                {/* Item type badge */}
                <div className="absolute top-2 right-2 z-10">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.itemType === "auction" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>{item.itemType === "auction" ? "Lelang" : "Produk"}</span>
                </div>

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
