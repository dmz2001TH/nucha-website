import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'console.baanmaevilla.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
    minimumCacheTTL: 86400,
  },

  // Compress responses
  compress: true,

  // Disable React strict mode in production for better perf (keep in dev)
  reactStrictMode: process.env.NODE_ENV === 'development',

  // Optimize production builds
  poweredByHeader: false,

  // Experimental features for performance
  experimental: {
    optimizeCss: true,
  },

  // Production source maps off for faster builds
  productionBrowserSourceMaps: false,

  // Headers for caching (production only - no /_next/static to avoid dev warning)
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.svg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
