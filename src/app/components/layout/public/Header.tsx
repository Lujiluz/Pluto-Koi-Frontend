"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { NAVIGATION, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LogOut, User, Heart, ChevronDown, Package, ShoppingBag, Award } from "react-feather";
import RegisterModal from "../../common/RegisterModal";
import LoginModal from "../../common/LoginModal";
import ProgressLink from "../../common/ProgressLink";
import { useAuth } from "@/hooks/useAuth";
import { useToastNotification } from "@/hooks/useToastNotification";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasHandledVerified = useRef(false);
  const { user, isAuthenticated, logout, refreshAuth } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showSuccess } = useToastNotification();

  // Check for verified=true or openLogin=true query param on mount
  useEffect(() => {
    if (searchParams.get("verified") === "true" && !hasHandledVerified.current) {
      hasHandledVerified.current = true;
      setShowVerifiedMessage(true);
      setIsLoginModalOpen(true);
      // Show toast notification
      showSuccess("Akun Anda berhasil diverifikasi! Silahkan lakukan login", "Verifikasi Berhasil");
      // Clean up the URL by removing the query param
      const url = new URL(window.location.href);
      url.searchParams.delete("verified");
      router.replace(url.pathname, { scroll: false });
    } else if (searchParams.get("openLogin") === "true") {
      setIsLoginModalOpen(true);
      // Clean up the URL by removing the query param
      const url = new URL(window.location.href);
      url.searchParams.delete("openLogin");
      router.replace(url.pathname, { scroll: false });
    }
  }, [searchParams, router, showSuccess]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const closeModals = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(false);
    setShowVerifiedMessage(false); // Reset verified message when closing
  };

  const switchToLogin = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const switchToRegister = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  // Function to handle successful login/register
  const handleAuthSuccess = () => {
    refreshAuth();
    closeModals();
  };

  // Close dropdown when clicking outside
  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <div className="container-custom">
        <div className="bg-white flex items-center justify-between h-16 lg:h-16">
          {/* Logo */}
          <ProgressLink href="/" className="flex items-center space-x-2 px-8">
            <Image src="/images/LOGO PLUTO-01.png" alt="Logo" width={90} height={90} />
            {/* <span className="font-extralight tracking-[0.2em] text-lg lg:text-xl font-poppins">{SITE_CONFIG.name.toUpperCase()}</span> */}
          </ProgressLink>

          {/* Desktop Nav */}
          <div className="bg-primary flex items-center justify-end lg:justify-between h-full w-[65%] px-8">
            <nav className="hidden lg:flex items-center space-x-12">
              {NAVIGATION.main.map((item) => (
                <ProgressLink key={item.href} href={item.href} className="nav-link-desktop text-white text-responsive-base !font-medium">
                  {item.label}
                </ProgressLink>
              ))}
            </nav>

            {/* Desktop Login/Register CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  {/* Wishlist Link */}
                  <ProgressLink href="/wishlist" className="flex items-center space-x-1 text-white hover:text-gray-200 transition-colors duration-200" title="Wishlist">
                    <Heart size={18} />
                    <span className="font-medium">Wishlist</span>
                  </ProgressLink>

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button onClick={handleUserDropdownToggle} className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-200 group">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <User size={16} />
                      </div>
                      <span className="font-medium">{user?.name}</span>
                      <ChevronDown size={16} className={`transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isUserDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-600">{user?.email}</p>
                        </div>

                        <Link href="/transaksi" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Package size={16} />
                          <span>Riwayat Transaksi</span>
                        </Link>

                        <Link href="/lelang-saya" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Award size={16} />
                          <span>Lelang Saya</span>
                        </Link>

                        <Link href="/wishlist" onClick={() => setIsUserDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <Heart size={16} />
                          <span>Wishlist Saya</span>
                        </Link>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                            <LogOut size={16} />
                            <span>Keluar</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={openRegisterModal} className="btn-tersier !text-white !font-medium !border-white !hover:bg-primary-500 px-6 py-2">
                    Daftar
                  </button>
                  <button onClick={openLoginModal} className="bg-white text-primary cursor-pointer hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-colors duration-200">
                    Masuk
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMobileMenu} className="lg:hidden p-2 transition-colors" aria-label="Toggle mobile menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn("bg-gradient-to-b from-gray-50 to-white lg:hidden transition-all duration-300 ease-in-out overflow-hidden border-t border-gray-100", isMobileMenuOpen ? "max-h-[calc(100vh-4rem)] pb-6 overflow-y-auto" : "max-h-0")}
        >
          <nav className="flex flex-col space-y-1 pt-4 px-4 pb-4">
            {NAVIGATION.main.map((item) => (
              <ProgressLink
                key={item.href}
                href={item.href}
                className="nav-link py-3 px-4 rounded-lg transition-all duration-200 hover:bg-primary-50 hover:text-primary-600 text-gray-700 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </ProgressLink>
            ))}

            {/* Authentication Section */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User size={18} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-2">
                    {/* Wishlist Link */}
                    <ProgressLink
                      href="/wishlist"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center space-x-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-primary hover:text-primary font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm"
                    >
                      <Heart size={18} />
                      <span>Wishlist Saya</span>
                    </ProgressLink>

                    {/* Lelang Saya Link */}
                    <ProgressLink
                      href="/lelang-saya"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center space-x-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-primary hover:text-primary font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm"
                    >
                      <Award size={18} />
                      <span>Lelang Saya</span>
                    </ProgressLink>

                    {/* Transaction History Link */}
                    <ProgressLink
                      href="/transaksi"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center space-x-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-primary hover:text-primary font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm"
                    >
                      <Package size={18} />
                      <span>Riwayat Transaksi</span>
                    </ProgressLink>
                  </div>

                  {/* Logout Button - Separated for emphasis */}
                  <div className="pt-2 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-3 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm"
                    >
                      <LogOut size={18} />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Register Button */}
                  <button onClick={openRegisterModal} className="w-full bg-white border border-primary text-primary hover:bg-primary hover:text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm">
                    Daftar
                  </button>

                  {/* Login Button */}
                  <button onClick={openLoginModal} className="w-full bg-primary text-white hover:bg-primary-600 font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm">
                    Masuk
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Modals */}
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeModals} onSwitchToLogin={switchToLogin} onSuccess={handleAuthSuccess} />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeModals} onSwitchToRegister={switchToRegister} onSuccess={handleAuthSuccess} showVerifiedMessage={showVerifiedMessage} />
    </header>
  );
}
