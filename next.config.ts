import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hotelterrabella.com.co",
      },
      {
        protocol: "https",
        hostname: "lacasonahotelboutique.com.co",
      },
      {
        protocol: "https",
        hostname: "infinityhotel.com.co",
      },
    ],
  },
};

export default nextConfig;
