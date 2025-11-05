import AxiosInstance from "@/utils/axiosInstance";
import { AuctionApiResponse, AuctionDetailApiResponse, MediaType } from "@/lib/types";

// Auction participants response type
export interface AuctionParticipantsResponse {
  status: string;
  message: string;
  data: {
    auctionId: string;
    participants: Array<{
      userId: string;
      name: string;
      email: string;
      role: string;
      totalBids: number;
      highestBid: number;
      latestBidTime: string;
      isHighestBidder: boolean;
    }>;
    currentHighestBid: number;
    currentWinner: {
      userId: string;
      name: string;
      bidAmount: number;
    } | null;
    totalParticipants: number;
    totalBids: number;
  };
}

// Base auction API endpoints
const AUCTION_ENDPOINTS = {
  GET_ALL: "/auction",
  GET_DETAIL: (id: string) => `/auction/${id}`,
  GET_PARTICIPANTS: (id: string) => `/auction-activity/auction/${id}/participants`,
} as const;

// Pagination params interface
export interface AuctionPaginationParams {
  page?: number;
  limit?: number;
}

// Client-side auction service (using axios with auth)
export const getAuctionsClient = async (params?: AuctionPaginationParams): Promise<AuctionApiResponse> => {
  try {
    const response = await AxiosInstance.get(AUCTION_ENDPOINTS.GET_ALL, {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 8,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching auctions:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch auctions");
  }
};

// Server-side auction service (for server components)
export const getAuctionsServer = async (params?: AuctionPaginationParams): Promise<AuctionApiResponse> => {
  try {
    const baseUrl = process.env.BACKEND_BASE_URL || "http://localhost:1728";
    const page = params?.page || 1;
    const limit = params?.limit || 8;
    const response = await fetch(`${baseUrl}${AUCTION_ENDPOINTS.GET_ALL}?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // For server-side rendering, we can add cache control
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AuctionApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching auctions on server:", error);
    throw error;
  }
};

// Client-side auction detail service
export const getAuctionDetailClient = async (id: string): Promise<AuctionDetailApiResponse> => {
  try {
    const response = await AxiosInstance.get(AUCTION_ENDPOINTS.GET_DETAIL(id));
    return response.data;
  } catch (error: any) {
    console.error("Error fetching auction detail:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch auction detail");
  }
};

// Server-side auction detail service (for server components)
export const getAuctionDetailServer = async (id: string): Promise<AuctionDetailApiResponse> => {
  try {
    const baseUrl = process.env.BACKEND_BASE_URL || "http://localhost:1728";
    const response = await fetch(`${baseUrl}${AUCTION_ENDPOINTS.GET_DETAIL(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 30 }, // Revalidate every 30 seconds for detail page
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AuctionDetailApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching auction detail on server:", error);
    throw error;
  }
};

// Client-side auction participants service
export const getAuctionParticipantsClient = async (id: string): Promise<AuctionParticipantsResponse> => {
  try {
    const response = await AxiosInstance.get(AUCTION_ENDPOINTS.GET_PARTICIPANTS(id));
    return response.data;
  } catch (error: any) {
    console.error("Error fetching auction participants:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch auction participants");
  }
};

// Helper function to calculate auction status
export const getAuctionStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return "upcoming";
  } else if (now > end) {
    return "completed";
  } else {
    // Check if ending soon (within 24 hours)
    const timeUntilEnd = end.getTime() - now.getTime();
    const hoursUntilEnd = timeUntilEnd / (1000 * 60 * 60);

    if (hoursUntilEnd <= 24) {
      return "ending-soon";
    } else {
      return "active";
    }
  }
};

// Helper function to format price
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

// Helper function to calculate time remaining (returns object like utils function)
export const getTimeRemainingObject = (endDate: string) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
};

// Helper function to calculate time remaining (returns formatted string)
export const getTimeRemaining = (endDate: string) => {
  const timeObj = getTimeRemainingObject(endDate);

  if (timeObj.isExpired) {
    return "Auction ended";
  }

  if (timeObj.days > 0) {
    return `${timeObj.days}d ${timeObj.hours}h ${timeObj.minutes}m`;
  } else if (timeObj.hours > 0) {
    return `${timeObj.hours}h ${timeObj.minutes}m`;
  } else {
    return `${timeObj.minutes}m`;
  }
};

// Helper function to detect media type from file URL
export const getMediaType = (fileUrl: string): MediaType => {
  const url = fileUrl.toLowerCase();

  // Check for video extensions
  if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov") || url.endsWith(".avi")) {
    return "video";
  }

  // Default to image for all other files
  return "image";
};

// Helper function to check if URL is a video
export const isVideoUrl = (url: string): boolean => {
  return getMediaType(url) === "video";
};

// Helper function to get appropriate fallback media
export const getFallbackMedia = (mediaType: MediaType): string => {
  return mediaType === "video"
    ? "/images/koi/contoh_ikan.png" // Use image fallback even for videos
    : "/images/koi/contoh_ikan.png";
};
