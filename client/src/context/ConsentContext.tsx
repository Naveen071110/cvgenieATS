/**
 * Enterprise Cookie & State Management Architecture
 * ConsentContext Provider & Hook
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ConsentPreferences } from '../../../shared/cookies/types';
import {
  DEFAULT_CONSENT_PREFERENCES,
  ALL_CONSENT_PREFERENCES,
  REJECT_NON_ESSENTIAL_PREFERENCES,
} from '../../../shared/cookies/config';
import {
  getConsentPreferences,
  setConsentPreferences,
  hasUserConsented,
  COOKIE_CONSENT_EVENT,
} from '../lib/cookies/client';

export interface ConsentContextValue {
  consent: ConsentPreferences;
  hasResponded: boolean;
  isReady: boolean;
  isPreferencesOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  updateConsent: (prefs: Partial<ConsentPreferences>) => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
}

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [consent, setConsentState] = useState<ConsentPreferences>(DEFAULT_CONSENT_PREFERENCES);

  // Initialize on client mount
  useEffect(() => {
    const currentConsent = getConsentPreferences();
    const answered = hasUserConsented();
    
    setConsentState(currentConsent);
    setHasResponded(answered);
    setIsReady(true);

    const handleConsentEvent = (event: Event) => {
      const customEvent = event as CustomEvent<ConsentPreferences>;
      if (customEvent.detail) {
        setConsentState(customEvent.detail);
        setHasResponded(true);
      }
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentEvent);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentEvent);
    };
  }, []);

  const openPreferences = useCallback(() => {
    setIsPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setIsPreferencesOpen(false);
  }, []);

  const updateConsent = useCallback((prefs: Partial<ConsentPreferences>) => {
    const updated = setConsentPreferences(prefs);
    setConsentState(updated);
    setHasResponded(true);
    setIsPreferencesOpen(false);
  }, []);

  const acceptAll = useCallback(() => {
    const updated = setConsentPreferences(ALL_CONSENT_PREFERENCES);
    setConsentState(updated);
    setHasResponded(true);
    setIsPreferencesOpen(false);
  }, []);

  const rejectNonEssential = useCallback(() => {
    const updated = setConsentPreferences(REJECT_NON_ESSENTIAL_PREFERENCES);
    setConsentState(updated);
    setHasResponded(true);
    setIsPreferencesOpen(false);
  }, []);

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasResponded,
        isReady,
        isPreferencesOpen,
        openPreferences,
        closePreferences,
        updateConsent,
        acceptAll,
        rejectNonEssential,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
};

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within a ConsentProvider');
  }
  return context;
}
