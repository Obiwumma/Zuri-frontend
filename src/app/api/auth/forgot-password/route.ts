/**
 * POST /api/auth/forgot-password
 *
 * Requests a password reset link via backend endpoint POST /api/v1/auth/forgot-password.
 * Always returns a generic positive confirmation to prevent account enumeration.
 */

import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api/config';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ForgotPasswordRequest, ApiMessageResponse } from '@/lib/api/types';

export async function POST(request: Request) {
  try {
    let body: ForgotPasswordRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid JSON request payload' },
        { status: 400 }
      );
    }

    const { email } = body;
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Email address is required' },
        { status: 400 }
      );
    }

    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}${ENDPOINTS.auth.forgotPassword}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email: email.trim() }),
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
            message: `Too many password reset requests. Please wait ${secondsRemaining} seconds before trying again.`,
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
    }

    let resultMessage = 'If that email is registered, recovery instructions have been dispatched.';
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
