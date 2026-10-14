/**
 * POST /api/auth/logout
 *
 * Clears authentication cookies and invalidates session tokens.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getApiBaseUrl } from '@/lib/api/config';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { AUTH_COOKIE_OPTIONS, decodeJwtPayload } from '@/lib/auth/refresh';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  // Best-effort remote revocation on the backend
  if (accessToken) {
    try {
      const baseUrl = getApiBaseUrl();
      const claims = decodeJwtPayload(accessToken);
      const sessionId = (claims?.jti as string) || (claims?.session_id as string);

      let logoutAll = false;
      try {
        const body = (await request.json()) as { all?: boolean };
        if (body?.all) logoutAll = true;
      } catch {
        // Body is optional
      }

      if (!logoutAll && sessionId) {
        // Preferred: Revoke single session
        const sessionUrl = `${baseUrl}${ENDPOINTS.users.sessionById(sessionId)}`;
        const res = await fetch(sessionUrl, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        });
        // If single session endpoint is not available or rejected, fall back to logout_all
        if (!res.ok && res.status !== 404) {
          await fetch(`${baseUrl}${ENDPOINTS.auth.logoutAll}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          });
        }
      } else {
        // Explicit logout-all requested or session ID absent
        await fetch(`${baseUrl}${ENDPOINTS.auth.logoutAll}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        });
      }
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
