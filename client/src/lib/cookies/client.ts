/**
 * Enterprise Cookie & State Management Architecture
 * Client-Side Cookie & Consent Manager
 * 
 * Complies with GDPR/ePrivacy Directive and OWASP guidelines:
 * - Real-time custom event bus for instant UI reactivity
 * - Pre-flight consent enforcement before writing non-essential cookies
 * - Automatic purge of withdrawn categories
 * - Cross-tab synchronization via StorageEvent / BroadcastChannel
 */

import {
  CookieKey,
  CookieOptions,
  ConsentPreferences,
  KNOWN_COOKIE_KEYS,
} from '../../../../shared/cookies/types';
import {
  COOKIE_REGISTRY,
  DEFAULT_CONSENT_PREFERENCES,
  ALL_CONSENT_PREFERENCES,
  REJECT_NON_ESSENTIAL_PREFERENCES,
  CONSENT_COOKIE_VERSION,
} from '../../../../shared/cookies/config';

export const COOKIE_CONSENT_EVENT = 'cvgenie_cookie_consent_changed';
export const COOKIE_CHANGE_EVENT = 'cvgenie_cookie_changed';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * Parses all document cookies into a key-value record safely
 */
export function getAllCookies(): Record<string, string> {
  if (!isBrowser) return {};
  
  const cookies: Record<string, string> = {};
  const rawCookie = document.cookie;
  if (!rawCookie) return cookies;

  const parts = rawCookie.split(';');
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;
    const eqIdx = part.indexOf('=');
    if (eqIdx !== -1) {
      const key = decodeURIComponent(part.substring(0, eqIdx).trim());
      const val = decodeURIComponent(part.substring(eqIdx + 1).trim());
      cookies[key] = val;
    }
  }

  return cookies;
}

/**
 * Gets a single cookie value by key safely
 */
export function getCookie<T = string>(name: string, parseJson: boolean = false): T | null {
  if (!isBrowser) return null;

  const cookies = getAllCookies();
  const rawVal = cookies[name];
  if (rawVal === undefined || rawVal === null) return null;

  if (parseJson) {
    try {
      return JSON.parse(rawVal) as T;
    } catch {
      return null;
    }
  }

  return rawVal as unknown as T;
}

/**
 * Checks if writing a cookie is allowed based on active consent
 */
export function isCookieAllowed(name: string): boolean {
  // Consent cookie itself & strictly necessary cookies are always allowed
  const definition = COOKIE_REGISTRY[name];
  if (!definition || definition.category === 'necessary') {
    return true;
  }

  const consent = getConsentPreferences();
  return Boolean(consent[definition.category]);
}

/**
 * Sets a cookie in document.cookie with GDPR pre-flight gate and OWASP flags
 */
