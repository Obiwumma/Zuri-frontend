import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  singleFlightRefreshToken,
  decodeJwtPayload,
  AUTH_COOKIE_OPTIONS,
  REFRESH_COOKIE_MAX_AGE,
} from '@/lib/auth/refresh';
import { ApiError } from '@/lib/api/client';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Preserve existing ops route group inspection logging
  if (
    pathname.startsWith('/health') ||
    pathname.startsWith('/ai-cost') ||
    pathname.startsWith('/routing') ||
    pathname.startsWith('/logs')
  ) {
    console.log(`[Middleware] Ops route accessed: ${pathname}`);
  }

  // Bypass static files and unauthenticated auth API endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/forgot-password') ||
    pathname.startsWith('/api/auth/reset-password') ||
    pathname === '/favicon.ico' ||
    pathname === '/login' ||
    pathname === '/ops/login'
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Proactive refresh condition: under 2 minutes (120s) remain on access token or already expired
  let shouldRefresh = false;

  if (accessToken) {
    const claims = decodeJwtPayload(accessToken);
    const exp = typeof claims?.exp === 'number' ? claims.exp : null;
    if (exp) {
      const now = Math.floor(Date.now() / 1000);
      const secondsRemaining = exp - now;
      if (secondsRemaining < 120) {
        shouldRefresh = true;
      }
    } else {
      shouldRefresh = true;
    }
  } else if (refreshToken) {
    // Access token missing but valid refresh token present: refresh session immediately
    shouldRefresh = true;
  }

  if (shouldRefresh && refreshToken) {
    try {
      // Use single-flight deduplication to prevent parallel refresh race condition
      const result = await singleFlightRefreshToken(refreshToken);

      // Mutate forwarded request so downstream Server Components see the refreshed access token
      const requestHeaders = new Headers(request.headers);
      request.cookies.set('access_token', result.accessToken);
      request.cookies.set('refresh_token', result.refreshToken);
      requestHeaders.set('cookie', request.cookies.toString());

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      // Set new cookies on response so browser receives rotated credentials
      response.cookies.set('access_token', result.accessToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: result.maxAge,
      });

      response.cookies.set('refresh_token', result.refreshToken, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: REFRESH_COOKIE_MAX_AGE,
      });

      return response;
    } catch (err: unknown) {
      // On 401 or 403, the session is invalidated/revoked: clear cookies and redirect to login
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        if (!pathname.startsWith('/api/')) {
          const loginUrl = new URL('/login', request.url);
          const redirectResponse = NextResponse.redirect(loginUrl);
          redirectResponse.cookies.set('access_token', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
          redirectResponse.cookies.set('refresh_token', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
          return redirectResponse;
        }

        const apiResponse = NextResponse.json(
          { error: 'Unauthorized', message: 'Session expired. Please sign in again.' },
          { status: 401 }
        );
        apiResponse.cookies.set('access_token', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
        apiResponse.cookies.set('refresh_token', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
        return apiResponse;
      }

      // If refresh encountered a non-fatal error (e.g. 503 or transient network) and
      // access token still has remaining time, let request continue gracefully
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
