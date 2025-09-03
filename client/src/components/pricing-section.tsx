import { Check, X } from "lucide-react"
import ATSShieldIcon from "../assets/icons/ats-shield.svg?react"
import MultiFormatExportIcon from "../assets/icons/multi-format-export.svg?react"
import AnalyticsDashboardIcon from "../assets/icons/analytics-dashboard.svg?react"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import { LoginDialog } from "@/components/LoginDialog";
import { Link } from "wouter";


const freePlanFeatures = [
  "3 resume generations per month",
  "AI-powered resume optimization",
  "Personalized cover letters",
  "Multiple export formats",
  "ATS optimization"
];

const proPlanFeatures = [
  "Unlimited resume generations",
  "Priority processing queue",
  "Advanced AI optimizations",
  "Premium export formats",
  "Email support",
  "Resume version history"
];

export default function PricingSection() {
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const freePlanAnimation = useScrollAnimation({ threshold: 0.3 });
  const proPlanAnimation = useScrollAnimation({ threshold: 0.3 });
  const { isOpen, openAuthDialog, closeAuthDialog, dialogConfig } = useAuthDialog();

  // Placeholder for handleUpgradeClick, assuming it's defined elsewhere or will be added.
  // In a real scenario, this would likely involve logic to open a payment modal or redirect.
  const handleUpgradeClick = () => {
    console.log("Upgrade button clicked");
    // Example: openAuthDialog({ title: "Upgrade to Pro", description: "Complete your upgrade." });
  };

  return (
    <section
      id="pricing"
      className="overflow-hidden bg-gray-50"
      style={{
        paddingTop: 'var(--space-12)',
        paddingBottom: 'var(--space-20)'
      }}
    >
      <div className="container-mobile">
        <div
          ref={headerAnimation.ref}
          className={`text-center scroll-fade-in ${headerAnimation.isVisible ? 'visible' : ''}`}
          style={{ marginBottom: 'var(--space-16)' }}
        >
          <h2
            className="text-section-title text-gray-900"
            style={{ marginBottom: 'var(--space-4)' }}
          >
            Simple, Transparent Pricing
          </h2>
          <p className="text-body-large max-w-2xl mx-auto text-gray-600">
            Start for free, upgrade when you need unlimited access
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
          style={{
            gap: 'var(--space-6)',
            paddingLeft: 'var(--space-4)',
            paddingRight: 'var(--space-4)'
          }}
        >
          {/* Free Plan */}
          <Card
            ref={freePlanAnimation.ref}
            className={`shadow-lg floating-card pricing-card-scale bg-white ${
              freePlanAnimation.isVisible ? 'visible' : ''
            }`}
          >
            <CardContent style={{ padding: 'var(--space-6)' }}>
              <div
                className="text-center"
                style={{ marginBottom: 'var(--space-8)' }}
              >
                <h3
                  className="text-card-title text-gray-900"
                  style={{ marginBottom: 'var(--space-2)' }}
                >
                  Free
                </h3>
                <div
                  className="font-bold text-3xl sm:text-4xl text-gray-900"
                  style={{ marginBottom: 'var(--space-4)' }}
                >
                  $0
                  <span className="text-body font-normal text-base sm:text-lg text-gray-500">/month</span>
                </div>
                <p className="text-body text-gray-600">Perfect for trying out CVGenie</p>
              </div>

              <ul
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-8)'
                }}
              >
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature === "ATS optimization" ? (
                      <ATSShieldIcon
                        className="flex-shrink-0 text-green-500"
                        style={{
                          width: 'var(--space-5)',
                          height: 'var(--space-5)',
                          marginRight: 'var(--space-3)'
                        }}
                      />
                    ) : feature === "Multiple export formats" ? (
                      <MultiFormatExportIcon
                        className="flex-shrink-0 text-green-500"
                        style={{
                          width: 'var(--space-5)',
                          height: 'var(--space-5)',
                          marginRight: 'var(--space-3)'
                        }}
                      />
                    ) : (
                      <Check
                        className="flex-shrink-0 text-green-500"
                        style={{
                          width: 'var(--space-5)',
                          height: 'var(--space-5)',
                          marginRight: 'var(--space-3)'
                        }}
                      />
                    )}
                    <span className="text-body text-sm sm:text-base text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/generator" className="w-full">
                <button
                  className="cta-primary w-full"
                  aria-label="Start free plan - Begin creating your resume"
                >
                  Start Free
                </button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card
            ref={proPlanAnimation.ref}
            className={`text-white shadow-xl floating-card pricing-card-flip pricing-shimmer bg-gradient-to-br from-blue-500 to-purple-600 ${
              proPlanAnimation.isVisible ? 'visible' : ''
            }`}
          >
            <CardContent style={{ padding: 'var(--space-6)' }}>
              <div
                className="text-center"
                style={{ marginBottom: 'var(--space-8)' }}
              >
                <h3
                  className="text-card-title text-white"
                  style={{ marginBottom: 'var(--space-2)' }}
                >
                  Pro
                </h3>
                <div
                  className="font-bold text-3xl sm:text-4xl text-white"
                  style={{ marginBottom: 'var(--space-4)' }}
                >
                  $9.99
                  <span className="text-body font-normal opacity-80 text-base sm:text-lg">/month</span>
                </div>
                <p className="text-body opacity-80">For serious job seekers</p>
              </div>

              <ul
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-8)'
                }}
              >
                {proPlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    {feature === "Advanced AI optimizations" ? (
                      <AnalyticsDashboardIcon
                        className="flex-shrink-0 text-green-400"
                        style={{
                          width: 'var(--space-5)',
                          height: 'var(--space-5)',
                          marginRight: 'var(--space-3)'
                        }}
                      />
                    ) : feature === "Premium export formats" ? (
                      <MultiFormatExportIcon
                        className="flex-shrink-0 text-green-400"
                        style={{
                          width: 'var(--space-5)',
                          height: 'var(--space-5)',
                          marginRight: 'var(--space-3)'
                        }}
                      />
                    ) : (
                      <Check
                        className="flex-shrink-0 text-green-400"
                        style={{
                          width: 'var(--space-5)',
                          height: 'var(--space-5)',
                          marginRight: 'var(--space-3)'
                        }}
                      />
                    )}
                    <span className="text-body text-sm sm:text-base text-white">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/generator" className="w-full">
                <button
                  onClick={handleUpgradeClick}
                  className="w-full cta-vibrant cta-animate"
                >
                  Upgrade to Pro
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <LoginDialog
        open={isOpen}
        onOpenChange={closeAuthDialog}
        title={dialogConfig.title}
        description={dialogConfig.description}
      />
    </section>
  );
}