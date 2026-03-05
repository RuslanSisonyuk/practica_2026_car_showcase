import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@prisma/client", "@neondatabase/serverless"],
  images: {
      remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.imagin.studio',
      },
    ],
  },
};

export default nextConfig;
