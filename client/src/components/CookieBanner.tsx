/**
 * Enterprise Cookie & State Management Architecture
 * CookieBanner Component
 * 
 * Non-intrusive, accessible, zero-CLS floating banner.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Sliders, X, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { useConsent } from '@/hooks/useConsent';
import { CookiePreferencesModal } from './CookiePreferencesModal';

export function CookieBanner() {
  const {
    hasResponded,
    isReady,
    isPreferencesOpen,
    openPreferences,
    closePreferences,
    acceptAll,
    rejectNonEssential,
  } = useConsent();

  // Don't render until client is hydrated to prevent hydration mismatch/CLS
  if (!isReady) {
    return null;
  }

  const showBanner = !hasResponded;

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.aside
            initial={{ opacity: 0, y: 50, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            role="region"
            aria-label="Cookie consent banner"
            className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-xl z-50 pointer-events-auto"
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl rounded-2xl p-5 sm:p-6 text-slate-900 dark:text-white transition-all">
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    We value your privacy
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    CVGenie uses cookies and state storage to ensure security, personalize your experience, and analyze service performance. You can choose to accept all cookies or manage your preferences anytime.
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 pl-11">
                Learn more in our{' '}
                <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Terms of Service
                </Link>
                .
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pl-0 sm:pl-11">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openPreferences}
                  className="text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  <Sliders className="w-3.5 h-3.5 mr-1.5" />
                  Customize
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={rejectNonEssential}
                  className="text-xs border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Reject Non-Essential
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={acceptAll}
                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md px-4"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <CookiePreferencesModal
        open={isPreferencesOpen}
        onOpenChange={(open) => {
          if (!open) closePreferences();
          else openPreferences();
        }}
      />
    </>
  );
}
