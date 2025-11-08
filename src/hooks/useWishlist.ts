"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
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
      setError("Please login to add items to wishlist");
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
        return true;
      } else {
        setError("Failed to add item to wishlist");
        return false;
      }
    } catch (err: any) {
      console.error("Error adding item to wishlist:", err);
      setError(err.message || "Failed to add item to wishlist");
      return false;
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Remove item from wishlist
  const removeItemFromWishlist = async (itemId: string, itemType: "product" | "auction"): Promise<boolean> => {
    if (!isAuthenticated) {
      setError("Please login to manage wishlist");
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
        return true;
      } else {
        setError("Failed to remove item from wishlist");
        return false;
      }
    } catch (err: any) {
      console.error("Error removing item from wishlist:", err);
      setError(err.message || "Failed to remove item from wishlist");
      return false;
    } finally {
      setIsRemovingFromWishlist(false);
    }
  };

  // Clear entire wishlist
  const clearUserWishlist = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      setError("Please login to manage wishlist");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await clearWishlist();

      if (response.status === "success") {
        setWishlistItems([]);
        return true;
      } else {
        setError("Failed to clear wishlist");
        return false;
      }
    } catch (err: any) {
      console.error("Error clearing wishlist:", err);
      setError(err.message || "Failed to clear wishlist");
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
