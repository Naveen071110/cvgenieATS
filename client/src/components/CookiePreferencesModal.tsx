/**
 * Enterprise Cookie & State Management Architecture
 * Cookie Preferences Modal (Granular Settings Drawer/Modal)
 * 
 * WCAG AA accessible, keyboard navigable, categorized toggles.
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Sliders, Info, Check, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { useConsent } from '@/hooks/useConsent';
import { COOKIE_CATEGORIES, COOKIE_REGISTRY } from '../../../shared/cookies/config';
import { CookieCategory } from '../../../shared/cookies/types';

interface CookiePreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CookiePreferencesModal({ open, onOpenChange }: CookiePreferencesModalProps) {
  const { consent, updateConsent, acceptAll, rejectNonEssential } = useConsent();

  // Local state for interactive editing before save
  const [prefs, setPrefs] = useState({
    functional: consent.functional,
    analytics: consent.analytics,
    marketing: consent.marketing,
  });

  const [expandedCategory, setExpandedCategory] = useState<CookieCategory | null>(null);

  // Sync with current consent when modal opens
  useEffect(() => {
    if (open) {
      setPrefs({
        functional: consent.functional,
        analytics: consent.analytics,
        marketing: consent.marketing,
      });
    }
  }, [open, consent]);

  const handleToggle = (category: 'functional' | 'analytics' | 'marketing') => {
    setPrefs((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    updateConsent(prefs);
    onOpenChange(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    onOpenChange(false);
  };

  const handleRejectAll = () => {
    rejectNonEssential();
    onOpenChange(false);
  };

  const toggleExpand = (catId: CookieCategory) => {
    setExpandedCategory((prev) => (prev === catId ? null : catId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl"
        aria-describedby="cookie-preferences-description"
      >
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Cookie & Privacy Preferences
              </DialogTitle>
              <DialogDescription id="cookie-preferences-description" className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customize which cookies you want to allow. Strictly necessary cookies cannot be disabled as they are required for security and core functionality.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {COOKIE_CATEGORIES.map((cat) => {
            const isNecessary = cat.id === 'necessary';
            const isChecked = isNecessary ? true : prefs[cat.id as 'functional' | 'analytics' | 'marketing'];
            const isExpanded = expandedCategory === cat.id;

            return (
              <div
                key={cat.id}
                className={`border rounded-xl transition-all duration-200 ${
                  isChecked
                    ? 'border-blue-200/80 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/10'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                        {cat.name}
                      </h3>
                      <Badge
                        variant={isNecessary ? "secondary" : isChecked ? "default" : "outline"}
                        className={`text-[10px] font-medium px-2 py-0.5 ${
                          isNecessary 
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300' 
                            : isChecked 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-500'
                        }`}
                      >
                        {isNecessary ? (
                          <span className="flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            {cat.badge}
                          </span>
                        ) : (
                          cat.badge
                        )}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {cat.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => toggleExpand(cat.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline pt-1"
                      aria-expanded={isExpanded}
                    >
                      {isExpanded ? (
                        <>
                          Hide cookie details <ChevronUp className="w-3 h-3" />
                        </>
                      ) : (
                        <>
                          View {cat.cookies.length} cookie{cat.cookies.length > 1 ? 's' : ''} in this category <ChevronDown className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Switch */}
                  <div className="pt-1 flex items-center">
                    {isNecessary ? (
                      <div className="cursor-not-allowed opacity-75" title="Strictly necessary cookies cannot be disabled">
                        <Switch checked={true} disabled aria-label={`${cat.name} cookies are always active`} />
                      </div>
                    ) : (
                      <Switch
                        checked={isChecked}
                        onCheckedChange={() => handleToggle(cat.id as 'functional' | 'analytics' | 'marketing')}
                        aria-label={`Toggle ${cat.name} cookies`}
                      />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5">
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Registered Cookies:
                    </p>
                    <div className="space-y-2">
                      {cat.cookies.map((cookieKey) => {
                        const def = COOKIE_REGISTRY[cookieKey];
                        if (!def) return null;
                        return (
                          <div
                            key={cookieKey}
                            className="text-xs bg-white dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                          >
                            <div>
                              <code className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                                {def.name}
                              </code>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                {def.purpose}
                              </p>
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                              Retention: {Math.round(def.defaultTtlSeconds / 86400)} days
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRejectAll}
              className="flex-1 sm:flex-initial text-xs border-slate-300 dark:border-slate-700"
            >
              Reject Non-Essential
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-initial text-xs border-slate-300 dark:border-slate-700"
            >
              Accept All
            </Button>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 shadow-sm"
          >
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
