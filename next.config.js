// 🐾⚡ NEKO DEFENSE DASHBOARD - Next.js Configuration ⚡🐾
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Environment variables (NEXT_PUBLIC_ prefix for browser access)
  env: {
    // Legacy support for REACT_APP_ prefix (backwards compatibility)
    REACT_APP_API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
    REACT_APP_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL || process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:5000/graphql',

    // Next.js standard (use these in new code!)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql',
  },

  // Production build optimizations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression

  // Image optimization (if using Next.js Image component)
  images: {
    domains: ['localhost', 'trycloudflare.com', 'vercel.app', 'railway.app'],
  },

  // CORS headers
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
