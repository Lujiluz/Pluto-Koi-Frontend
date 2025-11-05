"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Types based on WebSocket documentation
export interface AuctionParticipant {
  userId: string;
  name: string;
  email: string;
  totalBids: number;
  highestBid: number;
  latestBidTime: Date;
  isHighestBidder: boolean;
  rank: number;
}

export interface LeaderboardData {
  auctionId: string;
  participants: AuctionParticipant[];
  currentHighestBid: number;
  currentWinner: {
    userId: string;
    name: string;
    bidAmount: number;
  } | null;
  totalParticipants: number;
  totalBids: number;
  timestamp: Date;
}

export interface NewBidData {
  auctionId: string;
  userId: string;
  userName: string;
  bidAmount: number;
  bidType: "initial" | "outbid" | "winning" | "auto";
  bidTime: Date;
  isNewLeader: boolean;
}

export interface TimeExtensionData {
  auctionId: string;
  newEndTime: Date;
  extensionMinutes: number;
  reason: string;
  timestamp: Date;
}

export interface AuctionEndedData {
  auctionId: string;
  winner: {
    userId: string;
    name: string;
    winningBid: number;
  } | null;
  totalBids: number;
  totalParticipants: number;
  timestamp: Date;
}

export interface SocketError {
  message: string;
  code?: string;
  timestamp: Date;
}

export function useAuctionSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [lastBid, setLastBid] = useState<NewBidData | null>(null);
  const [timeExtension, setTimeExtension] = useState<TimeExtensionData | null>(null);
  const [auctionEnded, setAuctionEnded] = useState<AuctionEndedData | null>(null);
  const [error, setError] = useState<SocketError | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.warn("No auth token found, WebSocket connection will not be established");
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL?.replace("/api/pluto-koi/v1", "") || "http://localhost:1728";

    const newSocket = io(backendUrl, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setError(null);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
      setError({
        message: "Failed to connect to auction server",
        code: "CONNECTION_ERROR",
        timestamp: new Date(),
      });
      setIsConnected(false);
    });

    // Auction-specific event handlers
    newSocket.on("auction_leaderboard_update", (data: LeaderboardData) => {
      console.log("Leaderboard update received:", data);
      setLeaderboardData(data);
    });

    newSocket.on("new_bid_placed", (data: NewBidData) => {
      console.log("New bid placed:", data);
      setLastBid(data);
    });

    newSocket.on("auction_time_extended", (data: TimeExtensionData) => {
      console.log("Auction time extended:", data);
      setTimeExtension(data);
    });

    newSocket.on("auction_ended", (data: AuctionEndedData) => {
      console.log("Auction ended:", data);
      setAuctionEnded(data);
    });

    newSocket.on("error", (data: SocketError) => {
      console.error("Socket error:", data);
      setError(data);
    });

    // Join/Leave acknowledgments
    newSocket.on("joined_auction", (data) => {
      console.log("Successfully joined auction:", data);
    });

    newSocket.on("left_auction", (data) => {
      console.log("Successfully left auction:", data);
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, []);

  // Join auction room
  const joinAuction = useCallback(
    (auctionId: string) => {
      if (socketRef.current && isConnected) {
        console.log("Joining auction:", auctionId);
        socketRef.current.emit("join_auction", { auctionId });
      } else {
        console.warn("Cannot join auction: socket not connected");
      }
    },
    [isConnected]
  );

  // Leave auction room
  const leaveAuction = useCallback((auctionId: string) => {
    if (socketRef.current) {
      console.log("Leaving auction:", auctionId);
      socketRef.current.emit("leave_auction", { auctionId });
    }
  }, []);

  // Clear leaderboard data
  const clearLeaderboardData = useCallback(() => {
    setLeaderboardData(null);
    setLastBid(null);
    setTimeExtension(null);
    setAuctionEnded(null);
    setError(null);
  }, []);

  return {
    socket,
    isConnected,
    leaderboardData,
    lastBid,
    timeExtension,
    auctionEnded,
    error,
    joinAuction,
    leaveAuction,
    clearLeaderboardData,
  };
}
