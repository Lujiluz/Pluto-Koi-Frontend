import AxiosInstance from "@/utils/axiosInstance";
import { WishlistApiResponse, WishlistItemsApiResponse, AddWishlistRequest, RemoveWishlistRequest, WishlistItem } from "@/lib/types";

// Base wishlist API endpoints
const WISHLIST_ENDPOINTS = {
  GET_USER_WISHLIST: "/wishlist",
  GET_ITEMS_BY_TYPE: "/wishlist/items",
  ADD_ITEM: "/wishlist",
  REMOVE_ITEM: "/wishlist/item",
  CLEAR_WISHLIST: "/wishlist",
} as const;

// Get user's complete wishlist
export const getUserWishlist = async (): Promise<WishlistApiResponse> => {
  try {
    const response = await AxiosInstance.get(WISHLIST_ENDPOINTS.GET_USER_WISHLIST);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user wishlist:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch wishlist");
  }
};

// Get wishlist items by type (product or auction)
export const getWishlistItemsByType = async (itemType: "product" | "auction"): Promise<WishlistItemsApiResponse> => {
  try {
    const response = await AxiosInstance.get(WISHLIST_ENDPOINTS.GET_ITEMS_BY_TYPE, {
      params: { itemType },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching ${itemType} wishlist items:`, error);
    throw new Error(error.response?.data?.message || `Failed to fetch ${itemType} wishlist items`);
  }
};

// Add item to wishlist
export const addToWishlist = async (request: AddWishlistRequest): Promise<WishlistApiResponse> => {
  try {
    const response = await AxiosInstance.post(WISHLIST_ENDPOINTS.ADD_ITEM, request);
    return response.data;
  } catch (error: any) {
    console.error("Error adding item to wishlist:", error);

    // Handle specific error cases
    if (error.response?.status === 409) {
      throw new Error("Item already exists in wishlist");
    }
    if (error.response?.status === 404) {
      throw new Error(`${request.itemType} not found`);
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || "Cannot add inactive item to wishlist");
    }

    throw new Error(error.response?.data?.message || "Failed to add item to wishlist");
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (request: RemoveWishlistRequest): Promise<WishlistApiResponse> => {
  try {
    const response = await AxiosInstance.delete(WISHLIST_ENDPOINTS.REMOVE_ITEM, {
      data: request,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error removing item from wishlist:", error);
    throw new Error(error.response?.data?.message || "Failed to remove item from wishlist");
  }
};

// Clear entire wishlist
export const clearWishlist = async (): Promise<WishlistApiResponse> => {
  try {
    const response = await AxiosInstance.delete(WISHLIST_ENDPOINTS.CLEAR_WISHLIST);
    return response.data;
  } catch (error: any) {
    console.error("Error clearing wishlist:", error);
    throw new Error(error.response?.data?.message || "Failed to clear wishlist");
  }
};

// Helper function to check if an item is in wishlist
export const isItemInWishlist = (wishlistItems: WishlistItem[], itemId: string, itemType: "product" | "auction"): boolean => {
  return wishlistItems.some((item) => item.itemId === itemId && item.itemType === itemType);
};

// Helper function to get auction items from wishlist
export const getAuctionItemsFromWishlist = (wishlistItems: WishlistItem[]) => {
  return wishlistItems.filter((item) => item.itemType === "auction");
};

// Helper function to get product items from wishlist
export const getProductItemsFromWishlist = (wishlistItems: WishlistItem[]) => {
  return wishlistItems.filter((item) => item.itemType === "product");
};
