
// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing an operation
  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  // End timing and log the result
  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`⚡ ${label}: ${duration.toFixed(2)}ms`);
      this.metrics.delete(label);
      return duration;
    }
    return 0;
  }

  // Monitor Core Web Vitals
  monitorWebVitals(): void {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`📊 FCP: ${entry.startTime.toFixed(2)}ms`);
      });
    }).observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log(`📊 LCP: ${entry.startTime.toFixed(2)}ms`);
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Cumulative Layout Shift
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (entry.hadRecentInput) return;
        console.log(`📊 CLS: ${entry.value.toFixed(4)}`);
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
}

// Lazy loading utility for images
export const lazyLoadImages = (): void => {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

// Preload critical resources
export const preloadCriticalResources = (): void => {
  const criticalResources = [
    '/src/assets/icons/ai-powered.svg',
    '/src/assets/icons/ats-shield.svg',
    '/src/assets/icons/multi-format-export.svg'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = 'image';
    document.head.appendChild(link);
  });
};
