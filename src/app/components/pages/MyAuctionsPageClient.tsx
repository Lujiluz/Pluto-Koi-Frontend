"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getMyAuctions, AuctionWithBidStatus } from "@/services/auctionActivityService";
import UserAuctionCard from "../common/UserAuctionCard";
import Footer from "../layout/public/Footer";
import { Award, User, Mail, RefreshCw, AlertCircle, ArrowLeft, Search, Grid, List as ListIcon } from "react-feather";
import Link from "next/link";

type BidStatusFilter = "all" | "winning" | "outbid";
type ViewMode = "grid" | "list";

export default function MyAuctionsPageClient() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [bidStatusFilter, setBidStatusFilter] = useState<BidStatusFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Fetch my auctions
  const {
    data: auctionsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["myAuctions", currentPage],
    queryFn: () => getMyAuctions(currentPage, 9),
    enabled: isAuthenticated,
    staleTime: 30000, // 30 seconds
  });

  const handleConfirmSuccess = () => {
    // Refetch auctions after successful confirmation
    refetch();
  };

  // Helper function to check if user is the highest bidder
  // We compare user's highest bid with the current highest bid of the auction
  const isUserHighestBidder = (item: AuctionWithBidStatus): boolean => {
    return item.userBidInfo.highestBid >= item.currentHighestBid && item.userBidInfo.highestBid > 0;
  };

  // Filter auctions based on bid status
  const filteredAuctions = useMemo(() => {
    if (!auctionsData?.data?.auctions) return [];

    const auctions = auctionsData.data.auctions;

    switch (bidStatusFilter) {
      case "winning":
        return auctions.filter((item: AuctionWithBidStatus) => isUserHighestBidder(item));
      case "outbid":
        return auctions.filter((item: AuctionWithBidStatus) => !isUserHighestBidder(item));
      default:
        return auctions;
    }
  }, [auctionsData?.data?.auctions, bidStatusFilter]);

  // Count for filter badges
  const filterCounts = useMemo(() => {
    if (!auctionsData?.data?.auctions) return { all: 0, winning: 0, outbid: 0 };

    const auctions = auctionsData.data.auctions;
    const winning = auctions.filter((item: AuctionWithBidStatus) => isUserHighestBidder(item)).length;
    const outbid = auctions.filter((item: AuctionWithBidStatus) => !isUserHighestBidder(item)).length;

    return {
      all: auctions.length,
      winning,
      outbid,
    };
  }, [auctionsData?.data?.auctions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/lelang" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft size={20} />
              <span>Kembali ke Lelang</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <Award size={32} className="text-primary" />
            <h1 className="text-responsive-3xl font-bold text-black">
              Lelang <span className="text-primary">Saya</span>
            </h1>
          </div>

          <p className="text-gray-600 text-lg">{isAuthenticated ? `Lihat semua lelang yang Anda ikuti, ${user?.name}` : "Silakan login untuk melihat riwayat lelang Anda"}</p>
        </div>

        {isAuthenticated ? (
          // Authenticated User - Show My Auctions
          <div className="space-y-4">
            {/* User Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail size={16} />
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Auctions List */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 bg-gray-50">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Award size={24} />
                      Lelang yang Saya Ikuti
                    </h2>
                    <div className="flex items-center gap-3">
                      {/* View Mode Toggle */}
                      <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`} title="Tampilan Grid">
                          <Grid size={16} />
                        </button>
                        <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`} title="Tampilan List">
                          <ListIcon size={16} />
                        </button>
                      </div>
                      <button onClick={() => refetch()} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        Refresh
                      </button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setBidStatusFilter("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${bidStatusFilter === "all" ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"}`}
                    >
                      Semua ({filterCounts.all})
                    </button>
                    <button
                      onClick={() => setBidStatusFilter("winning")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${bidStatusFilter === "winning" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"}`}
                    >
                      🏆 Tertinggi ({filterCounts.winning})
                    </button>
                    <button
                      onClick={() => setBidStatusFilter("outbid")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${bidStatusFilter === "outbid" ? "bg-red-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"}`}
                    >
                      ⚠️ Terlampaui ({filterCounts.outbid})
                    </button>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="p-12 text-center">
                  <RefreshCw size={32} className="mx-auto text-primary animate-spin mb-4" />
                  <p className="text-gray-600">Memuat lelang...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
                  <p className="text-red-600 mb-4">Gagal memuat lelang</p>
                  <button onClick={() => refetch()} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Coba Lagi
                  </button>
                </div>
              ) : !auctionsData?.data?.auctions || auctionsData.data.auctions.length === 0 ? (
                <div className="p-12 text-center">
                  <Award size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Lelang</h3>
                  <p className="text-gray-600 mb-6">Anda belum mengikuti lelang apapun. Mulai bid sekarang!</p>
                  <Link href="/lelang" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <Search size={16} />
                    Lihat Lelang
                  </Link>
                </div>
              ) : filteredAuctions.length === 0 ? (
                <div className="p-12 text-center">
                  <Award size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{bidStatusFilter === "winning" ? "Tidak Ada Lelang dengan Bid Tertinggi" : "Tidak Ada Lelang yang Terkalahkan"}</h3>
                  <p className="text-gray-600 mb-6">{bidStatusFilter === "winning" ? "Anda belum menjadi penawar tertinggi di lelang manapun." : "Selamat! Anda masih menjadi penawar tertinggi di semua lelang."}</p>
                  <button onClick={() => setBidStatusFilter("all")} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Lihat Semua Lelang
                  </button>
                </div>
              ) : (
                <>
                  {/* Auctions Grid/List */}
                  <div className="p-6">
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                      {filteredAuctions.map((auctionItem: AuctionWithBidStatus) => (
                        <UserAuctionCard key={auctionItem.auction._id} auction={auctionItem} onConfirmSuccess={handleConfirmSuccess} viewMode={viewMode} />
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  {auctionsData.data.metadata && auctionsData.data.metadata.totalPages > 1 && (
                    <div className="p-6 border-t bg-gray-50">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={!auctionsData.data.metadata.hasPreviousPage}
                          className="px-3 py-2 text-sm bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Sebelumnya
                        </button>

                        <span className="px-4 py-2 text-sm text-gray-600">
                          Halaman {currentPage} dari {auctionsData.data.metadata.totalPages}
                        </span>

                        <button
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={!auctionsData.data.metadata.hasNextPage}
                          className="px-3 py-2 text-sm bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                          Selanjutnya
                        </button>
                      </div>

                      <div className="text-center mt-2 text-sm text-gray-500">Total {auctionsData.data.metadata.totalItems} lelang</div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award size={24} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">Tips untuk Pemenang Lelang</h3>
                  <ul className="text-yellow-800 text-sm space-y-1 list-disc list-inside">
                    <li>Konfirmasi kemenangan Anda segera setelah lelang berakhir</li>
                    <li>Upload bukti pembayaran dengan jelas dan lengkap</li>
                    <li>Hubungi admin melalui WhatsApp untuk konfirmasi pengiriman</li>
                    <li>Simpan bukti transfer untuk referensi di kemudian hari</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Guest User - Show Login Prompt
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-xl p-12 border border-blue-200 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User size={40} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Login Diperlukan</h3>
              <p className="text-blue-800 mb-6">Anda harus login untuk melihat riwayat lelang yang Anda ikuti. Daftarkan akun atau login untuk melanjutkan.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/lelang" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Search size={16} />
                  Lihat Lelang
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
