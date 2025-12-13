"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Mail, RefreshCw, HelpCircle } from "react-feather";
import { Suspense } from "react";

// Error messages mapping based on API specs
const errorMessages: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
  invalid_token: {
    title: "Link Tidak Valid atau Kadaluarsa",
    description: "Link verifikasi yang Anda gunakan tidak valid atau sudah kadaluarsa. Link verifikasi hanya berlaku selama 24 jam setelah dikirim.",
    icon: <AlertCircle size={48} className="text-red-500" />,
  },
  verification_failed: {
    title: "Verifikasi Gagal",
    description: "Terjadi kesalahan saat memverifikasi akun Anda. Silakan coba lagi atau hubungi support jika masalah berlanjut.",
    icon: <RefreshCw size={48} className="text-orange-500" />,
  },
  missing_token: {
    title: "Link Verifikasi Tidak Lengkap",
    description: "Link verifikasi tidak valid. Pastikan Anda menggunakan link lengkap yang dikirim ke email Anda.",
    icon: <Mail size={48} className="text-yellow-500" />,
  },
  unknown: {
    title: "Terjadi Kesalahan",
    description: "Terjadi kesalahan yang tidak diketahui. Silakan hubungi support untuk bantuan.",
    icon: <HelpCircle size={48} className="text-gray-500" />,
  },
};

function ApprovalErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error") || "unknown";
  const errorInfo = errorMessages[errorType] || errorMessages.unknown;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Error Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">{errorInfo.icon}</div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{errorInfo.title}</h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">{errorInfo.description}</p>

          {/* Error Code Badge */}
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm mb-8">
            <span className="font-medium">Kode Error:</span>
            <code className="bg-gray-200 px-2 py-0.5 rounded">{errorType}</code>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/" className="block w-full bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200">
              Kembali ke Beranda
            </Link>

            <a href="mailto:support@plutokoi.com" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors duration-200">
              Hubungi Support
            </a>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Butuh bantuan? Email kami di{" "}
            <a href="mailto:support@plutokoi.com" className="text-primary hover:underline">
              support@plutokoi.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ApprovalErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      }
    >
      <ApprovalErrorContent />
    </Suspense>
  );
}
