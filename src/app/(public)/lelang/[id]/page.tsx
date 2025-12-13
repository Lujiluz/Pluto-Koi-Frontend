"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuctionDetail } from "@/hooks/useAuctions";
import BidModal from "@/app/components/common/BidModal";
import AuctionLeaderboardModal from "@/app/components/common/AuctionLeaderboardModal";
import { AuctionData } from "@/data/auctions";
import { formatPrice, getTimeRemainingObject, getAuctionStatus, isVideoUrl } from "@/services/auctionService";
import { ArrowLeft, Clock, DollarSign, Calendar, Award } from "react-feather";
import Footer from "@/app/components/layout/public/Footer";

export default function AuctionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const auctionId = params.id as string;

  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [mediaError, setMediaError] = useState<{ [key: number]: boolean }>({});

  const { data: auctionResponse, isLoading, error, isError, refetch } = useAuctionDetail(auctionId);

  const auction = auctionResponse?.status === "success" ? auctionResponse.data : null;

  const [timeRemaining, setTimeRemaining] = useState(auction ? getTimeRemainingObject(auction.endDate) : { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });

  useEffect(() => {
    if (!auction) return;

    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemainingObject(auction.endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const formatTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  const handleBidClick = () => {
    setIsBidModalOpen(true);
  };

  const handleBidModalClose = () => {
    setIsBidModalOpen(false);
  };

  const handleBidSuccess = () => {
    // Refresh auction data after successful bid
    refetch();
  };

  const handleLeaderboardClick = () => {
    setIsLeaderboardModalOpen(true);
  };

  const handleLeaderboardModalClose = () => {
    setIsLeaderboardModalOpen(false);
  };

  // Convert BackendAuctionDetail to AuctionData format for BidModal compatibility
  console.log("AUCTION: ", auction);
  const convertedAuction = auction
    ? ({
        id: auction._id,
        title: auction.itemName,
        images: auction.media.map((media) => media.fileUrl),
        currentPrice: auction.highestBid || auction.startPrice,
        startingPrice: auction.startPrice,
        highestBid: auction.highestBid || 0,
        bidCount: auction.currentWinner ? 1 : 0,
        endTime: auction.endDate,
        status: "active" as const,
      } as AuctionData)
    : null;

  const isAuctionEnded = auction ? getAuctionStatus(auction.startDate, auction.endDate) === "completed" || timeRemaining.isExpired : false;

  const renderMedia = (mediaUrl: string, index: number) => {
    const isVideo = isVideoUrl(mediaUrl);

    if (mediaError[index]) {
      return <Image src="/images/koi/contoh_ikan.png" alt={auction?.itemName || "Auction"} fill className="object-cover" />;
    }

    if (isVideo) {
      return (
        <video
          src={mediaUrl}
          className="w-full h-full object-cover"
          controls
          autoPlay={index === selectedMediaIndex}
          loop
          playsInline
          onError={() => {
            setMediaError((prev) => ({ ...prev, [index]: true }));
          }}
        />
      );
    } else {
      return (
        <Image
          src={mediaUrl}
          alt={auction?.itemName || "Auction"}
          fill
          className="object-cover"
          onError={() => {
            setMediaError((prev) => ({ ...prev, [index]: true }));
          }}
        />
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail lelang...</p>
        </div>
      </div>
    );
  }

  if (isError || !auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lelang Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">{error instanceof Error ? error.message : "Gagal memuat detail lelang"}</p>
          <button onClick={() => router.push("/lelang")} className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors">
            Kembali ke Daftar Lelang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-4">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Kembali</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Media Gallery */}
          <div className="space-y-4">
            {/* Main Media Display */}
            <div className="relative aspect-square bg-gray-200 rounded-xl overflow-hidden">
              {auction.media.length > 0 && renderMedia(auction.media[selectedMediaIndex].fileUrl, selectedMediaIndex)}

              {/* Status Badge */}
              {isAuctionEnded ? (
                <div className="absolute top-4 left-4 bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Lelang Selesai</div>
              ) : (
                <div className="absolute top-4 left-4 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {timeRemaining.days > 0 ? (
                    <>
                      {timeRemaining.days} Hari {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}
                    </>
                  ) : (
                    <>
                      {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {auction.media.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {auction.media.map((media, index) => (
                  <button
                    key={media._id}
                    onClick={() => setSelectedMediaIndex(index)}
                    className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 transition-all ${selectedMediaIndex === index ? "border-primary" : "border-transparent hover:border-gray-300"}`}
                  >
                    {mediaError[index] ? (
                      <Image src="/images/koi/contoh_ikan.png" alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
                    ) : isVideoUrl(media.fileUrl) ? (
                      <video src={media.fileUrl} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <Image
                        src={media.fileUrl}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={() => {
                          setMediaError((prev) => ({ ...prev, [index]: true }));
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Auction Details */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{auction.itemName}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>Mulai: {new Date(auction.startDate).toLocaleDateString("id-ID", { dateStyle: "long" })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <Clock size={16} />
                <span>
                  Berakhir: {new Date(auction.endDate).toLocaleDateString("id-ID", { dateStyle: "long" })} pukul {new Date(auction.endTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {/* Price Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <DollarSign size={16} />
                  <span className="text-sm">Harga Mulai</span>
                </div>
                <p className="text-xl font-bold text-gray-900">{formatPrice(auction.startPrice)}</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Award size={16} />
                  <span className="text-sm">Bid Tertinggi</span>
                </div>
                <p className="text-xl font-bold text-primary">{formatPrice(auction.highestBid || 0)}</p>
              </div>
            </div>

            {/* Current Winner */}
            {auction.currentWinner && (
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-4 border border-primary-200">
                <div className="flex items-center gap-2 text-primary-700 mb-1">
                  <Award size={18} />
                  <span className="text-sm font-medium">Pemenang Sementara</span>
                </div>
                <p className="text-lg font-bold text-primary-900">{auction.currentWinner.userId.name}</p>
                <p className="text-sm text-primary-700">Bid: {formatPrice(auction.currentWinner.bidAmount)}</p>
              </div>
            )}

            {/* Extra Time Info */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Waktu Tambahan:</span> {auction.extraTime} menit akan ditambahkan jika ada bid baru mendekati waktu berakhir
              </p>
            </div>

            {/* Auction Details/Notes */}
            {auction.note && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Ikan</h2>
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: auction.note }} />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBidClick}
                disabled={isAuctionEnded}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all ${isAuctionEnded ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary hover:bg-primary-600 text-white shadow-lg hover:shadow-xl"}`}
              >
                {isAuctionEnded ? "Lelang Selesai" : "Mulai Bid"}
              </button>

              <button onClick={handleLeaderboardClick} className="flex-1 py-4 px-6 rounded-xl font-semibold text-lg bg-white text-primary border-2 border-primary hover:bg-primary-50 transition-all">
                Lihat Leaderboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {convertedAuction && <BidModal isOpen={isBidModalOpen} onClose={handleBidModalClose} auction={convertedAuction} onSuccess={handleBidSuccess} />}

      {/* Leaderboard Modal */}
      <AuctionLeaderboardModal isOpen={isLeaderboardModalOpen} onClose={handleLeaderboardModalClose} auction={auction} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
