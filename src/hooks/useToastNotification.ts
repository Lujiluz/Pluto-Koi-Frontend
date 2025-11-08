"use client";

import { useToast as useToastContext } from "@/components/common/Toast";

// Simplified toast hook for easier usage
export function useToastNotification() {
  const { showToast } = useToastContext();

  return {
    showSuccess: (message: string, title?: string) => {
      showToast({ type: "success", message, title });
    },

    showError: (message: string, title?: string) => {
      showToast({ type: "error", message, title });
    },

    showWarning: (message: string, title?: string) => {
      showToast({ type: "warning", message, title });
    },

    showInfo: (message: string, title?: string) => {
      showToast({ type: "info", message, title });
    },

    // For handling API errors with common patterns
    handleApiError: (error: any, defaultMessage?: string) => {
      let message = defaultMessage || "Terjadi kesalahan yang tidak terduga";
      let title = "Error";

      if (error?.message) {
        message = error.message;
      }

      // Handle common error patterns
      if (error?.message?.includes("ended") || error?.message?.includes("expired")) {
        title = "Lelang Berakhir";
        message = "Lelang ini sudah berakhir dan tidak dapat ditambahkan ke wishlist";
      } else if (error?.message?.includes("already exists")) {
        title = "Item Sudah Ada";
        message = "Item ini sudah ada di wishlist Anda";
      } else if (error?.message?.includes("not found")) {
        title = "Item Tidak Ditemukan";
        message = "Item yang Anda cari tidak ditemukan";
      } else if (error?.message?.includes("unauthorized") || error?.message?.includes("login")) {
        title = "Login Diperlukan";
        message = "Silakan login terlebih dahulu";
      }

      showToast({ type: "error", message, title });
    },
  };
}
