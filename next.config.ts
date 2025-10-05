import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http", // Or 'https' if your local server uses HTTPS
        hostname: "localhost",
        port: "1728", // e.g., '3000', '8000', etc.
        pathname: "/media/**", // e.g., '/images/**', '/api/images/**'
      },
      // Add other remote patterns for external image sources if needed
    ],
  },
};

export default nextConfig;
