import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http", // HTTP for localhost development
        hostname: "localhost",
        port: "1728", // Your backend port
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "pluto-koi-backend.onrender.com",
        pathname: "/media/**",
      },
      // Add other remote patterns for external image sources if needed
    ],
  },
};

export default nextConfig;
