"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useToast } from "@/components/common/Toast";
import { getUserWishlist, getWishlistItemsByType, addToWishlist, removeFromWishlist, clearWishlist, isItemInWishlist, getAuctionItemsFromWishlist, getProductItemsFromWishlist } from "@/services/wishlistService";
import { WishlistItem, AddWishlistRequest, RemoveWishlistRequest } from "@/lib/types";

interface UseWishlistReturn {
  // Data states
  wishlistItems: WishlistItem[];
  auctionItems: WishlistItem[];
  productItems: WishlistItem[];
  isLoading: boolean;
  error: string | null;

  // Action states
  isAddingToWishlist: boolean;
  isRemovingFromWishlist: boolean;

  // Helper functions
  isInWishlist: (itemId: string, itemType: "product" | "auction") => boolean;

  // Actions
  fetchUserWishlist: () => Promise<void>;
  fetchAuctionWishlistItems: () => Promise<void>;
  fetchProductWishlistItems: () => Promise<void>;
  addItemToWishlist: (itemId: string, itemType: "product" | "auction") => Promise<boolean>;
  removeItemFromWishlist: (itemId: string, itemType: "product" | "auction") => Promise<boolean>;
  clearUserWishlist: () => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

export function useWishlist(): UseWishlistReturn {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Data states
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Action states
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isRemovingFromWishlist, setIsRemovingFromWishlist] = useState(false);

  // Fetch user's complete wishlist
  const fetchUserWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getUserWishlist();

