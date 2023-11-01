/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
