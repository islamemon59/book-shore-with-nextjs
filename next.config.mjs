/** @type {import('next').NextConfig} */
const nextConfig = {
      images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'susan-demo.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'baatighar.com',
      },
      {
        protocol: 'https',
        hostname: 'susan-demo.myshopify.com',
      },
      {
        protocol: 'https',
        hostname: 'pathakshamabesh.com',
      },
      {
        protocol: 'https',
        hostname: 'eboighar-static.s3.ap-southeast-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
  },
};

export default nextConfig;
