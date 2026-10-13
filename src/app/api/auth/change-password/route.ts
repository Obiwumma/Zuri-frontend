/**
 * POST /api/auth/change-password
 *
 * Changes user password via backend endpoint POST /api/v1/users/me/change-password.
 * Protected by the user's active session access_token cookie.
 */

import { NextResponse } from 'next/server';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { apiClient, ApiError, RateLimitedError, ServiceUnavailableError } from '@/lib/api/client';
import type { ChangePasswordRequest, ApiMessageResponse } from '@/lib/api/types';

export async function POST(request: Request) {
  try {
    let body: ChangePasswordRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid JSON request payload' },
        { status: 400 }
      );
    }

    const { current_password, new_password } = body;
    if (!current_password || !new_password) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (new_password.length < 8) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const result = await apiClient.post<ApiMessageResponse>(
      ENDPOINTS.users.changePassword,
      { current_password, new_password }
    );

    return NextResponse.json({
      success: true,
      message: result?.message || 'Password changed successfully',
    });
  } catch (err: unknown) {
    if (err instanceof RateLimitedError) {
      const secondsRemaining = err.resetTime
        ? Math.max(1, Math.ceil(err.resetTime - Date.now() / 1000))
        : 60;
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: `Too many attempts. Please wait ${secondsRemaining} seconds before trying again.`,
          retryAfter: secondsRemaining,
        },
        { status: 429 }
      );
    }

    if (err instanceof ServiceUnavailableError) {
      return NextResponse.json(
        {
          error: 'Service Unavailable',
          message: 'Password service is temporarily unavailable. Please retry shortly.',
          retryable: true,
        },
        { status: 503 }
      );
    }

    if (err instanceof ApiError) {
      if (err.status === 401) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Current password is incorrect or session expired' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: 'Error', message: err.message },
        { status: err.status }
      );
    }

    const message = err instanceof Error ? err.message : 'Failed to change password';
    return NextResponse.json(
      { error: 'Internal Server Error', message },
      { status: 500 }
    );
  }
}
