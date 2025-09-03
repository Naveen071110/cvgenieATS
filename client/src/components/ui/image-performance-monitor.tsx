
import { useEffect } from 'react';

interface ImagePerformanceEntry extends PerformanceEntry {
  transferSize?: number;
  encodedBodySize?: number;
  decodedBodySize?: number;
}

export function ImagePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resourceEntry = entry as ImagePerformanceEntry;
        
        if (resourceEntry.name.includes('/images/')) {
          const imageName = resourceEntry.name.split('/').pop() || 'unknown';
          const loadTime = resourceEntry.responseEnd - resourceEntry.requestStart;
          const transferSize = resourceEntry.transferSize || 0;
          
          // Log performance metrics
          console.log(`📸 Image Performance: ${imageName}`, {
            loadTime: `${loadTime.toFixed(2)}ms`,
            transferSize: `${(transferSize / 1024).toFixed(2)}KB`,
            format: imageName.split('.').pop(),
          });

          // Track Core Web Vitals impact
          if (loadTime > 1000) {
            console.warn(`⚠️ Slow image load: ${imageName} took ${loadTime.toFixed(2)}ms`);
          }

          // Send to analytics if available
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'image_load_time', {
              event_category: 'Performance',
              event_label: imageName,
              value: Math.round(loadTime),
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, []);

  return null; // This component doesn't render anything
}

// Utility to measure Cumulative Layout Shift (CLS) impact from images
export function trackImageCLS() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  const observer = new PerformanceObserver((list) => {
    let clsValue = 0;

    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }

    if (clsValue > 0) {
      console.log(`📊 CLS: ${clsValue.toFixed(4)}`);
      
      if (clsValue > 0.1) {
        console.warn('⚠️ High CLS detected - check image dimensions and aspect ratios');
      }
    }
  });

  observer.observe({ entryTypes: ['layout-shift'] });
}

// First Contentful Paint tracking
export function trackFCP() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        console.log(`📊 FCP: ${entry.startTime.toFixed(2)}ms`);
      }
    }
  });

  observer.observe({ entryTypes: ['paint'] });
}

// Largest Contentful Paint tracking
export function trackLCP() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return;
  }

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
  });

  observer.observe({ entryTypes: ['largest-contentful-paint'] });
}
