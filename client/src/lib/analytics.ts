/**
 * CVGenie Analytics & Event Telemetry Module
 * Privacy-first, GDPR/Consent-aware tracking for Google Analytics 4 and custom conversion events.
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-CVGENIEATS';

/**
 * Initialize Google Analytics 4 dynamically when consent is granted
 */
export function initAnalytics(hasAnalyticsConsent: boolean) {
  if (typeof window === 'undefined') return;

  if (hasAnalyticsConsent) {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }

    // Only inject external script if GA_ID is valid and script isn't already loaded
    if (GA_ID && !document.getElementById('ga-script') && !GA_ID.startsWith('G-CVGENIEATS')) {
      const script = document.createElement('script');
      script.id = 'ga-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(script);

      if (window.gtag) {
        window.gtag('js', new Date());
        window.gtag('config', GA_ID, {
          anonymize_ip: true,
          page_path: window.location.pathname,
        });
      }
    }
  } else {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      });
    }
  }
}

/**
 * Track custom user events (e.g. resume generation, upgrade clicks)
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  // Log in development
  if (import.meta.env.DEV) {
    console.log(`📊 [Analytics Event] ${eventName}:`, params);
  }

  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Track page views on route transitions in SPA
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window === 'undefined') return;

  if (window.gtag && GA_ID) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  }
}
