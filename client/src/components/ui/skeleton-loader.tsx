
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  animated?: boolean;
}

export function SkeletonText({ className, animated = true }: SkeletonProps) {
  return (
    <div 
      className={cn(
        'h-4 bg-gray-200 rounded',
        animated && 'skeleton-loading',
        className
      )}
      role="presentation"
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('p-6 border rounded-lg bg-white space-y-4', className)}>
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-lg skeleton-loading" />
        <div className="flex-1 space-y-2">
          <SkeletonText className="w-3/4" />
          <SkeletonText className="w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <SkeletonText />
        <SkeletonText />
        <SkeletonText className="w-4/5" />
      </div>
    </div>
  );
}

export function SkeletonFeatureGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonButton({ className }: SkeletonProps) {
  return (
    <div 
      className={cn(
        'h-10 w-32 bg-gray-200 rounded-md skeleton-loading',
        className
      )}
      role="presentation"
      aria-hidden="true"
    />
  );
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return (
    <div 
      className={cn(
        'w-10 h-10 bg-gray-200 rounded-full skeleton-loading',
        className
      )}
      role="presentation"
      aria-hidden="true"
    />
  );
}
