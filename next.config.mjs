/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'susan-demo.myshopify.com',
      },
    ],
  },
};

export default nextConfig;
