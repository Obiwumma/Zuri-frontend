import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Role-gating stub for (institution) and (ops) route groups
  if (pathname.startsWith('/health') || pathname.startsWith('/ai-cost') || pathname.startsWith('/routing') || pathname.startsWith('/logs')) {
    // Ops route group validation stub
    console.log(`[Middleware] Ops route accessed: ${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
