"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGalleriesClient, GalleryQueryParams } from "@/services/galleryService";
import { GalleryApiResponse } from "@/lib/types";

// Query keys for gallery queries
export const galleryKeys = {
  all: ["galleries"] as const,
  lists: () => [...galleryKeys.all, "list"] as const,
  list: (params: GalleryQueryParams) => [...galleryKeys.lists(), params] as const,
  details: () => [...galleryKeys.all, "detail"] as const,
  detail: (id: string) => [...galleryKeys.details(), id] as const,
};

// Hook to fetch galleries with pagination and filters
export const useGalleries = (params: GalleryQueryParams = {}) => {
  return useQuery({
    queryKey: galleryKeys.list(params),
    queryFn: () => getGalleriesClient(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    refetchOnWindowFocus: false, // Galleries don't change frequently
    refetchOnMount: true,
  });
};

// Hook to refresh galleries manually
export const useRefreshGalleries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params?: GalleryQueryParams) => {
      const result = await getGalleriesClient(params || {});
      return result;
    },
    onSuccess: (data, variables) => {
      // Update the specific query cache
      queryClient.setQueryData(galleryKeys.list(variables || {}), data);

      // Optionally invalidate all gallery queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
    onError: (error) => {
      console.error("Failed to refresh galleries:", error);
    },
  });
};

// Hook to invalidate galleries cache (useful for real-time updates)
export const useInvalidateGalleries = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: galleryKeys.all });
  };
};

// Hook to prefetch next page of galleries
export const usePrefetchGalleries = () => {
  const queryClient = useQueryClient();

  return (params: GalleryQueryParams) => {
    queryClient.prefetchQuery({
      queryKey: galleryKeys.list(params),
      queryFn: () => getGalleriesClient(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};

// Hook to get cached gallery data without triggering a request
export const useGalleriesData = (params: GalleryQueryParams = {}): GalleryApiResponse | undefined => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(galleryKeys.list(params));
};

// Helper hook for pagination
export const useGalleryPagination = (currentParams: GalleryQueryParams) => {
  const prefetchGalleries = usePrefetchGalleries();

  const prefetchNextPage = () => {
    const nextPage = (currentParams.page || 1) + 1;
    prefetchGalleries({ ...currentParams, page: nextPage });
  };

  const prefetchPreviousPage = () => {
    const prevPage = Math.max((currentParams.page || 1) - 1, 1);
    if (prevPage !== (currentParams.page || 1)) {
      prefetchGalleries({ ...currentParams, page: prevPage });
    }
  };

  return {
    prefetchNextPage,
    prefetchPreviousPage,
  };
};
