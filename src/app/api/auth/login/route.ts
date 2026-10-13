/**
 * POST /api/auth/login
 *
 * Authenticates user credentials with the Zuri Backend Gateway.
 * - Sets httpOnly cookies for access_token (maxAge from JWT exp claim) and refresh_token.
 * - Returns ONLY { role, institutionId, displayName, email, mustChangePassword } to the browser.
 * - Maps backend error envelopes to friendly messages.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getApiBaseUrl } from '@/lib/api/config';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { AuthResponse, LoginRequest } from '@/lib/api/types';
import {
  decodeJwtPayload,
  AUTH_COOKIE_OPTIONS,
  REFRESH_COOKIE_MAX_AGE,
} from '@/lib/auth/refresh';

export async function POST(request: Request) {
  try {
    let body: LoginRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid JSON request payload' },
        { status: 400 }
      );
    }

    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${ENDPOINTS.auth.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    if (!response.ok) {
      // 401: Invalid credentials (don't say which field)
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // 429: Rate limited with reset countdown
      if (response.status === 429) {
        const rawReset =
          response.headers.get('x-ratelimit-reset') ||
          response.headers.get('X-RateLimit-Reset');
        const resetEpoch = rawReset ? parseInt(rawReset, 10) : null;
        const secondsRemaining = resetEpoch
          ? Math.max(1, Math.ceil(resetEpoch - Date.now() / 1000))
          : 60;

        return NextResponse.json(
          {
            error: 'Too Many Requests',
            message: `Too many login attempts. Please wait ${secondsRemaining} seconds before trying again.`,
            retryAfter: secondsRemaining,
          },
          { status: 429 }
        );
      }

      // 503: Downstream circuit breaker open
      if (response.status === 503) {
        return NextResponse.json(
          {
            error: 'Service Unavailable',
            message: 'Authentication service is temporarily unavailable. Please retry shortly.',
            retryable: true,
          },
          { status: 503 }
        );
      }

      // Try parsing error envelope for 403 EMAIL_NOT_VERIFIED or other errors
      let errorJson: { error?: string; code?: string; message?: string; user_id?: string } = {};
      try {
        errorJson = await response.json();
      } catch {
        // Non-JSON response
      }

      if (response.status === 403) {
        if (errorJson.code === 'EMAIL_NOT_VERIFIED') {
          return NextResponse.json(
            {
              error: 'Email verification required',
              code: 'EMAIL_NOT_VERIFIED',
              message: 'Please verify your email address before logging in.',
              userId: errorJson.user_id,
            },
            { status: 403 }
          );
        }
        return NextResponse.json(
          { error: 'Forbidden', message: errorJson.message || 'Access denied' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          error: 'Authentication Failed',
          message: errorJson.message || errorJson.error || 'Unable to sign in at this time',
        },
        { status: response.status }
      );
    }

    const json = (await response.json()) as AuthResponse;
    const { access_token, refresh_token, user } = json.data;

    // Calculate maxAge strictly from the JWT 'exp' claim (not expires_at string)
    const claims = decodeJwtPayload(access_token);
    const exp = typeof claims?.exp === 'number' ? claims.exp : null;
    const now = Math.floor(Date.now() / 1000);
    const accessMaxAge = exp && exp > now ? exp - now : 15 * 60; // fallback 15m

    // Set httpOnly session cookies
    const cookieStore = await cookies();

    cookieStore.set('access_token', access_token, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: accessMaxAge,
    });

    cookieStore.set('refresh_token', refresh_token, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: REFRESH_COOKIE_MAX_AGE,
    });

    // Build client payload using user object from response for display
    const role = user.role || (claims?.role as string) || 'student';
    const institutionId = (claims?.institution_id as string) || user.school || '';
    const displayName =
      user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
    const userEmail = user.email;

    // TODO: The backend User contract does not currently include a must-change-password flag. Defaults to false.
    const mustChangePassword = false;

    return NextResponse.json({
      role,
      institutionId,
      displayName,
      email: userEmail,
      mustChangePassword,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal Server Error', message },
      { status: 500 }
    );
  }
}
