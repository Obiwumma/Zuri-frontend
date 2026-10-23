import { NextResponse } from 'next/server';
import { apiClient, ApiError, RateLimitedError, ServiceUnavailableError } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { ApiResponse, User } from '@/lib/api/types';
import type { UpdateProfileRequest } from '@/lib/api/users';

function handleRouteError(err: unknown) {
  if (err instanceof RateLimitedError) {
    const secondsRemaining = err.resetTime
      ? Math.max(1, Math.ceil(err.resetTime - Date.now() / 1000))
      : 60;
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: `Rate limit reached. Please wait ${secondsRemaining}s before retrying.`,
        retryAfter: secondsRemaining,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Reset': String(err.resetTime || Math.floor(Date.now() / 1000) + 60),
        },
      }
    );
  }

  if (err instanceof ServiceUnavailableError) {
    return NextResponse.json(
      {
        error: 'Service Unavailable',
        message: 'Downstream service is temporarily unavailable. Circuit breaker open.',
        retryable: true,
      },
      { status: 503 }
    );
  }

  if (err instanceof ApiError) {
    return NextResponse.json(
      {
        error: err.code || 'API_ERROR',
        message: err.message,
      },
      { status: err.status }
    );
  }

  const message = err instanceof Error ? err.message : 'Internal Server Error';
  return NextResponse.json({ error: 'INTERNAL_ERROR', message }, { status: 500 });
}

export async function GET() {
  try {
    const res = await apiClient.get<ApiResponse<User>>(ENDPOINTS.users.me);
    return NextResponse.json(res);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PUT(request: Request) {
  try {
    let body: UpdateProfileRequest;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'BAD_REQUEST', message: 'Invalid JSON payload' }, { status: 400 });
    }

    const res = await apiClient.put<ApiResponse<User>>(ENDPOINTS.users.me, body);
    return NextResponse.json(res);
  } catch (err) {
    return handleRouteError(err);
  }
}
