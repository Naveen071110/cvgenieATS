/**
 * Enterprise Cookie & State Management Architecture
 * Types & Schema Definitions
 * 
 * Strict TypeScript taxonomy for OWASP & GDPR/ePrivacy compliance.
 */

export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing';

export type SameSiteOption = 'lax' | 'strict' | 'none' | boolean;

export interface CookieOptions {
  maxAge?: number; // Duration in seconds
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  partitioned?: boolean;
}

export type ThemePreference = 'light' | 'dark' | 'system';

export interface WorkspacePreferences {
  sidebarCollapsed?: boolean;
  density?: 'compact' | 'comfortable';
  activeTab?: string;
  lastViewedCategory?: string;
  volume?: number;
}

export interface ConsentPreferences {
  necessary: true; // Strictly necessary is always active
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string; // ISO 8601 string
  version: string;
}

export interface CookieDefinition {
  name: string;
  category: CookieCategory;
  description: string;
  purpose: string;
  defaultTtlSeconds: number;
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  secure: boolean;
  exampleValues?: string;
}

export const KNOWN_COOKIE_KEYS = {
  // Strictly Necessary
  SESSION_TOKEN: 'app_session_token',
  CSRF_TOKEN: 'csrf_token',
  GUEST_SESSION_ID: 'guest_session_id',

  // Functional & Preferences
  THEME: 'app_theme',
  WORKSPACE_PREFS: 'app_workspace_prefs',
  CONSENT_PREFERENCES: 'app_consent_preferences',

  // Performance & Analytics
  ANALYTICS_SESSION_ID: 'analytics_session_id',

  // Marketing & Referrals
  REF_SOURCE: 'ref_source',
} as const;

export type CookieKey = typeof KNOWN_COOKIE_KEYS[keyof typeof KNOWN_COOKIE_KEYS];
