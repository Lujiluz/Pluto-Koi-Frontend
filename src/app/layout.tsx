import type { Metadata } from "next";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import LiquidGlassSvgFilter from "./components/icons/SvgFilters";

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  icons: {
    icon: SITE_CONFIG.favicon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">
        <LiquidGlassSvgFilter />
        {children}
      </body>
    </html>
  );
}
