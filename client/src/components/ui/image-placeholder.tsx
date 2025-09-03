
import React from 'react';
import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
  width?: number;
  height?: number;
  className?: string;
  showSpinner?: boolean;
}

export function ImagePlaceholder({
  width,
  height,
  className,
  showSpinner = true,
}: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 animate-pulse flex items-center justify-center',
        className
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '200px',
        aspectRatio: width && height ? `${width}/${height}` : undefined,
      }}
    >
      {showSpinner && (
        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      )}
    </div>
  );
}
