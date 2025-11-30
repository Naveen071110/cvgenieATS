import { TrustBadges } from './trust-badges';

export function TrustIndicatorsSection() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustBadges />
      </div>
    </section>
  );
}