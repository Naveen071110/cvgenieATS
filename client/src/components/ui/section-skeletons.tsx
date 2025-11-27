import { cn } from "@/lib/utils";

export function HeroSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-full py-16 px-4", className)}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-loading mx-auto max-w-2xl" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-loading mx-auto max-w-xl" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-loading mx-auto max-w-lg" />
        </div>
        <div className="flex justify-center gap-4">
          <div className="h-12 w-40 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-loading" />
          <div className="h-12 w-32 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-loading" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 text-center border-2 border-white/20 dark:border-white/10",
      className
    )}>
      <div className="w-10 h-10 mx-auto mb-4 bg-white/20 rounded-full skeleton-loading" />
      <div className="h-10 w-24 mx-auto mb-2 bg-white/20 rounded skeleton-loading" />
      <div className="h-4 w-20 mx-auto bg-white/20 rounded skeleton-loading" />
    </div>
  );
}

export function StatsSectionSkeleton() {
  return (
    <div className="py-12 px-6 md:px-8 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl">
      <div className="h-8 w-64 mx-auto mb-10 bg-white/20 rounded skeleton-loading" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function FeatureCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4",
      className
    )}>
      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl skeleton-loading" />
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
      </div>
    </div>
  );
}

export function FeatureSectionSkeleton() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="h-10 w-80 mx-auto bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
          <div className="h-6 w-96 mx-auto bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <FeatureCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function PricingCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 space-y-6",
      className
    )}>
      <div className="space-y-2">
        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-loading" />
            <div className="h-4 flex-1 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
          </div>
        ))}
      </div>
      <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-loading" />
    </div>
  );
}

export function PricingSectionSkeleton() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="h-10 w-64 mx-auto bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
          <div className="h-6 w-96 mx-auto bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <PricingCardSkeleton />
          <PricingCardSkeleton />
        </div>
      </div>
    </div>
  );
}

export function TestimonialCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 space-y-4",
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-loading" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
      </div>
    </div>
  );
}

export function TestimonialsSectionSkeleton() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="h-10 w-72 mx-auto bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <TestimonialCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FAQSkeleton() {
  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="h-10 w-48 mx-auto mb-12 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CompanyLogosSkeleton() {
  return (
    <div className="flex items-center justify-center gap-4 overflow-hidden py-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-28 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-loading"
        />
      ))}
    </div>
  );
}

export function TrustBadgesSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full"
        >
          <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full skeleton-loading" />
          <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        </div>
      ))}
    </div>
  );
}

export function GeneratorSkeleton() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="h-10 w-80 mx-auto bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
          <div className="h-6 w-96 mx-auto bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 space-y-6 border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-loading" />
          </div>
          <div className="space-y-4">
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded skeleton-loading" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-loading" />
          </div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg skeleton-loading" />
        </div>
      </div>
    </div>
  );
}
