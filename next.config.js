// 🐾⚡ NEKO DEFENSE DASHBOARD - Next.js Configuration ⚡🐾
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Environment variables
  env: {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
    REACT_APP_GRAPHQL_URL: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:5000/graphql',
  },

  // Allow server to run on port 3000
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
