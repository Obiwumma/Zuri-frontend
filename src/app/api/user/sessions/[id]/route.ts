import { NextResponse } from 'next/server';
import { apiClient, ApiError, RateLimitedError, ServiceUnavailableError } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

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
        message: 'Downstream session service is temporarily unavailable. Circuit breaker open.',
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

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: 'BAD_REQUEST', message: 'Session ID is required' }, { status: 400 });
    }

    const res = await apiClient.delete<{ message?: string }>(ENDPOINTS.users.sessionById(id));
    return NextResponse.json(res || { message: 'Session revoked successfully' });
  } catch (err) {
    return handleRouteError(err);
  }
}
