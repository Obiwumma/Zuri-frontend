/**
 * POST /api/auth/refresh
 *
 * Rotates access and refresh tokens using single-flight deduplication.
 * - Sets refreshed httpOnly cookies for access_token and refresh_token.
 * - Returns ONLY { role, institutionId, displayName, email, mustChangePassword } to the browser.
 * - On 401/403 failure, clears auth cookies.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  singleFlightRefreshToken,
  AUTH_COOKIE_OPTIONS,
  REFRESH_COOKIE_MAX_AGE,
} from '@/lib/auth/refresh';
import { ApiError, RateLimitedError, ServiceUnavailableError } from '@/lib/api/client';

export async function POST() {
  const cookieStore = await cookies();
  const currentRefreshToken = cookieStore.get('refresh_token')?.value;

  if (!currentRefreshToken) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'No active refresh token available' },
      { status: 401 }
    );
  }

  try {
    const result = await singleFlightRefreshToken(currentRefreshToken);

    // Set updated httpOnly cookies
    cookieStore.set('access_token', result.accessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: result.maxAge,
    });

    cookieStore.set('refresh_token', result.refreshToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    return NextResponse.json({
      role: result.role,
      institutionId: result.institutionId,
      displayName: result.displayName,
      email: result.email,
      mustChangePassword: result.mustChangePassword,
    });
  } catch (err: unknown) {
    // On 401 or 403, the session is invalidated/revoked: clear cookies immediately
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      cookieStore.set('access_token', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
      cookieStore.set('refresh_token', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });

      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Your session has expired. Please sign in again.',
          requiresLogin: true,
        },
        { status: 401 }
      );
    }

    if (err instanceof RateLimitedError) {
      const secondsRemaining = err.resetTime
        ? Math.max(1, Math.ceil(err.resetTime - Date.now() / 1000))
        : 60;

      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: `Too many refresh requests. Please wait ${secondsRemaining} seconds before retrying.`,
          retryAfter: secondsRemaining,
        },
        { status: 429 }
      );
    }

    if (err instanceof ServiceUnavailableError) {
      return NextResponse.json(
        {
          error: 'Service Unavailable',
          message: 'Authentication service is temporarily unavailable. Please retry shortly.',
          retryable: true,
        },
        { status: 503 }
      );
    }

    const message = err instanceof Error ? err.message : 'Failed to refresh authentication session';
    return NextResponse.json(
      { error: 'Internal Server Error', message },
      { status: 500 }
    );
  }
}