      if (response.status === "success" && response.data) {
        setWishlistItems(response.data.items || []);
      } else {
        setWishlistItems([]);
        setError("Failed to fetch wishlist");
      }
    } catch (err: any) {
      console.error("Error fetching user wishlist:", err);
      setError(err.message || "Failed to fetch wishlist");
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch auction items from wishlist
  const fetchAuctionWishlistItems = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getWishlistItemsByType("auction");

      if (response.status === "success" && response.data) {
        setWishlistItems(response.data);
      } else {
        setWishlistItems([]);
        setError("Failed to fetch auction wishlist items");
      }
    } catch (err: any) {
      console.error("Error fetching auction wishlist items:", err);
      setError(err.message || "Failed to fetch auction wishlist items");
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch product items from wishlist
  const fetchProductWishlistItems = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await getWishlistItemsByType("product");

      if (response.status === "success" && response.data) {
        setWishlistItems(response.data);
      } else {
        setWishlistItems([]);
        setError("Failed to fetch product wishlist items");
      }
    } catch (err: any) {
      console.error("Error fetching product wishlist items:", err);
      setError(err.message || "Failed to fetch product wishlist items");
      setWishlistItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to wishlist
  const addItemToWishlist = async (itemId: string, itemType: "product" | "auction"): Promise<boolean> => {
    if (!isAuthenticated) {
      showToast({
        type: "warning",
        title: "Login Diperlukan",
        message: "Silakan login terlebih dahulu untuk menambahkan item ke wishlist",
      });
      return false;
    }

    try {
      setIsAddingToWishlist(true);
      setError(null);

      const request: AddWishlistRequest = { itemId, itemType };
      const response = await addToWishlist(request);

      if (response.status === "success" && response.data) {
        // Update local state with new wishlist data
        setWishlistItems(response.data.items || []);

        showToast({
          type: "success",
          title: "Berhasil Ditambahkan",
          message: `${itemType === "auction" ? "Lelang" : "Produk"} berhasil ditambahkan ke wishlist`,
        });

        return true;
      } else {
        const errorMsg = "Gagal menambahkan item ke wishlist";
        setError(errorMsg);
        showToast({
          type: "error",
          title: "Gagal Menambahkan",
          message: errorMsg,
        });
        return false;
      }
    } catch (err: any) {
      console.error("Error adding item to wishlist:", err);

      // Handle different error cases
      let errorMessage = err.message || "Gagal menambahkan item ke wishlist";
      let errorTitle = "Gagal Menambahkan";

      if (err.message?.includes("already exists")) {
        errorTitle = "Item Sudah Ada";
        errorMessage = "Item ini sudah ada di wishlist Anda";
      } else if (err.message?.includes("not found")) {
        errorTitle = "Item Tidak Ditemukan";
        errorMessage = "Item yang Anda coba tambahkan tidak ditemukan";
      } else if (err.message?.includes("inactive")) {
        // Backend issue - auction might be marked as inactive incorrectly
        errorTitle = "Tidak Dapat Ditambahkan";
        errorMessage = "Terjadi masalah saat menambahkan ke wishlist. Silakan coba lagi nanti.";
      } else if (err.message?.includes("expired") || err.message?.includes("ended")) {
        errorTitle = "Lelang Berakhir";
        errorMessage = "Lelang ini sudah berakhir dan tidak dapat ditambahkan ke wishlist";
      }

      setError(errorMessage);
      showToast({
        type: "error",
        title: errorTitle,
        message: errorMessage,
      });
      return false;
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Remove item from wishlist
  const removeItemFromWishlist = async (itemId: string, itemType: "product" | "auction"): Promise<boolean> => {
    if (!isAuthenticated) {
      showToast({
        type: "warning",
        title: "Login Diperlukan",
        message: "Silakan login terlebih dahulu untuk mengelola wishlist",
      });
      return false;
    }

    try {
      setIsRemovingFromWishlist(true);
      setError(null);

      const request: RemoveWishlistRequest = { itemId, itemType };
      const response = await removeFromWishlist(request);

      if (response.status === "success" && response.data) {
        // Update local state with new wishlist data
        setWishlistItems(response.data.items || []);

        showToast({
          type: "success",
          title: "Berhasil Dihapus",
          message: `${itemType === "auction" ? "Lelang" : "Produk"} berhasil dihapus dari wishlist`,
        });

        return true;
      } else {
        const errorMsg = "Gagal menghapus item dari wishlist";
        setError(errorMsg);
        showToast({
          type: "error",
          title: "Gagal Menghapus",
          message: errorMsg,
        });
        return false;
      }
    } catch (err: any) {
      console.error("Error removing item from wishlist:", err);
      const errorMessage = err.message || "Gagal menghapus item dari wishlist";
      setError(errorMessage);
      showToast({
        type: "error",
        title: "Gagal Menghapus",
        message: errorMessage,
      });
      return false;
    } finally {
      setIsRemovingFromWishlist(false);
    }
  };

  // Clear entire wishlist
  const clearUserWishlist = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      showToast({
        type: "warning",
        title: "Login Diperlukan",
        message: "Silakan login terlebih dahulu untuk mengelola wishlist",
      });
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await clearWishlist();

      if (response.status === "success") {
        setWishlistItems([]);
        showToast({
          type: "success",
          title: "Wishlist Dikosongkan",
          message: "Semua item berhasil dihapus dari wishlist",
        });
        return true;
      } else {
        const errorMsg = "Gagal mengosongkan wishlist";
        setError(errorMsg);
        showToast({
          type: "error",
          title: "Gagal Mengosongkan",
          message: errorMsg,
        });
        return false;
      }
    } catch (err: any) {
      console.error("Error clearing wishlist:", err);
      const errorMessage = err.message || "Gagal mengosongkan wishlist";
      setError(errorMessage);
      showToast({
        type: "error",
        title: "Gagal Mengosongkan",
        message: errorMessage,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh wishlist data
  const refreshWishlist = async () => {
    await fetchUserWishlist();
  };

  // Helper function to check if item is in wishlist
  const isInWishlist = (itemId: string, itemType: "product" | "auction"): boolean => {
    return isItemInWishlist(wishlistItems, itemId, itemType);
  };

  // Computed values
  const auctionItems = getAuctionItemsFromWishlist(wishlistItems);
  const productItems = getProductItemsFromWishlist(wishlistItems);

  // Effect to fetch wishlist when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserWishlist();
    } else {
      setWishlistItems([]);
      setError(null);
    }
  }, [isAuthenticated]);

  return {
    // Data states
    wishlistItems,
    auctionItems,
    productItems,
    isLoading,
    error,

    // Action states
    isAddingToWishlist,
    isRemovingFromWishlist,

    // Helper functions
    isInWishlist,

    // Actions
    fetchUserWishlist,
    fetchAuctionWishlistItems,
    fetchProductWishlistItems,
    addItemToWishlist,
    removeItemFromWishlist,
    clearUserWishlist,
    refreshWishlist,
  };
}
