"use client";

import { useState } from "react";
import { useTrackOrderByEmail } from "@/hooks/useTransactions";
import { useToast } from "@/components/common/Toast";
import { validateEmail } from "@/services/transactionService";
import { AlertCircle, Search, Package, Clock } from "react-feather";

export default function TrackOrderForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { trackOrder, data, isLoading, error: trackError } = useTrackOrderByEmail();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      await trackOrder({ email });
      showToast({
        type: "success",
        title: "Pencarian Berhasil",
        message: `Ditemukan ${data?.data?.length || 0} pesanan untuk email ${email}`,
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Pencarian Gagal",
        message: err.message || "Tidak dapat menemukan pesanan untuk email tersebut",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "Dikonfirmasi", color: "bg-blue-100 text-blue-800" },
      shipped: { label: "Dikirim", color: "bg-purple-100 text-purple-800" },
      delivered: { label: "Selesai", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>{config.label}</span>;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Lacak Pesanan</h2>
        <p className="text-sm text-gray-600">Masukkan email yang digunakan saat pembelian untuk melacak status pesanan Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors duration-200 ${
                error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-200"
              }`}
              required
            />
            {error && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>
          <button type="submit" disabled={isLoading} className="px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/70 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
            <Search size={18} />
            {isLoading ? "Mencari..." : "Lacak"}
          </button>
        </div>
      </form>

      {/* Results */}
      {data && data.success && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Package size={20} className="text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Ditemukan {data.data.length} Pesanan</h3>
          </div>

          {data.data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Tidak ada pesanan ditemukan untuk email ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.data.map((transaction: any) => (
                <div key={transaction._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-900">ID: {transaction._id}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock size={14} />
                        <span>
                          {new Date(transaction.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Nama</p>
                      <p className="font-medium">{transaction.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Jumlah</p>
                      <p className="font-medium">{transaction.quantity}x</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-medium text-primary">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(transaction.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination info if available */}
          {data.pagination && data.pagination.pages > 1 && (
            <div className="text-center text-sm text-gray-600 mt-4">
              Halaman {data.pagination.page} dari {data.pagination.pages}({data.pagination.total} total pesanan)
            </div>
          )}
        </div>
      )}

      {trackError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle size={16} />
            <p className="font-medium">Error</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{trackError}</p>
        </div>
      )}
    </div>
  );
}
