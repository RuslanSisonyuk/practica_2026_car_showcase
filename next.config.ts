import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
      remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.imagin.studio',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.pexels.com',
      },
    ],
  },
};

export default nextConfig;
