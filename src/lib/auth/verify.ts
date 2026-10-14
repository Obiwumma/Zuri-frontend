/**
 * JWT Verification Module (RS256 with Public Key Caching & Rotation)
 *
 * Verifies RS256 access tokens against the Gateway's public RSA key.
 * Endpoint: {BASE}/api/v1/auth/public-key
 * Format: RSA PKIX Public Key encoded in PEM format wrapped in { data: { public_key: string } }
 *
 * Key rotation is handled by catching signature verification failures and refetching the key once.
 */

import { importSPKI, jwtVerify, errors as joseErrors } from 'jose';
import { getApiBaseUrl } from '@/lib/api/config';
import { ENDPOINTS } from '@/lib/api/endpoints';

export interface VerifiedTokenPayload {
  userId: string;
  email: string;
  role: string;
  institutionId: string | null;
  tokenType: string;
  exp: number;
  iat: number;
  jti?: string;
  rawPayload: Record<string, unknown>;
}


export class PublicKeyFetchError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'PublicKeyFetchError';
  }
}

let cachedKey: CryptoKey | null = null;
let cachedKeyTimestamp = 0;
const KEY_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour in-memory cache

/**
 * Fetches the backend RSA PKIX public key in PEM format and imports it as a CryptoKey.
 * Employs stale-key fallback during transient backend gateway outages.
 */
export async function getBackendPublicKey(forceRefresh = false): Promise<CryptoKey> {
  const now = Date.now();
  if (!forceRefresh && cachedKey && now - cachedKeyTimestamp < KEY_CACHE_TTL_MS) {
    return cachedKey;
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${ENDPOINTS.auth.publicKey}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      // Avoid caching in edge/node layer so forceRefresh can retrieve fresh key immediately
      cache: 'no-store',
    });

    if (!response.ok) {
      if (cachedKey) {
        console.warn(`[auth/verify] Public key endpoint returned HTTP ${response.status}; falling back to cached key`);
        return cachedKey;
      }
      throw new PublicKeyFetchError(`Failed to fetch backend public key: HTTP ${response.status}`);
    }

    const json = (await response.json()) as unknown;
    const dataObj = (json && typeof json === 'object') ? (json as Record<string, unknown>) : {};
    const dataField = dataObj.data && typeof dataObj.data === 'object' ? (dataObj.data as Record<string, unknown>) : null;
    const pem = (dataField?.public_key || dataObj.public_key) as string | undefined;

    if (!pem || !pem.includes('BEGIN PUBLIC KEY')) {
      if (cachedKey) return cachedKey;
      throw new PublicKeyFetchError('Invalid public key format received from backend gateway');
    }

    const importedKey = (await importSPKI(pem, 'RS256')) as CryptoKey;
    cachedKey = importedKey;
    cachedKeyTimestamp = now;

    return importedKey;
  } catch (err: unknown) {
    if (cachedKey) {
      console.warn('[auth/verify] Network error fetching public key; falling back to cached key:', err);
      return cachedKey;
    }
    if (err instanceof PublicKeyFetchError) {
      throw err;
    }
    throw new PublicKeyFetchError('Failed to connect to backend public key endpoint', err);
  }
}

/**
 * Verifies an RS256 JWT access token.
 * Validates cryptographic signature, exp timestamp, and token_type === 'access'.
 * Automatically refetches the public key once if signature verification fails (handling key rotation).
 *
 * NOTE: If the backend public-key endpoint is unreachable (network error/503),
 * throws PublicKeyFetchError instead of returning null, so middleware does not clear valid cookies.
 */
export async function verifyAccessToken(token: string): Promise<VerifiedTokenPayload | null> {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    let key: CryptoKey | null = null;
    try {
      key = await getBackendPublicKey(false);
    } catch (keyErr) {
      // In development, if backend gateway is offline (e.g. ECONNREFUSED), allow claims verification fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn('[auth/verify] Backend public key unreachable, using claims inspection in development:', keyErr);
        const { decodeJwtPayload } = await import('./refresh');
        const payload = decodeJwtPayload(token);
        if (!payload || payload.token_type !== 'access' || typeof payload.exp !== 'number') {
          return null;
        }
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp <= now) return null;
        return {
          userId: ((payload.user_id || payload.sub) as string) || '',
          email: (payload.email as string) || '',
          role: (payload.role as string) || '',
          institutionId: (payload.institution_id as string) || null,
          tokenType: 'access',
          exp: payload.exp,
          iat: (payload.iat as number) || now,
          jti: payload.jti as string | undefined,
          rawPayload: payload as Record<string, unknown>,
        };
      }
      throw keyErr;
    }

    let payload: Record<string, unknown>;

    try {
      const result = await jwtVerify(token, key, {
        algorithms: ['RS256'],
      });
      payload = result.payload as Record<string, unknown>;
    } catch (firstErr: unknown) {
      // If signature verification fails, refetch the public key once to handle key rotation
      const isSignatureFailure =
        firstErr instanceof joseErrors.JWSSignatureVerificationFailed ||
        firstErr instanceof joseErrors.JWSInvalid ||
        (firstErr instanceof Error && firstErr.message.toLowerCase().includes('signature'));

      if (isSignatureFailure) {
        key = await getBackendPublicKey(true);
        const retryResult = await jwtVerify(token, key, {
          algorithms: ['RS256'],
        });
        payload = retryResult.payload as Record<string, unknown>;
      } else {
        throw firstErr;
      }
    }

    // Strict claim checks
    if (payload.token_type !== 'access') {
      return null;
    }

    if (typeof payload.exp !== 'number') {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now) {
      return null;
    }

    const userId = (payload.user_id || payload.sub) as string;
    if (!userId) {
      return null;
    }

    const email = (payload.email as string) || '';
    const role = (payload.role as string) || '';
    const institutionId = (payload.institution_id as string) || null;

    return {
      userId,
      email,
      role,
      institutionId,
      tokenType: 'access',
      exp: payload.exp,
      iat: (payload.iat as number) || now,
      jti: payload.jti as string | undefined,
      rawPayload: payload as Record<string, unknown>,
    };
  } catch (err: unknown) {
    if (err instanceof PublicKeyFetchError) {
      throw err;
    }
    // Token signature invalid, expired, or malformed
    return null;
  }
}
