/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // Configure image domains if needed
  images: {
    domains: ['localhost', '0.0.0.0'],
  },
  // Using the dir attribute in _document.tsx for RTL instead
  // since i18n config is not supported in App Router
};

module.exports = nextConfig;