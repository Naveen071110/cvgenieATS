import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { LoginDialog } from "@/components/LoginDialog";
import { useConsent } from "@/hooks/useConsent";
import { trackEvent } from "@/lib/analytics";

export function StickyMobileCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { requireAuthThenNavigate, showLogin, setShowLogin } = useRequireAuth();
  const { hasResponded, isReady } = useConsent();

  // Only show after user has scrolled past hero section (> 350px)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleClick = () => {
    trackEvent("click_sticky_mobile_cta");
    requireAuthThenNavigate("/generator");
  };

  // If cookie banner is active and user hasn't answered, give cookie banner precedence
  const isCookieBannerActive = isReady && !hasResponded;

  return (
    <>
      <AnimatePresence>
        {isVisible && !isCookieBannerActive && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-3 inset-x-3 z-40 md:hidden pointer-events-auto"
          >
            <div className="relative flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 shadow-2xl shadow-blue-950/50">
              <div className="flex-1 min-w-0 pl-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                  <span>100% Free AI Builder</span>
                </div>
                <p className="text-xs text-slate-300 truncate font-medium">
                  Beat ATS &amp; Land Interviews
                </p>
              </div>

              <Button
                onClick={handleClick}
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 text-xs rounded-xl shadow-lg shadow-blue-600/30 shrink-0 gap-1"
              >
                <span>Build Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="p-1 rounded-full text-slate-400 hover:text-white transition-colors"
                aria-label="Dismiss sticky CTA"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        title="Sign in to Build Your Resume"
        description="Save your resumes, track ATS match score, and generate tailored cover letters in seconds."
      />
    </>
  );
}
