"use client";

import { useEffect } from "react";
import { TrendingUp } from "react-feather";
import { useGeneralData } from "@/hooks/useGeneralData";
import { formatPrice } from "@/services/auctionService";

export default function ActiveEventBanner() {
  const { activeEvent, isLoadingEvent, eventError, refetchEvent } = useGeneralData();

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    if (!activeEvent) return;

    const interval = setInterval(() => {
      refetchEvent();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [activeEvent, refetchEvent]);

  // Don't show anything while loading, if there's an error, or no active event
  if (isLoadingEvent || eventError || !activeEvent) {
    return null;
  }

  return (
    <div className="sticky top-16 z-40 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
      <div className="container-custom px-4 py-3">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-green-100" />
            <span className="font-medium text-sm sm:text-base">Current Total Bid:</span>
          </div>
          <div className="text-lg sm:text-xl font-bold">{formatPrice(activeEvent.totalBidAmount)}</div>
          <div className="hidden sm:flex items-center space-x-1 text-green-100 text-sm">
            <span>•</span>
            <span>Event Aktif</span>
            <span>•</span>
            <span className="text-xs opacity-80">Auto-refresh 30s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
