"use client";

import { useState } from "react";
import { Lock, Users, Award, Clock } from "react-feather";
import LoginModal from "../common/LoginModal";
import RegisterModal from "../common/RegisterModal";
import { useAuth } from "@/hooks/useAuth";

export default function AuthRequiredSection() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const { refreshAuth } = useAuth();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleAuthSuccess = () => {
    refreshAuth();
    closeModals();
  };

  return (
    <>
      <section className="section-padding bg-white mx-8" id="lelang">
        <div className="container-custom">
          {/* Section Header */}
          <div className="mb-12 flex md:flex-row flex-col justify-between">
            <h2 className="text-responsive-3xl font-bold text-black mb-6 leading-tight">
              <span className="text-primary">Lelang</span> Eksklusif untuk Member
            </h2>
            <p className="text-responsive-base text-gray-800 leading-relaxed max-w-2xl">Akses lelang real-time hanya tersedia untuk member yang sudah login. Daftar sekarang dan nikmati pengalaman lelang yang seru!</p>
          </div>

          {/* Auth Required Content */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 lg:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              {/* Lock Icon */}
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary" />
              </div>

              {/* Main Message */}
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Masuk untuk Mengakses Lelang</h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">Bergabunglah dengan komunitas kami dan nikmati akses penuh ke lelang ikan koi eksklusif dengan sistem bidding real-time.</p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Lelang Real-Time</h4>
                  <p className="text-sm text-gray-600">Ikuti bid secara langsung dengan countdown yang menegangkan</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Komunitas Eksklusif</h4>
                  <p className="text-sm text-gray-600">Bergabung dengan pecinta ikan koi dari seluruh Indonesia</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Ikan Premium</h4>
                  <p className="text-sm text-gray-600">Temukan ikan koi berkualitas tinggi dari breeder terpercaya</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={openRegisterModal} className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-lg cursor-pointer">
                  Daftar Gratis Sekarang
                </button>
                <button onClick={openLoginModal} className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 text-lg cursor-pointer">
                  Sudah Punya Akun? Masuk
                </button>
              </div>

              {/* Additional Info */}
              <p className="text-sm text-gray-500 mt-6">Gratis untuk mendaftar • Lelang tersedia 24/7 • Support pelanggan siap membantu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeModals} onSwitchToRegister={switchToRegister} onSuccess={handleAuthSuccess} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeModals} onSwitchToLogin={switchToLogin} onSuccess={handleAuthSuccess} />
    </>
  );
}
