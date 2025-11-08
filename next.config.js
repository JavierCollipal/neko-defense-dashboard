// 🐾⚡ NEKO DEFENSE DASHBOARD - Next.js Configuration (2025 OPTIMIZED!) ⚡🐾
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 🚀 2025 PERFORMANCE OPTIMIZATIONS

  // Experimental features for Next.js 14
  experimental: {
    // Optimize package imports (reduces bundle size)
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'recharts',
    ],

    // Enable Web Vitals attribution for better debugging
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'TTFB', 'INP'],
  },

  // Environment variables (NEXT_PUBLIC_ prefix for browser access)
  env: {
    // Legacy support for REACT_APP_ prefix (backwards compatibility)
    REACT_APP_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.REACT_APP_API_URL ||
      'http://localhost:5001/api',
    REACT_APP_GRAPHQL_URL:
      process.env.NEXT_PUBLIC_GRAPHQL_URL ||
      process.env.REACT_APP_GRAPHQL_URL ||
      'http://localhost:5000/graphql',

    // Next.js standard (use these in new code!)
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
    NEXT_PUBLIC_GRAPHQL_URL:
      process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:5000/graphql',
  },

  // Production build optimizations
  poweredByHeader: false, // Remove X-Powered-By header (security)
  compress: true, // Enable gzip compression

  // ⚡ VERCEL OPTIMIZATION: Leverage Fluid Compute (Pro)
  // Note: Enable in Vercel Dashboard Settings → Functions → Fluid Compute

  // 🖼️ Image optimization (Vercel automatic optimization)
  images: {
    domains: ['localhost', 'trycloudflare.com', 'vercel.app', 'railway.app'],
    formats: ['image/avif', 'image/webp'], // Modern formats (smaller size)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Responsive sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256], // Icon sizes
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },

  // 🎯 Performance monitoring
  // Vercel Analytics and Speed Insights already enabled via @vercel/analytics package

  // 🔒 Security headers (2025 standards)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // CORS
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },

          // Security (2025 best practices)
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },

          // Permissions Policy (restrict features)
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // 📦 Webpack optimizations (reduce build time)
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking for all libraries
      config.optimization.usedExports = true;

      // Minimize CSS
      config.optimization.minimize = true;
    }

    return config;
  },
};

module.exports = nextConfig;
