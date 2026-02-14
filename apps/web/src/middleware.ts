import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isDev = process.env.NODE_ENV !== 'production';
const editorUrl = process.env.NEXT_PUBLIC_EDITOR_URL || 'http://localhost:5173';
const appHostname = process.env.APP_HOSTNAME || 'localhost:3000';

// ============================================================================
// IN-MEMORY RATE LIMITING
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Simple in-memory rate limit store (per-instance, not distributed)
// For production, use Redis via the rateLimit() function in API routes
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP

// Cleanup old entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupRateLimitStore() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  
  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfter?: number } {
  cleanupRateLimitStore();
  
  const now = Date.now();
  const key = `api:${ip}`;
  const entry = rateLimitStore.get(key);
  
  if (!entry || entry.resetAt < now) {
    // Start new window
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  
  entry.count++;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
  const allowed = entry.count <= RATE_LIMIT_MAX_REQUESTS;
  
  return {
    allowed,
    remaining,
    retryAfter: allowed ? undefined : Math.ceil((entry.resetAt - now) / 1000),
  };
}

// ============================================================================
// MIDDLEWARE
// ============================================================================

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // ── Custom Domain Routing ────────────────────────────────────────────
  // If the hostname doesn't match our app hostname and isn't localhost,
  // treat it as a custom domain and rewrite to the runtime site renderer
  const isAppHost =
    hostname === appHostname ||
    hostname.startsWith('localhost') ||
    hostname.endsWith('.vercel.app') ||
    hostname.endsWith('.builderly.app');

  if (!isAppHost && !pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    // Custom domain detected — rewrite to /s/_custom/[pageSlug]
    // The page renderer will resolve the site by custom domain
    const url = request.nextUrl.clone();
    if (pathname === '/' || pathname === '') {
      url.pathname = `/s/_custom`;
    } else {
      url.pathname = `/s/_custom${pathname}`;
    }
    url.searchParams.set('__domain', hostname);
    return NextResponse.rewrite(url);
  }

  // ── CORS for API routes ──────────────────────────────────────────────
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    
    response.headers.set('Access-Control-Allow-Origin', isDev ? editorUrl : (process.env.EDITOR_DOMAIN || editorUrl));
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }

  // ── Rate Limiting for API routes ─────────────────────────────────────
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    // Skip rate limiting for auth routes (they have their own)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
      || request.headers.get('x-real-ip') 
      || 'anonymous';
    
    const rateLimitResult = checkRateLimit(ip);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter: rateLimitResult.retryAfter,
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }
  }

  const response = NextResponse.next();
  
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', isDev ? editorUrl : (process.env.EDITOR_DOMAIN || editorUrl));
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
