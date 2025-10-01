"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAVIGATION, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import RegisterModal from "../../common/RegisterModal";
import LoginModal from "../../common/LoginModal";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
              <button onClick={openRegisterModal} className="btn-tersier !text-white !font-medium !border-white !hover:bg-primary-500 px-6 py-2">
                Daftar
              </button>
              <button onClick={openLoginModal} className="bg-white text-primary cursor-pointer hover:bg-gray-100 font-medium px-6 py-2 rounded-lg transition-colors duration-200">
                Masuk
              </button>
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
        <div className={cn("bg-white lg:hidden transition-all duration-300 ease-in-out overflow-hidden", isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0")}>
          <nav className="flex flex-col space-y-2 pt-4">
            {NAVIGATION.main.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link py-2 px-6 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4">
              <button onClick={openRegisterModal} className="btn-outline py-2 text-center">
                Daftar
              </button>
              <button onClick={openLoginModal} className="btn-primary hover:bg-gray-100 font-medium py-2 rounded-lg transition-colors text-center">
                Masuk
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Modals */}
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeModals} onSwitchToLogin={switchToLogin} />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeModals} onSwitchToRegister={switchToRegister} />
    </header>
  );
}
