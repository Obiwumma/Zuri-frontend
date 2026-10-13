/**
 * Zuri Server-Side API Client
 *
 * Server-side fetch wrapper that communicates with the Zuri API Gateway.
 * - Attaches the access token from the httpOnly cookie.
 * - Parses backend error envelopes into typed ApiError instances.
 * - Maps HTTP 429 to RateLimitedError (with reset timestamp from X-RateLimit-Reset).
 * - Maps HTTP 503 to ServiceUnavailableError (downstream circuit-breaker tripped).
 * - NEVER retries 429 or 503 in a loop.
 * - NEVER logs or exposes tokens.
 * - Refresh logic is strictly external (not implemented here).
 */

import { cookies } from 'next/headers';
import { getApiBaseUrl } from './config';
import type { ApiErrorEnvelope } from './types';

// ============================================================================
// Typed Error Classes
// ============================================================================

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly errorType?: string;
  public readonly userId?: string;
  public readonly responseBody?: unknown;

  constructor(
    status: number,
    message: string,
    options?: {
      code?: string;
      errorType?: string;
      userId?: string;
      responseBody?: unknown;
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = options?.code;
    this.errorType = options?.errorType;
    this.userId = options?.userId;
    this.responseBody = options?.responseBody;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RateLimitedError extends ApiError {
  /**
   * Unix epoch timestamp in seconds when the rate limit window resets.
   */
  public readonly resetTime: number | null;
  public readonly resetDate: Date | null;

  constructor(message: string, resetTime: number | null, responseBody?: unknown) {
    super(429, message, {
      code: 'RATE_LIMITED',
      responseBody,
    });
    this.name = 'RateLimitedError';
    this.resetTime = resetTime;
    this.resetDate = resetTime ? new Date(resetTime * 1000) : null;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(message: string, responseBody?: unknown) {
    super(503, message, {
      code: 'CIRCUIT_BREAKER_OPEN',
      responseBody,
    });
    this.name = 'ServiceUnavailableError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ============================================================================
// Cookie Extraction Helper
// ============================================================================

/**
 * Safely extracts the access token from server-side cookies.
 * Checks 'access_token' and fallback 'zuri_access_token'.
 */
async function getAccessTokenFromCookie(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('access_token')?.value ||
      cookieStore.get('zuri_access_token')?.value;
    return token;
  } catch {
    // Outside of a request context (e.g. static generation or test environment)
    return undefined;
  }
}

// ============================================================================
// Core Server-Side Fetch Client
// ============================================================================

export interface ClientRequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
  /** Optional token override if caller provides a specific token */
  token?: string;
  /** Query parameter map */
  params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Server-side fetch wrapper for Zuri Backend Gateway calls.
 *
 * Strictly non-retrying on 429 and 503 to respect Gateway circuit breaker and throttling rules.
 */
export async function serverFetch<T = unknown>(
  endpoint: string,
  options: ClientRequestOptions = {}
): Promise<T> {
  const baseUrl = getApiBaseUrl();

  // Build target URL
  let targetUrl = endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  if (options.params) {
    const url = new URL(targetUrl);
    Object.entries(options.params).forEach(([key, val]) => {
      if (val !== undefined) {
        url.searchParams.append(key, String(val));
      }
    });
    targetUrl = url.toString();
  }

  // Resolve access token from options or server-side httpOnly cookie
  const token = options.token || (await getAccessTokenFromCookie());

  // Prepare headers without mutating caller object
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  // Default content-type for request bodies unless already specified (e.g. multipart/form-data)
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Attach token if present and not already specified
  if (token && !headers['Authorization'] && !headers['authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Execute single HTTP fetch (No retry loops on 429 or 503)
  const response = await fetch(targetUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Extract rate-limit reset timestamp from headers if present
    const rawReset =
      response.headers.get('x-ratelimit-reset') ||
      response.headers.get('X-RateLimit-Reset');
    const resetTime = rawReset ? parseInt(rawReset, 10) : null;

    // Parse response body safely
    let responseBody: unknown = null;
    let message = `Request to ${endpoint} failed with HTTP status ${response.status}`;
    let code: string | undefined;
    let errorType: string | undefined;
    let userId: string | undefined;

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        const json = (await response.json()) as ApiErrorEnvelope;
        responseBody = json;
        if (json.message) {
          message = json.message;
        } else if (json.error) {
          message = json.error;
        }
        code = json.code;
        errorType = json.error;
        userId = json.user_id;
      } catch {
        // Body was not valid JSON
      }
    } else {
      try {
        const text = await response.text();
        if (text && text.trim()) {
          message = text.trim();
          responseBody = text;
        }
      } catch {
        // Failed reading text body
      }
    }

    // Map HTTP 429: Rate limited cooldown
    if (response.status === 429) {
      throw new RateLimitedError(message, resetTime, responseBody);
    }

    // Map HTTP 503: Gateway circuit breaker open
    if (response.status === 503) {
      throw new ServiceUnavailableError(message, responseBody);
    }

    // Map all other errors
    throw new ApiError(response.status, message, {
      code,
      errorType,
      userId,
      responseBody,
    });
  }

  // 204 No Content
  if (response.status === 204) {
    return null as T;
  }

  // Return parsed JSON
  const data = (await response.json()) as T;
  return data;
}

/**
 * Convenient HTTP verb helpers
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: ClientRequestOptions) =>
    serverFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: ClientRequestOptions) =>
    serverFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: unknown, options?: ClientRequestOptions) =>
    serverFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: ClientRequestOptions) =>
    serverFetch<T>(endpoint, { ...options, method: 'DELETE' }),

  patch: <T>(endpoint: string, body?: unknown, options?: ClientRequestOptions) =>
    serverFetch<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    }),
};
