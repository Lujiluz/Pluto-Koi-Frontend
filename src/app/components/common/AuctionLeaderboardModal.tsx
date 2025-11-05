"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";
import { BackendAuctionDetail } from "@/lib/types";
import { getAuctionParticipantsClient, AuctionParticipantsResponse } from "@/services/auctionService";
import { formatPrice } from "@/services/auctionService";
import { X, Wifi, WifiOff, TrendingUp, Clock, Award, Users } from "react-feather";

interface AuctionLeaderboardModalProps {
  isOpen: boolean;
  auction: BackendAuctionDetail | null;
  onClose: () => void;
}

export default function AuctionLeaderboardModal({ isOpen, auction, onClose }: AuctionLeaderboardModalProps) {
  const { isConnected, leaderboardData, lastBid, timeExtension, auctionEnded, error, joinAuction, leaveAuction, clearLeaderboardData } = useAuctionSocket();

  const [countdown, setCountdown] = useState<string>("00:00:00:00");
  const [showNewBidNotification, setShowNewBidNotification] = useState(false);
  const [showExtensionNotification, setShowExtensionNotification] = useState(false);
  const [initialData, setInitialData] = useState<AuctionParticipantsResponse["data"] | null>(null);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false);

  // Calculate countdown timer
  const calculateCountdown = useCallback(
    (endDate: string, endTime: string) => {
      const now = new Date();
      let end: Date;

      // Check if endTime is a full ISO timestamp or just time
      if (endTime.includes("T")) {
        end = new Date(endTime);
      } else {
        end = new Date(endDate);
        const [hours, minutes] = endTime.split(":").map(Number);
        end.setHours(hours, minutes, 0, 0);
      }

      // If time extension occurred, use the new end time
      if (timeExtension && timeExtension.auctionId === auction?._id) {
        const extendedEnd = new Date(timeExtension.newEndTime);
        const diff = extendedEnd.getTime() - now.getTime();

        if (diff <= 0) return "00:00:00:00";

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hrs = Math.floor((totalSeconds % 86400) / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        return `${days.toString().padStart(2, "0")} hari, ${hrs.toString().padStart(2, "0")} jam, ${mins.toString().padStart(2, "0")} menit, ${secs.toString().padStart(2, "0")} detik`;
      }

      const diff = end.getTime() - now.getTime();

      if (diff <= 0) return "00:00:00:00";

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hrs = Math.floor((totalSeconds % 86400) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;

      return `${days.toString().padStart(2, "0")} hari, ${hrs.toString().padStart(2, "0")} jam, ${mins.toString().padStart(2, "0")} menit, ${secs.toString().padStart(2, "0")} detik`;
    },
    [timeExtension, auction]
  );

  // Update countdown every second
  useEffect(() => {
    if (!auction || !isOpen) return;

    const timer = setInterval(() => {
      setCountdown(calculateCountdown(auction.endDate, auction.endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [auction, isOpen, calculateCountdown]);

  // Fetch initial participants data when modal opens
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!auction || !isOpen) return;

      setIsLoadingInitialData(true);
      try {
        const response = await getAuctionParticipantsClient(auction._id);
        if (response.status === "success") {
          setInitialData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch initial participants:", error);
      } finally {
        setIsLoadingInitialData(false);
      }
    };

    fetchInitialData();
  }, [auction, isOpen]);

  // Join auction room when modal opens
  useEffect(() => {
    if (isOpen && auction && isConnected) {
      joinAuction(auction._id);
    }

    return () => {
      if (auction) {
        leaveAuction(auction._id);
        clearLeaderboardData();
      }
    };
  }, [isOpen, auction, isConnected, joinAuction, leaveAuction, clearLeaderboardData]);

  // Show new bid notification
  useEffect(() => {
    if (lastBid && lastBid.auctionId === auction?._id) {
      setShowNewBidNotification(true);
      const timer = setTimeout(() => setShowNewBidNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastBid, auction]);

  // Show time extension notification
  useEffect(() => {
    if (timeExtension && timeExtension.auctionId === auction?._id) {
      setShowExtensionNotification(true);
      const timer = setTimeout(() => setShowExtensionNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [timeExtension, auction]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !auction) return null;

  // Use leaderboard data from WebSocket if available, otherwise use initial fetched data
  const participants = leaderboardData?.participants || initialData?.participants || [];
  const currentHighestBid = leaderboardData?.currentHighestBid || initialData?.currentHighestBid || auction.currentHighestBid || auction.startPrice;
  const currentWinner = leaderboardData?.currentWinner || initialData?.currentWinner || null;
  const totalParticipants = leaderboardData?.totalParticipants || initialData?.totalParticipants || 0;
  const totalBids = leaderboardData?.totalBids || initialData?.totalBids || 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-primary-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Leaderboard Lelang</h2>
                <p className="text-sm text-gray-600 mt-1">{auction.itemName}</p>
              </div>
              <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2 mt-3">
              {isConnected ? <Wifi size={14} className="text-green-500" /> : <WifiOff size={14} className="text-red-500" />}
              <span className="text-xs font-medium text-gray-600">{isConnected ? "Realtime leaderboard" : "Menghubungkan..."}</span>
              {isConnected && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
            </div>
          </div>

          {/* Notifications */}
          {showNewBidNotification && lastBid && (
            <div className="mx-6 mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 animate-pulse">
              <div className="flex items-center">
                <TrendingUp size={20} className="text-blue-600 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">
                    Bid Baru! {lastBid.userName} bid {formatPrice(lastBid.bidAmount)}
                    {lastBid.isNewLeader && " 🏆"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {showExtensionNotification && timeExtension && (
            <div className="mx-6 mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center">
                <Clock size={20} className="text-yellow-600 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">
                    Lelang diperpanjang {timeExtension.extensionMinutes} menit! {timeExtension.reason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-red-600">⚠️</div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Auction Info Cards */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Start Date */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Tanggal Mulai</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(auction.startDate)}</p>
              </div>

              {/* End Date */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 font-medium">Tanggal Berakhir</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">{formatDate(auction.endDate)}</p>
              </div>

              {/* Time Remaining */}
              <div className="bg-primary/10 rounded-lg p-3 border border-primary">
                <p className="text-xs text-primary font-medium">Waktu Tersisa</p>
                <p className="text-sm font-semibold text-primary mt-1 font-mono">{countdown}</p>
              </div>
            </div>

            {/* Current Highest Bid */}
            <div className="mt-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-green-700 font-medium">Bid Tertinggi Saat Ini</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">{formatPrice(currentHighestBid)}</p>
                  {currentWinner && <p className="text-xs text-green-600 mt-1">oleh {currentWinner.name}</p>}
                </div>
                <Award size={48} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="px-6 pb-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Bid</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoadingInitialData ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                          </td>
                        </tr>
                      ))
                    ) : participants.length > 0 ? (
                      participants.map((participant, index) => {
                        const rank = index + 1;
                        const isHighestBidder = participant.isHighestBidder !== undefined ? participant.isHighestBidder : index === 0;

                        return (
                          <tr key={participant.userId} className={`hover:bg-gray-50 transition-colors ${isHighestBidder ? "bg-green-50" : ""}`}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                {rank === 1 ? (
                                  <span className="text-lg">🥇</span>
                                ) : rank === 2 ? (
                                  <span className="text-lg">🥈</span>
                                ) : rank === 3 ? (
                                  <span className="text-lg">🥉</span>
                                ) : (
                                  <span className="text-sm font-medium text-gray-900">{rank}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-gray-900">{participant.name}</span>
                                {isHighestBidder && <Award size={16} className="ml-2 text-green-600" />}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{participant.email}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm font-semibold text-gray-900">{formatPrice(participant.highestBid)}</span>
                              <span className="block text-xs text-gray-500">{participant.totalBids} bid</span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Users size={48} className="text-gray-300 mb-2" />
                            <p className="text-gray-500 text-sm">Belum ada bid</p>
                            <p className="text-gray-400 text-xs mt-1">Jadilah yang pertama untuk bid!</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Footer */}
              {participants.length > 0 && (
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Total Peserta: <span className="font-semibold text-gray-900">{totalParticipants}</span>
                    </span>
                    <span className="text-gray-600">
                      Total Bid: <span className="font-semibold text-gray-900">{totalBids}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Auction Ended Notice */}
          {auctionEnded && auctionEnded.auctionId === auction._id && (
            <div className="mx-6 mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-2xl">🏁</div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-purple-800">Lelang Selesai!</h3>
                  {auctionEnded.winner ? (
                    <p className="text-sm text-purple-700 mt-1">
                      Pemenang: <span className="font-semibold">{auctionEnded.winner.name}</span> dengan bid <span className="font-semibold">{formatPrice(auctionEnded.winner.winningBid)}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-purple-700 mt-1">Tidak ada pemenang - lelang berakhir tanpa bid</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