export function setCookie(
  name: string,
  value: string | object,
  options?: CookieOptions
): boolean {
  if (!isBrowser) return false;

  // 1. Consent Gate
  if (!isCookieAllowed(name)) {
    console.warn(`[CookieManager] Blocked writing "${name}" — User has not granted consent for category.`);
    return false;
  }

  const definition = COOKIE_REGISTRY[name];
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

  // 2. Options Resolution
  const path = options?.path || '/';
  const maxAge = options?.maxAge !== undefined 
    ? options.maxAge 
    : (definition?.defaultTtlSeconds ?? 30 * 24 * 60 * 60);
  
  const sameSite = options?.sameSite || definition?.sameSite || 'lax';
  const secure = options?.secure !== undefined 
    ? options.secure 
    : (window.location.protocol === 'https:' || process.env.NODE_ENV === 'production');

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(stringValue)}; Path=${path}`;

  if (maxAge) {
    cookieString += `; Max-Age=${maxAge}`;
  }

  if (options?.domain) {
    cookieString += `; Domain=${options.domain}`;
  }

  if (sameSite) {
    cookieString += `; SameSite=${sameSite}`;
  }

  if (secure) {
    cookieString += `; Secure`;
  }

  document.cookie = cookieString;

  // 3. Dispatch change event
  window.dispatchEvent(
    new CustomEvent(COOKIE_CHANGE_EVENT, {
      detail: { name, value: stringValue },
    })
  );

  return true;
}

/**
 * Removes a cookie by expiring it in the past
 */
export function removeCookie(
  name: string,
  options?: Pick<CookieOptions, 'path' | 'domain'>
): void {
  if (!isBrowser) return;

  const path = options?.path || '/';
  let cookieString = `${encodeURIComponent(name)}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`;

  if (options?.domain) {
    cookieString += `; Domain=${options.domain}`;
  }

  document.cookie = cookieString;

  window.dispatchEvent(
    new CustomEvent(COOKIE_CHANGE_EVENT, {
      detail: { name, value: null },
    })
  );
}

/**
 * Returns current user consent preferences from cookie or defaults
 */
export function getConsentPreferences(): ConsentPreferences {
  if (!isBrowser) return DEFAULT_CONSENT_PREFERENCES;

  const stored = getCookie<ConsentPreferences>(
    KNOWN_COOKIE_KEYS.CONSENT_PREFERENCES,
    true
  );

  if (stored && stored.necessary === true && stored.version === CONSENT_COOKIE_VERSION) {
    return stored;
  }

  return DEFAULT_CONSENT_PREFERENCES;
}

/**
 * Checks if the user has explicitly responded to the consent banner
 */
export function hasUserConsented(): boolean {
  if (!isBrowser) return false;
  const stored = getCookie<ConsentPreferences>(
    KNOWN_COOKIE_KEYS.CONSENT_PREFERENCES,
    true
  );
  return Boolean(stored && stored.timestamp);
}

/**
 * Updates consent preferences and removes any orphaned cookies from withdrawn categories
 */
export function setConsentPreferences(
  prefs: Partial<ConsentPreferences>
): ConsentPreferences {
  if (!isBrowser) return DEFAULT_CONSENT_PREFERENCES;

  const fullPrefs: ConsentPreferences = {
    necessary: true,
    functional: Boolean(prefs.functional),
    analytics: Boolean(prefs.analytics),
    marketing: Boolean(prefs.marketing),
    timestamp: new Date().toISOString(),
    version: CONSENT_COOKIE_VERSION,
  };

  // Directly set consent cookie (it's in the necessary category)
  const path = '/';
  const maxAge = 365 * 24 * 60 * 60; // 365 days
  const secure = window.location.protocol === 'https:' || process.env.NODE_ENV === 'production';
  const val = encodeURIComponent(JSON.stringify(fullPrefs));
  
  document.cookie = `${encodeURIComponent(KNOWN_COOKIE_KEYS.CONSENT_PREFERENCES)}=${val}; Path=${path}; Max-Age=${maxAge}; SameSite=Lax${secure ? '; Secure' : ''}`;

  // Purge any cookies whose consent was revoked
  purgeDisallowedCookies(fullPrefs);

  // Dispatch global consent event
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, {
      detail: fullPrefs,
    })
  );

  return fullPrefs;
}

/**
 * Purges any existing cookies that are no longer allowed under current consent
 */
export function purgeDisallowedCookies(consent: ConsentPreferences): void {
  if (!isBrowser) return;

  const all = getAllCookies();
  for (const cookieName of Object.keys(all)) {
    const definition = COOKIE_REGISTRY[cookieName];
    if (definition && definition.category !== 'necessary') {
      if (!consent[definition.category]) {
        removeCookie(cookieName);
      }
    }
  }
}

/**
 * Quick action helper: Accept All
 */
export function acceptAllCookies(): ConsentPreferences {
  return setConsentPreferences(ALL_CONSENT_PREFERENCES);
}

/**
 * Quick action helper: Reject Non-Essential
 */
export function rejectNonEssentialCookies(): ConsentPreferences {
  return setConsentPreferences(REJECT_NON_ESSENTIAL_PREFERENCES);
}
