
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <div 
        className={cn(
          'border-2 border-gray-200 border-t-primary rounded-full animate-spin',
          sizeClasses[size]
        )}
        role="status"
        aria-label={text || "Loading"}
      />
      {text && (
        <p className="text-sm text-gray-600 animate-pulse" aria-live="polite">
          {text}
        </p>
      )}
    </div>
  );
}

export function BrandedSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('branded-spinner', className)} role="status" aria-label="Loading" />
  );
}

export function SmallSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('branded-spinner-small', className)} role="status" aria-label="Loading" />
  );
}
