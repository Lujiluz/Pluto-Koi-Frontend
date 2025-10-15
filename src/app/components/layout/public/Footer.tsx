"use client";

import Image from "next/image";
import { TwitterIcon, FacebookIcon, InstagramIcon } from "../../icons/landingPage";
import { NAVIGATION, SITE_CONFIG } from "@/lib/constants";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: TwitterIcon, href: "#", label: "Twitter" },
    { icon: FacebookIcon, href: "#", label: "Facebook" },
    { icon: InstagramIcon, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-black text-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center space-y-8 lg:flex-row lg:justify-between lg:space-y-0 mb-8 sm:mb-12">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 order-1 lg:order-none">
            <Image src="/images/pluto-koi-icon.svg" alt="Logo" width={32} height={32} className="sm:w-10 sm:h-10" />
            <span className="font-extralight tracking-[0.2em] text-base sm:text-lg lg:text-xl font-poppins">{SITE_CONFIG.name.toUpperCase()}</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 order-3 lg:order-none">
            {NAVIGATION.main.map((link) => (
              <a key={link.label} href={link.href} className="font-bold hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base lg:text-lg text-center">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Media Icons */}
          <div className="flex items-center gap-3 sm:gap-4 mb-2 order-3 lg:order-none">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-6 sm:mb-8 w-full sm:w-[95%] mx-auto"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-xs sm:text-sm lg:text-base px-4">© Copyright {currentYear}, All Rights Reserved by Pluto Koi</p>
        </div>
      </div>
    </footer>
  );
}
