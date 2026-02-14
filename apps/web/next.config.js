const isDev = process.env.NODE_ENV !== 'production';

// Editor URL for CORS
const editorUrl = process.env.NEXT_PUBLIC_EDITOR_URL || 'http://localhost:5173';

// Allow Cloudflare tunnels in development
const allowedOrigins = isDev 
  ? '*'  // Allow all origins in dev (for Cloudflare tunnels)
  : (process.env.EDITOR_DOMAIN || editorUrl);

// CSP is more permissive in development for HMR/eval and Cloudflare tunnels
const cspValue = isDev
  ? "default-src 'self' https://*.trycloudflare.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http: blob:; font-src 'self' data:; connect-src 'self' https: http: ws: wss:; frame-ancestors 'self' https://*.trycloudflare.com;"
  : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; font-src 'self' data:; connect-src 'self' https: http:; frame-ancestors 'none';";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@builderly/core', '@builderly/sdk', '@builderly/ui', '@builderly/db'],
  // Hide Next.js dev indicator (N logo) in development
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.trycloudflare.com',
      },
    ],
  },
  // Security headers
  async headers() {
    return [
      // CORS headers for API routes (allow editor access)
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigins,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
      // General security headers (exclude _next/static so dev HMR doesn't trigger MIME-type blocks)
      {
        source: '/((?!_next/static|_next/image).*)',
        headers: [
          // X-Frame-Options: Allow in dev for Cloudflare tunnel, DENY in production
          ...(isDev ? [] : [{ key: 'X-Frame-Options', value: 'DENY' }]),
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: cspValue,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
