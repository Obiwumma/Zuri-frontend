/**
 * POST /api/auth/reset-password
 *
 * Submits replacement password and recovery token via backend endpoint POST /api/v1/auth/reset-password.
 */

import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api/config';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ResetPasswordRequest, ApiMessageResponse } from '@/lib/api/types';

export async function POST(request: Request) {
  try {
    let body: ResetPasswordRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid JSON request payload' },
        { status: 400 }
      );
    }

    const { token, new_password } = body;
    if (!token || !new_password) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Reset token and new password are required' },
        { status: 400 }
      );
    }

    if (new_password.length < 8) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${ENDPOINTS.auth.resetPassword}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ token, new_password }),
    });

    if (!response.ok) {
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
            message: `Too many password reset attempts. Please wait ${secondsRemaining} seconds before trying again.`,
            retryAfter: secondsRemaining,
          },
          { status: 429 }
        );
      }

      if (response.status === 503) {
        return NextResponse.json(
          {
            error: 'Service Unavailable',
            message: 'Password reset service is temporarily unavailable. Please retry shortly.',
            retryable: true,
          },
          { status: 503 }
        );
      }

      let errorMsg = 'Invalid or expired password reset token';
      try {
        const errJson = await response.json();
        if (errJson.message) errorMsg = errJson.message;
      } catch {
        // Fallback
      }

      return NextResponse.json(
        { error: 'Bad Request', message: errorMsg },
        { status: response.status }
      );
    }

    let resultMessage = 'Password reset successfully. You may now sign in.';
    try {
      const json = (await response.json()) as ApiMessageResponse;
      if (json.message) resultMessage = json.message;
    } catch {
      // Default message
    }

    return NextResponse.json({
      success: true,
      message: resultMessage,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { error: 'Internal Server Error', message },
      { status: 500 }
    );
  }
}
