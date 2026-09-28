/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 14: this option lives under `experimental` (top-level only since Next 15).
  experimental: {
    outputFileTracingIncludes: {
      '/api/education/download': ['./content/education/**/*'],
    },
  },
};
module.exports = nextConfig;
