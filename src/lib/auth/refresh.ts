/**
 * Single-Flight Token Refresh Module
 *
 * The backend rotates refresh tokens and revokes ALL sessions if an old token is reused.
 * Two parallel refreshes with the same token would log the user out.
 *
 * This module maintains an in-memory map from refresh token to in-flight promise,
 * ensuring concurrent callers across the same server process share a single backend call.
 *
 * NOTE: This concurrency guarantee assumes a single server instance.
 */

import { getApiBaseUrl } from '@/lib/api/config';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { AuthResponse, AuthResponseData } from '@/lib/api/types';
import { ApiError, RateLimitedError, ServiceUnavailableError } from '@/lib/api/client';

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  maxAge: number;
  user: AuthResponseData['user'];
  role: string;
  institutionId: string;
  displayName: string;
  email: string;
  mustChangePassword: boolean;
}

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

/**
 * In-memory map of in-flight promises keyed by submitted refresh token.
 * Prevents race conditions where parallel requests trigger reuse detection.
 */
const inFlightRefreshes = new Map<string, Promise<RefreshResult>>();

/**
 * Decodes a JWT payload without verification to inspect expiration and claims.
 * Works uniformly in Node.js and Edge runtimes.
 */
export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonStr: string;
    if (typeof atob === 'function') {
      jsonStr = atob(base64);
    } else {
      jsonStr = Buffer.from(base64, 'base64').toString('utf-8');
    }
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Executes a single-flight token refresh against the backend gateway.
 * Multiple concurrent callers using the same refresh token will receive the same promise.
 */
export async function singleFlightRefreshToken(oldRefreshToken: string): Promise<RefreshResult> {
  if (!oldRefreshToken || !oldRefreshToken.trim()) {
    throw new ApiError(401, 'No refresh token provided', { code: 'NO_REFRESH_TOKEN' });
  }

  // Deduplicate concurrent calls with identical refresh token
  const existingPromise = inFlightRefreshes.get(oldRefreshToken);
  if (existingPromise) {
    return existingPromise;
  }

  const promise = (async (): Promise<RefreshResult> => {
    try {
      const baseUrl = getApiBaseUrl();
      const targetUrl = `${baseUrl}${ENDPOINTS.auth.refresh}`;

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ refresh_token: oldRefreshToken }),
      });

      if (!response.ok) {
        const rawReset =
          response.headers.get('x-ratelimit-reset') ||
          response.headers.get('X-RateLimit-Reset');
        const resetTime = rawReset ? parseInt(rawReset, 10) : null;

        let errorMessage = `Refresh failed with HTTP ${response.status}`;
        let errorCode: string | undefined;

        try {
          const errJson = await response.json();
          if (errJson.message) errorMessage = errJson.message;
          else if (errJson.error) errorMessage = errJson.error;
          errorCode = errJson.code;
        } catch {
          // Non-JSON error body
        }

        if (response.status === 429) {
          throw new RateLimitedError(errorMessage, resetTime);
        }
        if (response.status === 503) {
          throw new ServiceUnavailableError(errorMessage);
        }
        throw new ApiError(response.status, errorMessage, { code: errorCode });
      }

      const json = (await response.json()) as AuthResponse;
      const data = json.data;

      // Extract exp claim directly from the new access token
      const claims = decodeJwtPayload(data.access_token);
      const exp = typeof claims?.exp === 'number' ? claims.exp : null;
      const now = Math.floor(Date.now() / 1000);
      const maxAge = exp && exp > now ? exp - now : 15 * 60; // fallback 15m

      const user = data.user;
      const role = (claims?.role as string) || user.role || 'student';
      const institutionId =
        (claims?.institution_id as string) || user.school || '';
      const displayName =
        user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at,
        maxAge,
        user,
        role,
        institutionId,
        displayName,
        email: user.email,
        mustChangePassword: Boolean(
          (user as unknown as Record<string, unknown>).must_change_password ||
          (user as unknown as Record<string, unknown>).mustChangePassword ||
          (claims as Record<string, unknown> | null)?.must_change_password ||
          false
        ),
      };
    } finally {
      // Ensure removal from map regardless of success or failure
      inFlightRefreshes.delete(oldRefreshToken);
    }
  })();

  inFlightRefreshes.set(oldRefreshToken, promise);
  return promise;
}
