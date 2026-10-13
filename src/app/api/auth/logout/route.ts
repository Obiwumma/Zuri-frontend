/**
 * POST /api/auth/logout
 *
 * Clears authentication cookies and invalidates session tokens.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getApiBaseUrl } from '@/lib/api/config';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { AUTH_COOKIE_OPTIONS } from '@/lib/auth/refresh';

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  // Best-effort remote revocation on the backend
  if (accessToken) {
    try {
      const baseUrl = getApiBaseUrl();
      await fetch(`${baseUrl}${ENDPOINTS.auth.logoutAll}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      });
    } catch {
      // Ignore network errors during logout; local cookie purge takes precedence
    }
  }

  // Clear session cookies
  cookieStore.set('access_token', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });
  cookieStore.set('refresh_token', '', { ...AUTH_COOKIE_OPTIONS, maxAge: 0 });

  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
}
