/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // Allow cross-origin requests in development mode (for Replit environment)
  allowedDevOrigins: [
    /^https:\/\/.*\.replit\.dev$/,
    /^https:\/\/.*\.repl\.co$/,
    /^https:\/\/.*-.*\.spock\.replit\.dev$/,
  ],
  // Configure image domains if needed
  images: {
    domains: ['localhost', '0.0.0.0'],
  },
  // Include RTL CSS direction for Arabic content
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    // This is a required field for RTL support
    // The site will be RTL for Arabic and LTR for English
    localeDetection: true,
  },
};

module.exports = nextConfig;