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
    <footer className="bg-black text-white py-12 lg:py-16 px-6">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-12">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/pluto-koi-icon.svg" alt="Logo" width={40} height={40} />
            <span className="font-extralight tracking-[0.2em] text-lg lg:text-xl font-poppins">{SITE_CONFIG.name.toUpperCase()}</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-12 lg:gap-16">
            {NAVIGATION.main.map((link) => (
              <a key={link.label} href={link.href} className="font-bold hover:text-gray-300 transition-colors duration-300 text-base lg:text-lg">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8 w-[95%] mx-auto"></div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-sm lg:text-base">© Copyright {currentYear}, All Rights Reserved by Pluto Koi</p>
        </div>
      </div>
    </footer>
  );
}
