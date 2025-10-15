"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAVIGATION, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LogOut, User } from "react-feather";
import RegisterModal from "../../common/RegisterModal";
import LoginModal from "../../common/LoginModal";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, isAuthenticated, logout, refreshAuth } = useAuth();

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
  };

  // Function to handle successful login/register
  const handleAuthSuccess = () => {
    refreshAuth();
    closeModals();
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg">
      <div className="container-custom">
        <div className="bg-white flex items-center justify-between h-16 lg:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 px-8">
            <Image src="/images/pluto-koi-icon.svg" alt="Logo" width={40} height={40} />
            <span className="font-extralight tracking-[0.2em] text-lg lg:text-xl font-poppins">{SITE_CONFIG.name.toUpperCase()}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="bg-primary flex items-center justify-end lg:justify-between h-full w-[65%] px-8">
            <nav className="hidden lg:flex items-center space-x-12">
              {NAVIGATION.main.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link-desktop text-white text-responsive-base !font-medium">
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Login/Register CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-white">
                    <User size={18} />
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <button onClick={handleLogout} className="flex items-center space-x-1 bg-white text-primary hover:bg-gray-100 font-medium px-4 py-2 rounded-lg transition-colors duration-200">
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
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
        <div className={cn("bg-gradient-to-b from-gray-50 to-white lg:hidden transition-all duration-300 ease-in-out overflow-hidden border-t border-gray-100", isMobileMenuOpen ? "max-h-[500px] pb-6" : "max-h-0")}>
          <nav className="flex flex-col space-y-1 pt-4 px-4">
            {NAVIGATION.main.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link py-3 px-4 rounded-lg transition-all duration-200 hover:bg-primary-50 hover:text-primary-600 text-gray-700 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}

            {/* Authentication Section */}
            <div className="pt-4 mt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="space-y-3">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-700 text-sm">{user?.name}</span>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-primary hover:text-primary font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-sm"
                  >
                    <LogOut size={16} />
                    <span>Keluar</span>
                  </button>
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
      <LoginModal isOpen={isLoginModalOpen} onClose={closeModals} onSwitchToRegister={switchToRegister} onSuccess={handleAuthSuccess} />
    </header>
  );
}
