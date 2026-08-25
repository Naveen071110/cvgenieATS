/**
 * Enterprise Cookie & State Management Architecture
 * Server-Side Cookie Utilities for Express
 * 
 * Implements OWASP defense-in-depth cookie security:
 * - Explicit SameSite (Lax/Strict)
 * - Automatic Secure flag detection (HTTPS / Production)
 * - Path=/ restriction
 * - HttpOnly protection for sensitive credentials
 * - Size limit validation (<4KB payload) to prevent HTTP 431 errors
 */

import type { Request, Response } from 'express';
import crypto from 'crypto';
import {
  CookieKey,
  CookieOptions,
  ConsentPreferences,
  KNOWN_COOKIE_KEYS,
} from '../../shared/cookies/types';
import {
  COOKIE_REGISTRY,
  DEFAULT_CONSENT_PREFERENCES,
} from '../../shared/cookies/config';

const isProduction = process.env.NODE_ENV === 'production';
const MAX_COOKIE_SIZE_BYTES = 4096;

/**
 * Normalizes options with OWASP-recommended defaults based on registry definition
 */
export function getNormalizedCookieOptions(
  key: string,
  overrides?: CookieOptions
): CookieOptions {
  const definition = COOKIE_REGISTRY[key];
  
  return {
    path: '/',
    secure: isProduction || overrides?.secure !== false,
    httpOnly: definition ? definition.httpOnly : (overrides?.httpOnly ?? true),
    sameSite: definition ? definition.sameSite : (overrides?.sameSite ?? 'lax'),
    maxAge: (overrides?.maxAge !== undefined) 
      ? overrides.maxAge 
      : (definition?.defaultTtlSeconds ?? 30 * 24 * 60 * 60),
    ...overrides,
  };
}

/**
 * Sets a strongly-typed, secure cookie on Express Response
 */
export function setSecureCookie(
  res: Response,
  key: CookieKey | string,
  value: string | object,
  options?: CookieOptions
): boolean {
  try {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    
    // OWASP Size check
    const serializedSize = Buffer.byteLength(key + '=' + encodeURIComponent(stringValue), 'utf8');
    if (serializedSize > MAX_COOKIE_SIZE_BYTES) {
      console.warn(`⚠️ Cookie "${key}" exceeds 4KB size limit (${serializedSize} bytes). Truncating or skipping.`);
      return false;
    }

    const opts = getNormalizedCookieOptions(key, options);

    res.cookie(key, stringValue, {
      path: opts.path || '/',
      maxAge: opts.maxAge ? opts.maxAge * 1000 : undefined, // Express expects ms
      expires: opts.expires,
      httpOnly: opts.httpOnly,
      secure: opts.secure,
      sameSite: opts.sameSite,
      domain: opts.domain,
    });

    return true;
  } catch (error) {
    console.error(`Failed to set cookie "${key}":`, error);
    return false;
  }
}

/**
 * Retrieves a cookie value from Express Request safely
 */
export function getSecureCookie<T = string>(
  req: Request,
  key: CookieKey | string,
  asJson: boolean = false
): T | null {
  try {
    const rawValue = req.cookies?.[key] || req.signedCookies?.[key];
    if (!rawValue) return null;

    if (asJson) {
      try {
        return JSON.parse(rawValue) as T;
      } catch {
        return null;
      }
    }

    return rawValue as T;
  } catch (error) {
    console.error(`Failed to read cookie "${key}":`, error);
    return null;
  }
}

/**
 * Clears/deletes a cookie by name with matching security attributes
 */
export function clearSecureCookie(
  res: Response,
  key: CookieKey | string,
  options?: Pick<CookieOptions, 'path' | 'domain' | 'secure' | 'sameSite'>
): void {
  const opts = getNormalizedCookieOptions(key, options);
  res.clearCookie(key, {
    path: opts.path || '/',
    domain: opts.domain,
    secure: opts.secure,
    sameSite: opts.sameSite,
  });
}

/**
 * Issues an authentication session token cookie (HttpOnly, Secure, 30 days)
 */
export function createAuthCookie(
  res: Response,
  token: string,
  durationSeconds: number = 30 * 24 * 60 * 60
): void {
  setSecureCookie(res, KNOWN_COOKIE_KEYS.SESSION_TOKEN, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: durationSeconds,
    path: '/',
  });
}

/**
 * Generates a cryptographically strong CSRF token and sets the cookie
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function setCsrfCookie(res: Response, token?: string): string {
  const csrfToken = token || generateCsrfToken();
  setSecureCookie(res, KNOWN_COOKIE_KEYS.CSRF_TOKEN, csrfToken, {
    httpOnly: false, // Double submit pattern requires JS readability for X-CSRF-Token header
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/',
  });
  return csrfToken;
}

/**
 * Retrieves or initializes an ephemeral guest session UUID
 */
export function getOrCreateGuestSession(req: Request, res: Response): string {
  let guestId = getSecureCookie(req, KNOWN_COOKIE_KEYS.GUEST_SESSION_ID);
  
  if (!guestId) {
    guestId = 'gst_' + crypto.randomUUID();
    setSecureCookie(res, KNOWN_COOKIE_KEYS.GUEST_SESSION_ID, guestId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 48 * 60 * 60, // 48 hours
      path: '/',
    });
  }

  return guestId;
}

/**
 * Parses user consent preferences from incoming request
 */
export function parseConsentFromRequest(req: Request): ConsentPreferences {
  const cookieVal = getSecureCookie<ConsentPreferences>(
    req,
    KNOWN_COOKIE_KEYS.CONSENT_PREFERENCES,
    true
  );
  
  if (cookieVal && typeof cookieVal === 'object' && cookieVal.necessary === true) {
    return cookieVal;
  }

  return DEFAULT_CONSENT_PREFERENCES;
}

/**
 * Checks whether a specific cookie key is permitted based on the request's consent header/cookie
 */
export function isCookiePermittedByConsent(req: Request, key: string): boolean {
  const definition = COOKIE_REGISTRY[key];
  if (!definition || definition.category === 'necessary') {
    return true; // Strictly necessary is always permitted
  }

  const consent = parseConsentFromRequest(req);
  return Boolean(consent[definition.category]);
}
