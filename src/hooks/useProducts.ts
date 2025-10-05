"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProductsClient, ProductQueryParams } from "@/services/productService";
import { ProductApiResponse } from "@/lib/types";

// Query keys for product queries
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Hook to fetch products with pagination and filters
export const useProducts = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProductsClient(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Retry up to 5 times for other errors (same as auction/gallery)
      return failureCount < 5;
    },
    refetchOnWindowFocus: false, // Products don't change super frequently
    refetchOnMount: true,
  });
};

// Hook to refresh products manually
export const useRefreshProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params?: ProductQueryParams) => {
      const result = await getProductsClient(params || {});
      return result;
    },
    onSuccess: (data, variables) => {
      // Update the specific query cache
      queryClient.setQueryData(productKeys.list(variables || {}), data);

      // Optionally invalidate all product queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (error) => {
      console.error("Failed to refresh products:", error);
    },
  });
};

// Hook to invalidate products cache (useful for real-time updates)
export const useInvalidateProducts = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: productKeys.all });
  };
};

// Hook to prefetch next page of products
export const usePrefetchProducts = () => {
  const queryClient = useQueryClient();

  return (params: ProductQueryParams) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.list(params),
      queryFn: () => getProductsClient(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};

// Hook to get cached product data without triggering a request
export const useProductsData = (params: ProductQueryParams = {}): ProductApiResponse | undefined => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(productKeys.list(params));
};

// Helper hook for pagination
export const useProductPagination = (currentParams: ProductQueryParams) => {
  const prefetchProducts = usePrefetchProducts();

  const prefetchNextPage = () => {
    const nextPage = (currentParams.page || 1) + 1;
    prefetchProducts({ ...currentParams, page: nextPage });
  };

  const prefetchPreviousPage = () => {
    const prevPage = Math.max((currentParams.page || 1) - 1, 1);
    if (prevPage !== (currentParams.page || 1)) {
      prefetchProducts({ ...currentParams, page: prevPage });
    }
  };

  return {
    prefetchNextPage,
    prefetchPreviousPage,
  };
};
