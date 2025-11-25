"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getMyAuctions } from "@/services/auctionActivityService";
import UserAuctionCard from "../common/UserAuctionCard";
import Footer from "../layout/public/Footer";
import { Award, User, Mail, RefreshCw, AlertCircle, ArrowLeft, Search } from "react-feather";
import Link from "next/link";

export default function MyAuctionsPageClient() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

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
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border">
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
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Award size={24} />
                    Lelang yang Saya Ikuti
                  </h2>
                  <button onClick={() => refetch()} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                    <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                    Refresh
                  </button>
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
              ) : (
                <>
                  {/* Auctions Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {auctionsData.data.auctions.map((auctionItem) => (
                        <UserAuctionCard key={auctionItem.auction._id} auction={auctionItem} onConfirmSuccess={handleConfirmSuccess} />
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
