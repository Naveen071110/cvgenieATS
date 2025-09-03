
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  sizes,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Extract filename without extension for modern format generation
  const getImagePath = (format: string) => {
    const pathWithoutExt = src.replace(/\.[^/.]+$/, '');
    return `${pathWithoutExt}.${format}`;
  };

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Intersection Observer for lazy loading (if not priority)
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            // Load the image when it comes into view
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <picture className={cn('block', className)}>
      {/* AVIF format for modern browsers with best compression */}
      <source
        srcSet={getImagePath('avif')}
        type="image/avif"
        sizes={sizes}
      />
      
      {/* WebP format for broader modern browser support */}
      <source
        srcSet={getImagePath('webp')}
        type="image/webp"
        sizes={sizes}
      />
      
      {/* JPEG fallback for older browsers */}
      <img
        ref={imgRef}
        src={priority ? src : undefined}
        data-src={priority ? undefined : src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'opacity-50',
          className
        )}
        style={{
          aspectRatio: width && height ? `${width}/${height}` : undefined,
        }}
      />
    </picture>
  );
}

// Utility hook for responsive image sizes
export function useResponsiveImageSizes() {
  return {
    hero: '(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw',
    feature: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    avatar: '(max-width: 768px) 64px, 80px',
    logo: '(max-width: 768px) 120px, 160px',
  };
}
