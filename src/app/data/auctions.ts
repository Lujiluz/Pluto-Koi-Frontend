// Mock data for ongoing auctions
export interface AuctionData {
  id: string;
  title: string;
  images: string[];
  currentPrice: number;
  startingPrice: number;
  highestBid: number;
  bidCount: number;
  endTime: string; // ISO date string
  status: "active" | "ending-soon" | "completed";
  description?: string;
}

export const mockAuctionData: AuctionData[] = [
  {
    id: "1",
    title: "Ikan Koi Mas BSD",
    images: ["/images/koi/koi-1.jpg", "/images/koi/koi-1-2.jpg", "/images/koi/koi-1-3.jpg"],
    currentPrice: 100000,
    startingPrice: 100000,
    highestBid: 1200000,
    bidCount: 2000,
    endTime: new Date(Date.now() + 1 * 60 * 60 * 1000 + 23 * 60 * 1000 + 45 * 1000).toISOString(), // 1h 23m 45s from now
    status: "active",
    description: "Ikan Koi berkualitas tinggi dengan warna yang indah dan ukuran yang sempurna untuk kolam Anda.",
  },
  {
    id: "2",
    title: "Ikan Koi Mas BSD",
    images: ["/images/koi/koi-2.jpg", "/images/koi/koi-2-2.jpg"],
    currentPrice: 100000,
    startingPrice: 100000,
    highestBid: 950000,
    bidCount: 1800,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // 2h 15m from now
    status: "ending-soon",
    description: "Koi premium dengan pola warna yang unik dan kesehatan yang terjamin.",
  },
  {
    id: "3",
    title: "Ikan Koi Mas BSD",
    images: ["/images/koi/koi-3.jpg"],
    currentPrice: 100000,
    startingPrice: 100000,
    highestBid: 800000,
    bidCount: 1500,
    endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30m from now
    status: "ending-soon",
    description: "Ikan Koi dengan genetik unggul dan pertumbuhan yang optimal.",
  },
  {
    id: "4",
    title: "Ikan Koi Mas BSD",
    images: ["/images/koi/koi-4.jpg"],
    currentPrice: 100000,
    startingPrice: 100000,
    highestBid: 1100000,
    bidCount: 2200,
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3h from now
    status: "active",
    description: "Koi champion dengan sertifikat dan riwayat kesehatan lengkap.",
  },
];

export const auctionSection = {
  title: "Lelang Sedang Berlangsung",
  subtitle: "Jangan sampai kelewatan! Ikut bid sekarang dan menangkan item pilihan dengan harga terbaik.",
};
