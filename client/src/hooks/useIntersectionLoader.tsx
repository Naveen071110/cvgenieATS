import { useState, useEffect, useRef, ComponentType, Suspense, lazy } from "react";

interface UseIntersectionLoaderOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function useIntersectionLoader(options: UseIntersectionLoaderOptions = {}) {
  const { rootMargin = "200px", threshold = 0, triggerOnce = true } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (triggerOnce && hasIntersected) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasIntersected(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}

interface LazyLoadSectionProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  rootMargin?: string;
  minHeight?: string;
}

export function LazyLoadSection({ 
  children, 
  fallback, 
  rootMargin = "300px",
  minHeight = "200px" 
}: LazyLoadSectionProps) {
  const { ref, hasIntersected } = useIntersectionLoader({ rootMargin });

  return (
    <div ref={ref} style={{ minHeight: hasIntersected ? "auto" : minHeight }}>
      {hasIntersected ? children : fallback}
    </div>
  );
}

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
