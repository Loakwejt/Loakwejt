import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isDev = process.env.NODE_ENV !== 'production';
const editorUrl = process.env.NEXT_PUBLIC_EDITOR_URL || 'http://localhost:5173';

export function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    
    response.headers.set('Access-Control-Allow-Origin', isDev ? editorUrl : (process.env.EDITOR_DOMAIN || editorUrl));
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    return response;
  }

  // For other requests, add CORS headers to the response
  const response = NextResponse.next();
  
  // Only add CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', isDev ? editorUrl : (process.env.EDITOR_DOMAIN || editorUrl));
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }
  
  return response;
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
};
