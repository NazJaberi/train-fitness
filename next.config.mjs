/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'www.boostjuice.com.au',
      },
      // ADD THIS NEW BLOCK FOR SANITY IMAGES
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;