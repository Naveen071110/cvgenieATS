import { TrustBadges } from './trust-badges';
import { CompanyLogos } from './company-logos';

export default function TrustIndicatorsSection() {
  const sectionAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
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