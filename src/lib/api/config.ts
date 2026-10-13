/**
 * Zuri Backend API Configuration
 *
 * Reads ZURI_API_BASE_URL from the environment and throws a clear error if missing.
 */

/**
 * Validates and retrieves the base URL for the Zuri backend API gateway.
 * Throws a clear error if ZURI_API_BASE_URL is missing or empty.
 */
export function getApiBaseUrl(): string {
  const url = process.env.ZURI_API_BASE_URL;
  if (!url || !url.trim()) {
    throw new Error(
      'Missing ZURI_API_BASE_URL: The backend API base URL is not defined. ' +
      'Please configure ZURI_API_BASE_URL in your environment or .env.local file (e.g., ZURI_API_BASE_URL=http://localhost:8080).'
    );
  }
  return url.replace(/\/+$/, '');
}

/**
 * Validated API Base URL string.
 * When evaluated, returns the trimmed base URL, or throws a clear error if missing.
 */
export const ZURI_API_BASE_URL = {
  toString(): string {
    return getApiBaseUrl();
  },
  valueOf(): string {
    return getApiBaseUrl();
  },
};
