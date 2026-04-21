import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // สำหรับ production deploy
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
