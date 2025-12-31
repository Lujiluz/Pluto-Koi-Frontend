import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import LiquidGlassSvgFilter from "./components/icons/SvgFilters";
import TopProgressBar from "./components/common/TopProgressBar";

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
    <html lang="en" className="scroll-smooth translated-ltr">
      <body className="font-sans antialiased">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        <LiquidGlassSvgFilter />
        {children}
      </body>
    </html>
  );
}
