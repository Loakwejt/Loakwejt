import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isDev = process.env.NODE_ENV !== 'production';
const editorUrl = process.env.NEXT_PUBLIC_EDITOR_URL || 'http://localhost:5173';
const appHostname = process.env.APP_HOSTNAME || 'localhost:3000';

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
