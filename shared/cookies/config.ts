/**
 * Enterprise Cookie & State Management Architecture
 * Centralized Cookie Registry & Defaults
 */

import { CookieCategory, CookieDefinition, KNOWN_COOKIE_KEYS, ConsentPreferences } from './types';

export const CONSENT_COOKIE_VERSION = '1.0';

export const DEFAULT_CONSENT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: '',
  version: CONSENT_COOKIE_VERSION,
};

export const ALL_CONSENT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
  timestamp: '',
  version: CONSENT_COOKIE_VERSION,
};

export const REJECT_NON_ESSENTIAL_PREFERENCES: ConsentPreferences = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: '',
  version: CONSENT_COOKIE_VERSION,
};

/**
 * Registry defining all 8 enterprise cookies, their categories, security flags, and retention policies.
 */
export const COOKIE_REGISTRY: Record<string, CookieDefinition> = {
  [KNOWN_COOKIE_KEYS.SESSION_TOKEN]: {
    name: KNOWN_COOKIE_KEYS.SESSION_TOKEN,
    category: 'necessary',
    description: 'User authentication session token',
    purpose: 'Maintains authenticated state securely using encrypted JWT tokens.',
    defaultTtlSeconds: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  },
  [KNOWN_COOKIE_KEYS.CSRF_TOKEN]: {
    name: KNOWN_COOKIE_KEYS.CSRF_TOKEN,
    category: 'necessary',
    description: 'Cross-Site Request Forgery mitigation token',
    purpose: 'Protects state-changing requests against CSRF attacks.',
    defaultTtlSeconds: 24 * 60 * 60, // 24 hours
    httpOnly: false, // Accessible to client header sender for double-submit cookie verification
    sameSite: 'strict',
    secure: true,
  },
  [KNOWN_COOKIE_KEYS.GUEST_SESSION_ID]: {
    name: KNOWN_COOKIE_KEYS.GUEST_SESSION_ID,
    category: 'necessary',
    description: 'Ephemeral visitor session identifier',
    purpose: 'Retains anonymous draft resumes in progress before account creation.',
    defaultTtlSeconds: 48 * 60 * 60, // 48 hours
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  },
  [KNOWN_COOKIE_KEYS.THEME]: {
    name: KNOWN_COOKIE_KEYS.THEME,
    category: 'functional',
    description: 'UI color theme preference',
    purpose: 'Persists dark or light mode preference across page loads and visits.',
    defaultTtlSeconds: 365 * 24 * 60 * 60, // 365 days
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
  },
  [KNOWN_COOKIE_KEYS.WORKSPACE_PREFS]: {
    name: KNOWN_COOKIE_KEYS.WORKSPACE_PREFS,
    category: 'functional',
    description: 'User interface layout and workspace settings',
    purpose: 'Remembers panel sizes, active filters, and table display density.',
    defaultTtlSeconds: 90 * 24 * 60 * 60, // 90 days
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
  },
  [KNOWN_COOKIE_KEYS.CONSENT_PREFERENCES]: {
    name: KNOWN_COOKIE_KEYS.CONSENT_PREFERENCES,
    category: 'necessary', // Storing the consent record itself is strictly necessary for legal compliance
    description: 'User GDPR and ePrivacy consent state record',
    purpose: 'Records explicit consent decisions so preferences are respected across visits.',
    defaultTtlSeconds: 365 * 24 * 60 * 60, // 365 days
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
  },
  [KNOWN_COOKIE_KEYS.ANALYTICS_SESSION_ID]: {
    name: KNOWN_COOKIE_KEYS.ANALYTICS_SESSION_ID,
    category: 'analytics',
    description: 'First-party anonymized usage telemetry',
    purpose: 'Measures aggregated feature usage and performance metrics to improve the tool.',
    defaultTtlSeconds: 30 * 24 * 60 * 60, // 30 days
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
  },
  [KNOWN_COOKIE_KEYS.REF_SOURCE]: {
    name: KNOWN_COOKIE_KEYS.REF_SOURCE,
    category: 'marketing',
    description: 'Referral and acquisition campaign attribution',
    purpose: 'Attributes registration to promotional campaigns or partner referrals.',
    defaultTtlSeconds: 30 * 24 * 60 * 60, // 30 days
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
  },
};

/**
 * Category metadata for UI modal presentation
 */
export interface CategoryMetadata {
  id: CookieCategory;
  name: string;
  badge: string;
  required: boolean;
  summary: string;
  description: string;
  cookies: string[];
}

export const COOKIE_CATEGORIES: CategoryMetadata[] = [
  {
    id: 'necessary',
    name: 'Strictly Necessary',
    badge: 'Always Active',
    required: true,
    summary: 'Essential for security, session authentication, and core functionality.',
    description: 'These cookies are essential for you to browse the website and use its features, such as accessing secure areas, preventing CSRF attacks, and retaining your consent choice. These cannot be disabled.',
    cookies: [KNOWN_COOKIE_KEYS.SESSION_TOKEN, KNOWN_COOKIE_KEYS.CSRF_TOKEN, KNOWN_COOKIE_KEYS.GUEST_SESSION_ID, KNOWN_COOKIE_KEYS.CONSENT_PREFERENCES],
  },
  {
    id: 'functional',
    name: 'Preferences & Functional',
    badge: 'Customizable',
    required: false,
    summary: 'Personalizes your experience by remembering themes and layout states.',
    description: 'Functional cookies allow the website to remember choices you make (such as dark/light theme, custom workspace configurations, and table display density) to provide enhanced, personalized features.',
    cookies: [KNOWN_COOKIE_KEYS.THEME, KNOWN_COOKIE_KEYS.WORKSPACE_PREFS],
  },
  {
    id: 'analytics',
    name: 'Performance & Analytics',
    badge: 'Opt-in',
    required: false,
    summary: 'Anonymized telemetry to understand usage patterns and speed up generation.',
    description: 'These cookies collect anonymized information about how visitors interact with CVGenie, which pages are visited most frequently, and system performance metrics. All data is aggregated and anonymous.',
    cookies: [KNOWN_COOKIE_KEYS.ANALYTICS_SESSION_ID],
  },
  {
    id: 'marketing',
    name: 'Marketing & Referrals',
    badge: 'Opt-in',
    required: false,
    summary: 'Measures campaign effectiveness and referral partnerships.',
    description: 'These cookies track marketing campaign attribution and referral sources so we can evaluate promotional partnerships and credit affiliate referrers.',
    cookies: [KNOWN_COOKIE_KEYS.REF_SOURCE],
  },
];
