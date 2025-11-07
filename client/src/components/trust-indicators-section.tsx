
import { TrustBadges } from './trust-badges';
import { CompanyLogos } from './company-logos';

export function TrustIndicatorsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Trust Badges */}
          <TrustBadges />
          
          {/* Company Logos */}
          <CompanyLogos />
        </div>
      </div>
    </section>
  );
}
