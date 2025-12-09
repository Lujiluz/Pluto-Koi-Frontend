"use client";

import { useEffect } from "react";
import { TrendingUp, Award, Zap, Clock } from "react-feather";
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

  const { event, topBidders } = activeEvent;
  const { mostBidder, highestBidder, latestBidder } = topBidders;

  return (
    <div className="sticky top-0 z-40 text-white shadow-lg overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 animate-gradient-x"></div>

      {/* Floating Particles/Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large golden glow - top left */}
        <div className="absolute top-2 left-[10%] w-24 h-24 bg-gradient-to-br from-yellow-300/30 to-amber-400/20 rounded-full blur-2xl animate-float-slow"></div>

        {/* Large emerald glow - top right */}
        <div className="absolute top-4 right-[15%] w-32 h-32 bg-gradient-to-br from-emerald-300/25 to-green-300/15 rounded-full blur-2xl animate-float-medium"></div>

        {/* Medium cyan glow - bottom left */}
        <div className="absolute bottom-2 left-[30%] w-28 h-28 bg-gradient-to-br from-cyan-300/25 to-teal-400/15 rounded-full blur-xl animate-float-fast"></div>

        {/* Small yellow spark - center */}
        <div className="absolute top-1 right-[40%] w-20 h-20 bg-gradient-to-br from-yellow-200/35 to-orange-300/20 rounded-full blur-lg animate-float-slow delay-500"></div>

        {/* Medium lime glow - bottom right */}
        <div className="absolute bottom-3 right-[25%] w-32 h-32 bg-gradient-to-br from-lime-300/30 to-emerald-400/20 rounded-full blur-2xl animate-float-medium delay-1000"></div>

        {/* Small accent particles */}
        <div className="absolute top-[50%] left-[20%] w-16 h-16 bg-gradient-to-br from-white/20 to-yellow-200/15 rounded-full blur-md animate-float-fast delay-500"></div>
        <div className="absolute top-[30%] right-[30%] w-12 h-12 bg-gradient-to-br from-emerald-200/25 to-cyan-300/15 rounded-full blur-lg animate-float-slow delay-1000"></div>
      </div>

      {/* Shimmer Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>

      <div className="container-custom px-4 py-3 relative z-10">
        {/* Main Total Bid Section */}
        <div className="flex items-center justify-center space-x-3 mb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} className="text-green-100" />
            <span className="font-medium text-sm sm:text-base">Total Omzet Lelang:</span>
          </div>
          <div className="text-lg sm:text-xl font-bold">{formatPrice(event.totalBidAmount)}</div>
          <div className="hidden sm:flex items-center space-x-1 text-green-100 text-sm">
            <span>•</span>
            <span>Event Aktif</span>
          </div>
        </div>

        {/* Top Bidders Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
          {/* Highest Bidder */}
          {highestBidder && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Award size={14} className="text-yellow-300 animate-pulse" />
                <span className="text-xs font-medium text-green-100">Highest Bidder</span>
              </div>
              <p className="text-sm font-semibold truncate">{highestBidder.name}</p>
              <p className="text-xs text-green-100">{formatPrice(highestBidder.totalBidAmount || 0)}</p>
            </div>
          )}

          {/* Most Active Bidder */}
          {mostBidder && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={14} className="text-orange-300" />
                <span className="text-xs font-medium text-green-100">Most Active</span>
              </div>
              <p className="text-sm font-semibold truncate">{mostBidder.name}</p>
              <p className="text-xs text-green-100">{mostBidder.bidCount || 0} bids</p>
            </div>
          )}

          {/* Latest Bidder */}
          {latestBidder && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={14} className="text-blue-300" />
                <span className="text-xs font-medium text-green-100">Latest Bidder</span>
              </div>
              <p className="text-sm font-semibold truncate">{latestBidder.name}</p>
              <p className="text-xs text-green-100">{formatPrice(latestBidder.bidAmount || 0)}</p>
            </div>
          )}
        </div>

        {/* Auto-refresh indicator */}
        <div className="text-center mt-2">
          <span className="text-xs opacity-70">Auto-refresh 30s</span>
        </div>
      </div>
    </div>
  );
}
