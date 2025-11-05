import ClientAuthWrapper from "@/app/components/ClientAuthWrapper";
import Footer from "@/app/components/layout/public/Footer";

export default function AuctionPage() {
  return (
    <div className="min-h-screen">
      {/* Auction Section - Only show for authenticated users */}
      <ClientAuthWrapper />

      {/* Footer */}
      <Footer />
    </div>
  );
}
