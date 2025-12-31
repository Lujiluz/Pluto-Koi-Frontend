"use client";

import Image from "next/image";
import { FacebookIcon, InstagramIcon, MapIcon, TiktokIcon, WhatsappIcon, YoutubeIcon } from "../../icons/landingPage";
import { NAVIGATION, SITE_CONFIG, WHATSAPP_TEMPLATES } from "@/lib/constants";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: YoutubeIcon, href: "https://youtube.com/@plutokarpio1984", label: "Youtube", name: "plutokarpio1984" },
    { icon: InstagramIcon, href: "https://www.instagram.com/pluto_koi_centre", label: "Instagram", name: "pluto_koi_centre" },
    { icon: WhatsappIcon, href: `https://wa.me/+6285780004878?text=${encodeURIComponent(WHATSAPP_TEMPLATES.general)}`, label: "Whatsapp", name: "+62-857-8000-4878" },
    { icon: TiktokIcon, href: "https://www.tiktok.com/@plutokarpio", label: "Tiktok", name: "plutokarpio" },
    { icon: MapIcon, href: "https://maps.app.goo.gl/QQeS6CQ9WiABcY6R9", label: "Maps", name: "Pluto Koi Centre" },
  ];

  return (
    <footer className="bg-black text-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="flex flex-col items-center space-y-8 px-8 lg:flex-row lg:justify-between lg:space-y-0 mb-8 sm:mb-12">
          {/* Logo */}
          <Link href="/" className="flex items-center me-18 md:me-0 order-1 lg:order-none">
            <Image src="/images/LOGO PLUTO-02.png" alt="Logo" width={100} height={100} />
            {/* <span className="font-extralight tracking-[0.2em] text-base sm:text-lg lg:text-xl font-poppins">{SITE_CONFIG.name.toUpperCase()}</span> */}
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 lg:gap-10 xl:gap-12 order-2 lg:order-none">
            {NAVIGATION.main.map((link) => (
              <a key={link.label} href={link.href} className="font-bold hover:text-gray-300 transition-colors duration-300 text-sm sm:text-base lg:text-lg text-center">
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Media Icons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 order-3 lg:order-none">
            {socialLinks.map((social, i) => {
              const IconComponent = social.icon;
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  {/* Icon Container */}
                  <div className="relative group">
                    <a
                      href={social.href}
                      aria-label={social.label}
                      className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-primary rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300 transform hover:scale-110"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent />
                    </a>

                    {/* Desktop Tooltip - Hidden on mobile */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">{social.name}</div>
                      {/* Tooltip Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>

                  {/* Mobile Label - Only visible on mobile */}
                  <span className="block sm:hidden text-xs text-gray-400 font-medium">{social.name}</span>
                </div>
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
