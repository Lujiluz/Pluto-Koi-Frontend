"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createGuestPurchase, createUserPurchase, getMyTransactions, trackOrderByEmail, getTransactionById, GuestPurchaseRequest, UserPurchaseRequest, TrackOrderRequest } from "@/services/transactionService";

// Hook for guest purchase
export function useCreateGuestPurchase() {
  return useMutation({
    mutationFn: (data: GuestPurchaseRequest) => createGuestPurchase(data),
    onError: (error) => {
      console.error("Guest purchase error:", error);
    },
    onSuccess: (data) => {
      console.log("Guest purchase successful:", data);
    },
  });
}

// Hook for user purchase (authenticated)
export function useCreateUserPurchase() {
  return useMutation({
    mutationFn: (data: UserPurchaseRequest) => createUserPurchase(data),
    onError: (error) => {
      console.error("User purchase error:", error);
    },
    onSuccess: (data) => {
      console.log("User purchase successful:", data);
    },
  });
}

// Hook for getting my transactions (authenticated)
export function useMyTransactions(page = 1, limit = 10, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["transactions", "my", page, limit],
    queryFn: () => getMyTransactions(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: options?.enabled !== false, // Default to true unless explicitly disabled
  });
}

// Hook for tracking order by email
export function useTrackOrderByEmail() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const trackOrder = async (requestData: TrackOrderRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await trackOrderByEmail(requestData);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    trackOrder,
    data,
    isLoading,
    error,
    reset: () => {
      setData(null);
      setError(null);
    },
  };
}

// Hook for getting transaction by ID
export function useTransactionById(id?: string) {
  return useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransactionById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
