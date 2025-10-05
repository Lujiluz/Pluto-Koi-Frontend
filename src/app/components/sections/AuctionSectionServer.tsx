import { getAuctionsServer } from "@/services/auctionService";
import AuctionSectionClient from "./AuctionSectionClient";

export default async function AuctionSectionServer() {
  try {
    const auctionData = await getAuctionsServer();

    if (!auctionData || auctionData.status !== "success") {
      return (
        <section className="section-padding bg-white mx-8" id="lelang">
          <div className="container-custom">
            <div className="text-center py-12">
              <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
                <span className="text-primary">Lelang</span> Sedang Berlangsung
              </h2>
              <p className="text-gray-600">Tidak ada lelang yang tersedia saat ini.</p>
            </div>
          </div>
        </section>
      );
    }

    return <AuctionSectionClient initialData={auctionData} />;
  } catch (error) {
    console.error("Error loading auctions:", error);

    return (
      <section className="section-padding bg-white mx-8" id="lelang">
        <div className="container-custom">
          <div className="text-center py-12">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Lelang</span> Sedang Berlangsung
            </h2>
            <p className="text-red-600">Gagal memuat data lelang. Silakan coba lagi nanti.</p>
          </div>
        </div>
      </section>
    );
  }
}
