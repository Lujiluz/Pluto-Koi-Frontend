import AxiosInstance from "@/utils/axiosInstance";

// Auction Activity Types
export interface BidHistoryItem {
  _id: string;
  auctionId: string;
  userId: string;
  bidAmount: number;
  bidType: string;
  isActive: boolean;
  bidTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAuctionHistory {
  auctionId: string;
  userId: string;
  bidHistory: BidHistoryItem[];
  totalBids: number;
  highestBid: number;
  latestBid: number;
}

export interface UserAuctionHistoryResponse {
  success: boolean;
  message: string;
  data: UserAuctionHistory;
}

// Auction data structure from backend
export interface AuctionData {
  _id: string;
  itemName: string;
  note: string;
  startPrice: number;
  endPrice: number;
  startDate: string;
  endDate: string;
  endTime: string;
  extraTime: number;
  highestBid: number;
  media: Array<{
    fileUrl: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// User bid information from backend
export interface UserBidInfo {
  totalBids: number;
  highestBid: number;
  latestBid: {
    amount: number;
    bidType: string;
    bidTime: string;
  };
  isCurrentWinner: boolean;
}

// Combined auction with user bid status
export interface AuctionWithBidStatus {
  auction: AuctionData;
  userBidInfo: UserBidInfo;
  currentHighestBid: number;
  auctionStatus: "active" | "upcoming" | "completed" | "ending-soon";
}

// Response structure for My Auctions
export interface MyAuctionsResponse {
  status: string;
  message: string;
  data: {
    auctions: AuctionWithBidStatus[];
    metadata: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

// Auction Confirmation Types
export interface AuctionConfirmationRequest {
  auctionId: string;
  paymentProof: File;
}

export interface AuctionConfirmationResponse {
  success: boolean;
  message: string;
  data: {
    confirmationId: string;
    auctionId: string;
    paymentProofUrl: string;
    status: string;
  };
}

// API Endpoints
const AUCTION_ACTIVITY_ENDPOINTS = {
  GET_USER_HISTORY: (auctionId: string, userId: string) => `/auction-activity/auction/${auctionId}/user/${userId}/history`,
  GET_MY_AUCTIONS: "/auction-activity/my-auctions",
  CONFIRM_WIN: "/auction-activity/confirm-win",
} as const;

/**
 * Get user's bid history for a specific auction
 */
export const getUserAuctionHistory = async (auctionId: string, userId: string): Promise<UserAuctionHistoryResponse> => {
  try {
    const response = await AxiosInstance.get(AUCTION_ACTIVITY_ENDPOINTS.GET_USER_HISTORY(auctionId, userId));
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user auction history:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch user auction history");
  }
};

/**
 * Get all auctions that the authenticated user has bidded on
 * This will call the backend endpoint to get all auctions with user's bid information
 */
export const getMyAuctions = async (page = 1, limit = 10): Promise<MyAuctionsResponse> => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await AxiosInstance.get(`${AUCTION_ACTIVITY_ENDPOINTS.GET_MY_AUCTIONS}?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching my auctions:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch my auctions");
  }
};

/**
 * Confirm auction win by uploading payment proof
 */
export const confirmAuctionWin = async (data: AuctionConfirmationRequest): Promise<AuctionConfirmationResponse> => {
  try {
    const formData = new FormData();
    formData.append("auctionId", data.auctionId);
    formData.append("paymentProof", data.paymentProof);

    const response = await AxiosInstance.post(AUCTION_ACTIVITY_ENDPOINTS.CONFIRM_WIN, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error confirming auction win:", error);
    throw new Error(error.response?.data?.message || "Failed to confirm auction win");
  }
};

// Validation helpers
export const validatePaymentProof = (file: File | null): string | null => {
  if (!file) return "Payment proof is required";

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return "Please upload a valid image file (JPG, PNG, or WebP)";
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return "File size must be less than 5MB";
  }

  return null;
};
