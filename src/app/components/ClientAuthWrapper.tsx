"use client";

import { useAuth } from "@/hooks/useAuth";
import AuthRequiredSection from "./sections/AuthRequiredSection";
import AuctionSectionClient from "./sections/AuctionSectionClient";

export default function ClientAuthWrapper() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <section className="section-padding bg-white mx-8" id="lelang">
        <div className="container-custom">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat...</p>
          </div>
        </div>
      </section>
    );
  }

  return isAuthenticated ? <AuctionSectionClient /> : <AuthRequiredSection />;
}
