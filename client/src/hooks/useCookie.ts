/**
 * React hook for type-safe cookie management
 * Synchronized with client cookie event bus
 */

import { useState, useEffect, useCallback } from 'react';
import { getCookie, setCookie, removeCookie, COOKIE_CHANGE_EVENT } from '../lib/cookies/client';
import { CookieOptions } from '../../../shared/cookies/types';

export function useCookie<T = string>(
  key: string,
  initialValue?: T,
  options?: CookieOptions
): [T | null, (value: T | ((prev: T | null) => T), opts?: CookieOptions) => boolean, () => void] {
  const [cookieValue, setCookieValue] = useState<T | null>(() => {
    const isJson = typeof initialValue === 'object' && initialValue !== null;
    const existing = getCookie<T>(key, isJson);
    if (existing !== null) return existing;
    return initialValue ?? null;
  });

  // Listen to external cookie modifications
  useEffect(() => {
    const handleCookieChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ name: string; value: string | null }>;
      if (customEvent.detail && customEvent.detail.name === key) {
        if (customEvent.detail.value === null) {
          setCookieValue(null);
        } else {
          const isJson = typeof initialValue === 'object' && initialValue !== null;
          setCookieValue(getCookie<T>(key, isJson));
        }
      }
    };

    window.addEventListener(COOKIE_CHANGE_EVENT, handleCookieChange);
    return () => {
      window.removeEventListener(COOKIE_CHANGE_EVENT, handleCookieChange);
    };
  }, [key, initialValue]);

  const updateCookie = useCallback(
    (newValueOrFn: T | ((prev: T | null) => T), updateOpts?: CookieOptions): boolean => {
      const resolvedValue = typeof newValueOrFn === 'function'
        ? (newValueOrFn as (prev: T | null) => T)(cookieValue)
        : newValueOrFn;

      const success = setCookie(key, resolvedValue as string | object, {
        ...options,
        ...updateOpts,
      });

      if (success) {
        setCookieValue(resolvedValue);
      }

      return success;
    },
    [key, options, cookieValue]
  );

  const deleteCookie = useCallback(() => {
    removeCookie(key, options);
    setCookieValue(null);
  }, [key, options]);

  return [cookieValue, updateCookie, deleteCookie];
}
