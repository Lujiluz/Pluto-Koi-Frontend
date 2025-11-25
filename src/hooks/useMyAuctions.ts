import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getMyAuctions, MyAuctionsResponse } from "@/services/auctionActivityService";

interface UseMyAuctionsOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Custom hook to fetch user's auction history
 * @param page - Current page number (default: 1)
 * @param limit - Number of items per page (default: 9)
 * @param options - Additional query options
 */
export const useMyAuctions = (page = 1, limit = 9, options?: Partial<UseQueryOptions<MyAuctionsResponse>>) => {
  return useQuery<MyAuctionsResponse>({
    queryKey: ["myAuctions", page, limit],
    queryFn: () => getMyAuctions(page, limit),
    staleTime: 30000, // 30 seconds
    ...options,
  });
};
