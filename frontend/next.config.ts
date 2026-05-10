import type { NextConfig } from "next";

const backendBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/auth/:path*",
          destination: `${backendBaseUrl}/api/auth/:path*`,
        },
        {
          source: "/api/proxy/:path*",
          destination: `${backendBaseUrl}/:path*`,
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
