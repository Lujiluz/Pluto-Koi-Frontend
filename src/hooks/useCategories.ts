"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategoriesClient, CategoryQueryParams, formatCategoriesForFilter } from "@/services/categoryService";
import { CategoryApiResponse } from "@/lib/types";

// Query keys for category queries
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (params: CategoryQueryParams) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Hook to fetch categories with pagination and filters
export const useCategories = (params: CategoryQueryParams = {}) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategoriesClient(params),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change frequently
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    refetchOnWindowFocus: false, // Categories rarely change
    refetchOnMount: true,
  });
};

// Hook to get categories formatted for filters/dropdowns
export const useCategoriesForFilter = () => {
  const { data, isLoading, error } = useCategories({
    isActive: true, // Only get active categories
    limit: 100, // Get all categories
  });

  const formattedCategories = data?.data?.categories ? formatCategoriesForFilter(data.data.categories) : [{ id: "", name: "Semua Kategori", count: 0, description: undefined }]; // Fallback

  return {
    categories: formattedCategories,
    isLoading,
    error,
    rawData: data,
  };
};

// Hook to refresh categories manually
export const useRefreshCategories = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params?: CategoryQueryParams) => {
      const result = await getCategoriesClient(params || {});
      return result;
    },
    onSuccess: (data, variables) => {
      // Update the specific query cache
      queryClient.setQueryData(categoryKeys.list(variables || {}), data);

      // Optionally invalidate all category queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
    onError: (error) => {
      console.error("Failed to refresh categories:", error);
    },
  });
};

// Hook to invalidate categories cache (useful for real-time updates)
export const useInvalidateCategories = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: categoryKeys.all });
  };
};

// Hook to prefetch categories
export const usePrefetchCategories = () => {
  const queryClient = useQueryClient();

  return (params: CategoryQueryParams) => {
    queryClient.prefetchQuery({
      queryKey: categoryKeys.list(params),
      queryFn: () => getCategoriesClient(params),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };
};

// Hook to get cached category data without triggering a request
export const useCategoriesData = (params: CategoryQueryParams = {}): CategoryApiResponse | undefined => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(categoryKeys.list(params));
};
