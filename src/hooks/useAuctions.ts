import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuctionsClient } from "@/services/auctionService";
import { AuctionApiResponse } from "@/lib/types";

// Query keys for auctions
export const AUCTION_QUERY_KEYS = {
  all: ["auctions"] as const,
  lists: () => [...AUCTION_QUERY_KEYS.all, "list"] as const,
  list: (filters: Record<string, any>) => [...AUCTION_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...AUCTION_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...AUCTION_QUERY_KEYS.details(), id] as const,
};

// Hook to fetch all auctions
export const useAuctions = () => {
  return useQuery({
    queryKey: AUCTION_QUERY_KEYS.lists(),
    queryFn: getAuctionsClient,
    staleTime: 30 * 1000, // 30 seconds - auctions change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when user comes back to the app
    refetchInterval: 60 * 1000, // Refetch every minute for real-time experience
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors (401, 403)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

// Hook to manually refetch auctions (useful for real-time updates)
export const useRefreshAuctions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: AUCTION_QUERY_KEYS.lists() });
      return queryClient.refetchQueries({ queryKey: AUCTION_QUERY_KEYS.lists() });
    },
  });
};

// Hook to invalidate and refetch auction data (useful after bid placement)
export const useInvalidateAuctions = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: AUCTION_QUERY_KEYS.all });
  };
};

// Hook to optimistically update auction data (for immediate UI feedback)
export const useOptimisticAuctionUpdate = () => {
  const queryClient = useQueryClient();

  return (auctionId: string, updater: (old: AuctionApiResponse | undefined) => AuctionApiResponse | undefined) => {
    queryClient.setQueryData(AUCTION_QUERY_KEYS.lists(), updater);
  };
};

// Hook to set auction data from server-side (if needed)
export const useSetAuctionData = () => {
  const queryClient = useQueryClient();

  return (data: AuctionApiResponse) => {
    queryClient.setQueryData(AUCTION_QUERY_KEYS.lists(), data);
  };
};
