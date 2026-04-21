import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // สำหรับ production deploy
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
