/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // توجيه طلبات API إلى خادم Express
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*', // سيتم توجيه الطلبات إلى خادم Express
      },
    ];
  },
};

module.exports = nextConfig;