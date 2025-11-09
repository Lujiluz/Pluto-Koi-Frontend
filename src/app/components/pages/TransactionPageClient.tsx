"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMyTransactions } from "@/hooks/useTransactions";
import TrackOrderForm from "../common/TrackOrderForm";
import Footer from "../layout/public/Footer";
import { Package, Clock, User, Mail, Phone, MapPin, RefreshCw, AlertCircle, CheckCircle, ArrowLeft, Search } from "react-feather";
import Link from "next/link";

export default function TransactionPageClient() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  // Only fetch transactions if user is authenticated
  const {
    data: transactionData,
    isLoading,
    error,
    refetch,
  } = useMyTransactions(currentPage, 10, {
    enabled: isAuthenticated, // Only run query if authenticated
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Menunggu",
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock size={14} />,
      },
      confirmed: {
        label: "Dikonfirmasi",
        color: "bg-blue-100 text-blue-800",
        icon: <CheckCircle size={14} />,
      },
      shipped: {
        label: "Dikirim",
        color: "bg-purple-100 text-purple-800",
        icon: <Package size={14} />,
      },
      delivered: {
        label: "Selesai",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle size={14} />,
      },
      cancelled: {
        label: "Dibatalkan",
        color: "bg-red-100 text-red-800",
        icon: <AlertCircle size={14} />,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${config.color}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8 px-4 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/belanja" className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
              <ArrowLeft size={20} />
              <span>Kembali ke Belanja</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <Package size={32} className="text-primary" />
            <h1 className="text-responsive-3xl font-bold text-black">
              Riwayat <span className="text-primary">Transaksi</span>
            </h1>
          </div>

          <p className="text-gray-600 text-lg">{isAuthenticated ? `Lihat semua transaksi pembelian Anda, ${user?.name}` : "Lacak status pesanan Anda dengan memasukkan email yang digunakan saat pembelian"}</p>
        </div>

        {isAuthenticated ? (
          // Authenticated User - Show My Transactions
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

            {/* Transactions List */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Package size={24} />
                    Daftar Transaksi
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
                  <p className="text-gray-600">Memuat transaksi...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
                  <p className="text-red-600 mb-4">Gagal memuat transaksi</p>
                  <button onClick={() => refetch()} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    Coba Lagi
                  </button>
                </div>
              ) : !transactionData?.data || transactionData.data.length === 0 ? (
                <div className="p-12 text-center">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Transaksi</h3>
                  <p className="text-gray-600 mb-6">Anda belum melakukan transaksi apapun. Mulai belanja sekarang!</p>
                  <Link href="/belanja" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <Search size={16} />
                    Mulai Belanja
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {transactionData.data.map((transaction) => (
                    <div key={transaction._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Transaction Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-mono text-sm text-gray-600">#{transaction._id}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <Clock size={14} />
                                <span>{formatDate(transaction.createdAt)}</span>
                              </div>
                            </div>
                            {getStatusBadge(transaction.status)}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Nama Pemesan</p>
                              <p className="font-medium text-gray-900">{transaction.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Jumlah Item</p>
                              <p className="font-medium text-gray-900">{transaction.quantity}x</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Pembayaran</p>
                              <p className="font-semibold text-primary text-lg">{formatCurrency(transaction.totalAmount)}</p>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail size={14} />
                              <span>{transaction.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone size={14} />
                              <span>{transaction.phoneNumber}</span>
                            </div>
                            {transaction.address && (
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                <span>
                                  {transaction.address.city}, {transaction.address.state}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {transactionData?.pagination && transactionData.pagination.pages > 1 && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Sebelumnya
                    </button>

                    <span className="px-4 py-2 text-sm text-gray-600">
                      Halaman {currentPage} dari {transactionData.pagination.pages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === transactionData.pagination.pages}
                      className="px-3 py-2 text-sm bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Selanjutnya
                    </button>
                  </div>

                  <div className="text-center mt-2 text-sm text-gray-500">Total {transactionData.pagination.total} transaksi</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Guest User - Show Track Order Form
          <div className="max-w-4xl mx-auto">
            <TrackOrderForm />

            {/* Info Section */}
            <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Ingin Pengalaman yang Lebih Baik?</h3>
                  <p className="text-blue-800 mb-4">Daftarkan akun Anda untuk mendapatkan riwayat transaksi yang lengkap, notifikasi otomatis, dan akses mudah ke semua pesanan Anda.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/belanja" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Search size={16} />
                      Mulai Belanja
                    </Link>
                    <button
                      onClick={() => {
                        // This would trigger the register modal if you want to implement that
                        console.log("Open register modal");
                      }}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <User size={16} />
                      Daftar Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
