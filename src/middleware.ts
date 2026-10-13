import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  singleFlightRefreshToken,
  decodeJwtPayload,
  AUTH_COOKIE_OPTIONS,
  REFRESH_COOKIE_MAX_AGE,
} from '@/lib/auth/refresh';
import { verifyAccessToken } from '@/lib/auth/verify';
import {
  canAccessInstitution,
  canAccessOps,
  BACKEND_ROLES,
} from '@/lib/auth/roles';

// Core routes belonging to the institution shell
const INSTITUTIONAL_APP_PATHS = [
  '/dashboard',
  '/students',
  '/courses',
  '/departments',
  '/enrollment',
  '/lecturers',
  '/library',
  '/materials',
  '/activity',
  '/analytics',
  '/calendar',
  '/extraction',
  '/notifications',
  '/roles',
  '/settings',
  '/timetable',
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Bypass static files, Next.js internals, and auth API endpoints
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth/') ||
    pathname === '/favicon.ico' ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Prepare request headers with forwarded x-pathname for layouts
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  let accessToken =
    request.cookies.get('access_token')?.value ||
    request.cookies.get('zuri_access_token')?.value;
  const refreshToken =
    request.cookies.get('refresh_token')?.value ||
    request.cookies.get('zuri_refresh_token')?.value;

  let rotatedCookies: {
    accessToken?: { value: string; maxAge: number };
    refreshToken?: { value: string; maxAge: number };
  } = {};

  // 3. Proactive token refresh if under 2 minutes (120s) remain or expired
  let shouldRefresh = false;
  if (accessToken) {
    const claims = decodeJwtPayload(accessToken);
    const exp = typeof claims?.exp === 'number' ? claims.exp : null;
    if (exp) {
      const now = Math.floor(Date.now() / 1000);
      if (exp - now < 120) {
        shouldRefresh = true;
      }
    } else {
      shouldRefresh = true;
    }
  } else if (refreshToken) {
    shouldRefresh = true;
  }

  if (shouldRefresh && refreshToken) {
    try {
      const refreshResult = await singleFlightRefreshToken(refreshToken);
      accessToken = refreshResult.accessToken;
      rotatedCookies = {
        accessToken: {
          value: refreshResult.accessToken,
          maxAge: refreshResult.maxAge,
        },
        refreshToken: {
          value: refreshResult.refreshToken,
          maxAge: REFRESH_COOKIE_MAX_AGE,
        },
      };

      // Forward rotated credentials to downstream server components
      request.cookies.set('access_token', refreshResult.accessToken);
      request.cookies.set('refresh_token', refreshResult.refreshToken);
      requestHeaders.set('cookie', request.cookies.toString());
    } catch (err: unknown) {
      // If refresh failed due to session invalidation (401/403), discard credentials
      const status = (err && typeof err === 'object' && 'status' in err)
        ? (err as { status: unknown }).status
        : null;
      if (status === 401 || status === 403) {
        accessToken = undefined;
      }
    }
  }

  // Helper closures to attach updated cookies or clear invalidated sessions
  const attachCookies = (res: NextResponse): NextResponse => {
    if (rotatedCookies.accessToken) {
      res.cookies.set('access_token', rotatedCookies.accessToken.value, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: rotatedCookies.accessToken.maxAge,
      });
    }
    if (rotatedCookies.refreshToken) {
      res.cookies.set('refresh_token', rotatedCookies.refreshToken.value, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: rotatedCookies.refreshToken.maxAge,
      });
    }
    return res;
  };

  const clearAuthCookies = (res: NextResponse): NextResponse => {
    res.cookies.set('access_token', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
    res.cookies.set('refresh_token', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
    return res;
  };

  // 4. Verify access token signature (RS256) and claims using public key
  let userRole: string | null = null;
  let isAuthenticated = false;

  if (accessToken) {
    const verified = await verifyAccessToken(accessToken);
    if (verified) {
      userRole = verified.role;
      isAuthenticated = true;
    }
  }

  const isOpsLogin = pathname === '/ops/login';
  const isOpsRoute = pathname.startsWith('/ops') && !isOpsLogin;
  const isInstitutionLogin = pathname === '/institution/login' || pathname === '/login';
  const isInstitutionAppRoute = INSTITUTIONAL_APP_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  const isInstitutionRoute =
    (pathname.startsWith('/institution') || isInstitutionAppRoute) && !isInstitutionLogin;

  // 5. Handle Ops Shell Login: /ops/login
  if (isOpsLogin) {
    if (isAuthenticated) {
      // Students hitting either shell are rejected
      if (userRole === BACKEND_ROLES.STUDENT) {
        return clearAuthCookies(
          new NextResponse('Access Denied: Student accounts are not permitted in administrative consoles.', {
            status: 403,
          })
        );
      }
      // Redirect already-authenticated users to their correct shell
      if (canAccessOps(userRole)) {
        return attachCookies(NextResponse.redirect(new URL('/ops/health', request.url)));
      }
      if (canAccessInstitution(userRole)) {
        return attachCookies(NextResponse.redirect(new URL('/dashboard', request.url)));
      }
      return clearAuthCookies(NextResponse.redirect(new URL('/ops/login', request.url)));
    }
    return attachCookies(NextResponse.next({ request: { headers: requestHeaders } }));
  }

  // 6. Handle Ops Shell Protected Routes: /ops/*
  if (isOpsRoute) {
    // Requires a valid token and canAccessOps(role); otherwise redirect to /ops/login.
    // Do NOT reveal that the route exists (clean redirect without params).
    // Students hitting either shell are rejected.
    if (!isAuthenticated || !canAccessOps(userRole) || userRole === BACKEND_ROLES.STUDENT) {
      const redirectRes = NextResponse.redirect(new URL('/ops/login', request.url));
      return !isAuthenticated ? clearAuthCookies(redirectRes) : attachCookies(redirectRes);
    }
    return attachCookies(NextResponse.next({ request: { headers: requestHeaders } }));
  }

  // 7. Handle Institution Login: /institution/login and /login
  if (isInstitutionLogin) {
    if (isAuthenticated) {
      // Students hitting either shell are rejected
      if (userRole === BACKEND_ROLES.STUDENT) {
        return clearAuthCookies(
          new NextResponse('Access Denied: Student accounts are not permitted in administrative consoles.', {
            status: 403,
          })
        );
      }
      // Redirect already-authenticated users to their correct shell
      if (canAccessInstitution(userRole)) {
        return attachCookies(NextResponse.redirect(new URL('/dashboard', request.url)));
      }
      if (canAccessOps(userRole)) {
        return attachCookies(NextResponse.redirect(new URL('/ops/health', request.url)));
      }
      return clearAuthCookies(NextResponse.redirect(new URL('/login', request.url)));
    }

    // Rewrite /institution/login to /login to render login page
    if (pathname === '/institution/login') {
      return attachCookies(
        NextResponse.rewrite(new URL('/login', request.url), {
          request: { headers: requestHeaders },
        })
      );
    }
    return attachCookies(NextResponse.next({ request: { headers: requestHeaders } }));
  }

  // 8. Handle Institution Shell Protected Routes: /institution/* and core app routes
  if (isInstitutionRoute) {
    // Requires a valid token and canAccessInstitution(role); otherwise redirect to /institution/login.
    // Students hitting either shell are rejected.
    if (!isAuthenticated || !canAccessInstitution(userRole) || userRole === BACKEND_ROLES.STUDENT) {
      const redirectRes = NextResponse.redirect(new URL('/institution/login', request.url));
      return !isAuthenticated ? clearAuthCookies(redirectRes) : attachCookies(redirectRes);
    }

    // Handle /institution/<subpath> rewriting to /<subpath> if requested under the /institution prefix
    if (pathname.startsWith('/institution/')) {
      const targetSubpath = pathname.replace(/^\/institution/, '') || '/dashboard';
      return attachCookies(
        NextResponse.rewrite(new URL(targetSubpath, request.url), {
          request: { headers: requestHeaders },
        })
      );
    }

    return attachCookies(NextResponse.next({ request: { headers: requestHeaders } }));
  }

  // 9. Root path: redirect to appropriate shell or login
  if (pathname === '/') {
    if (!isAuthenticated) {
      return attachCookies(NextResponse.redirect(new URL('/institution/login', request.url)));
    }
    if (userRole === BACKEND_ROLES.STUDENT) {
      return clearAuthCookies(
        new NextResponse('Access Denied: Student accounts are not permitted in administrative consoles.', {
          status: 403,
        })
      );
    }
    if (canAccessOps(userRole)) {
      return attachCookies(NextResponse.redirect(new URL('/ops/health', request.url)));
    }
    if (canAccessInstitution(userRole)) {
      return attachCookies(NextResponse.redirect(new URL('/dashboard', request.url)));
    }
    return attachCookies(NextResponse.redirect(new URL('/institution/login', request.url)));
  }

  // Default passthrough with forwarded x-pathname
  return attachCookies(NextResponse.next({ request: { headers: requestHeaders } }));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth/* (auth API endpoints)
     * - Static asset extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
