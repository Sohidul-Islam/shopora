/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    // Allow serving from /public/uploads
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;
