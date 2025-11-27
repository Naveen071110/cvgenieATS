import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';

const companies = [
  { name: 'Google', logo: '🔍' },
  { name: 'Microsoft', logo: '🪟' },
  { name: 'Apple', logo: '🍎' },
  { name: 'Amazon', logo: '📦' },
  { name: 'Netflix', logo: '🎬' },
  { name: 'Adobe', logo: '🎨' },
  { name: 'Spotify', logo: '🎵' },
  { name: 'Uber', logo: '🚗' },
  { name: 'Airbnb', logo: '🏠' },
  { name: 'Slack', logo: '💬' }
];

interface CompanyLogosProps {
  className?: string;
}

function CompanyLogosSkeleton() {
  return (
    <div className="flex items-center justify-center gap-4 overflow-hidden py-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-loading"
          role="presentation"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function CompanyLogos({ className }: CompanyLogosProps) {
  const [isInView, setIsInView] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!isInView) {
    return (
      <div ref={containerRef} className={cn('company-logos overflow-hidden', className)}>
        <CompanyLogosSkeleton />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={cn('company-logos overflow-hidden', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-r from-gray-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-l from-gray-50 dark:from-slate-900 to-transparent z-10 pointer-events-none" />

        <div 
          className={cn(
            "flex animate-marquee",
            isPaused && "animation-paused"
          )}
        >
          {[...companies, ...companies].map((company, index) => (
            <div
              key={`logo-${index}`}
              className="flex-shrink-0 flex items-center px-3 py-2 mx-2 bg-white dark:bg-gray-800/80 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors duration-200 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700/50"
              title={company.name}
            >
              <span className="text-2xl mr-2" role="img" aria-label={company.name}>
                {company.logo}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap hidden sm:inline">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
