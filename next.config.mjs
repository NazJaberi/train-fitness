// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com', // Keep this one
      },
      {
        protocol: 'https',
        hostname: 'www.boostjuice.com.au', // Add this new one
      },
    ],
  },
};

export default nextConfig;