/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  allowedDevOrigins: [
    'https://*.replit.dev',
    'https://*.replit.app',
    'http://127.0.0.1:*',
    'http://localhost:*'
  ],
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
    ];
  },
};

module.exports = nextConfig;
