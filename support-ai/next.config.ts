/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: __dirname, // Ensures the current folder is used as project root
  },
};

module.exports = nextConfig;