
// Image optimization utilities for CVGenie

export interface ImageFormat {
  avif: string;
  webp: string;
  jpg: string;
}

export function getOptimizedImageSrcSet(basePath: string): ImageFormat {
  const pathWithoutExt = basePath.replace(/\.[^/.]+$/, '');
  
  return {
    avif: `${pathWithoutExt}.avif`,
    webp: `${pathWithoutExt}.webp`,
    jpg: `${pathWithoutExt}.jpg`,
  };
}

export function createImageSrcSet(
  basePath: string,
  sizes: number[] = [400, 800, 1200]
): string {
  const pathWithoutExt = basePath.replace(/\.[^/.]+$/, '');
  
  const avifSrcSet = sizes
    .map(size => `${pathWithoutExt}-${size}.avif ${size}w`)
    .join(', ');
  
  const webpSrcSet = sizes
    .map(size => `${pathWithoutExt}-${size}.webp ${size}w`)
    .join(', ');
  
  const jpgSrcSet = sizes
    .map(size => `${pathWithoutExt}-${size}.jpg ${size}w`)
    .join(', ');
  
  return jpgSrcSet; // Return fallback for now
}

// Performance tracking for image loading
export function trackImagePerformance(imageName: string, loadTime: number) {
  if (typeof window !== 'undefined' && 'performance' in window) {
    try {
      // Log to performance observer
      console.log(`📸 Image ${imageName} loaded in ${loadTime}ms`);
      
      // You can extend this to send to analytics
      // analytics.track('image_load_time', { imageName, loadTime });
    } catch (error) {
      console.warn('Image performance tracking failed:', error);
    }
  }
}

// Preload critical images
export function preloadCriticalImages(imagePaths: string[]) {
  if (typeof window === 'undefined') return;
  
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
}

// Responsive image sizes for different use cases
export const responsiveImageSizes = {
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw',
  feature: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  avatar: '(max-width: 768px) 64px, 80px',
  logo: '(max-width: 768px) 120px, 160px',
  thumbnail: '(max-width: 768px) 150px, 200px',
} as const;
