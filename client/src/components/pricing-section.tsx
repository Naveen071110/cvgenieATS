import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import { LoginDialog } from "@/components/LoginDialog";

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

  return (
    <section id="pricing" className="py-12 sm:py-20 overflow-hidden" style={{ backgroundColor: var(--color-gray-50) }}>
      <div className="container-mobile">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-12 sm:mb-16 scroll-fade-in ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="typography-section-header mb-4" style={{ color: var(--color-gray-900) }}>
            Simple, Transparent Pricing
          </h2>
          <p className="typography-body max-w-2xl mx-auto text-lg" style={{ color: var(--color-gray-600) }}>
            Start for free, upgrade when you need unlimited access
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4 sm:px-0">
          {/* Free Plan */}
          <Card
            ref={freePlanAnimation.ref}
            className={`shadow-lg floating-card pricing-card-scale ${
              freePlanAnimation.isVisible ? 'visible' : ''
            }`}
            style={{ backgroundColor: '#ffffff' }}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="typography-subheader mb-2" style={{ color: var(--color-gray-900) }}>Free</h3>
                <div className="typography-headline mb-4 text-3xl sm:text-4xl" style={{ color: var(--color-gray-900) }}>
                  $0
                  <span className="typography-body font-normal text-base sm:text-lg" style={{ color: var(--color-gray-500) }}>/month</span>
                </div>
                <p className="typography-body" style={{ color: var(--color-gray-600) }}>Perfect for trying out CVGenie</p>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check 
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-3 flex-shrink-0" 
                      style={{ color: var(--color-success-500) }}
                    />
                    <span className="typography-body text-sm sm:text-base" style={{ color: var(--color-gray-600) }}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                className="w-full py-3 px-6 font-semibold"
                style={{ 
                  borderColor: var(--color-gray-300),
                  color: var(--color-gray-700)
                }}
                onClick={() => {
                  const element = document.getElementById("generator");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card
            ref={proPlanAnimation.ref}
            className={`text-white shadow-xl floating-card pricing-card-flip pricing-shimmer ${
              proPlanAnimation.isVisible ? 'visible' : ''
            }`}
            style={{ 
              background: var(--gradient-primary)
            }}
          >
            <CardContent className="p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <h3 className="typography-subheader mb-2">Pro</h3>
                <div className="typography-headline mb-4 text-3xl sm:text-4xl">
                  $9.99
                  <span className="typography-body font-normal opacity-80 text-base sm:text-lg">/month</span>
                </div>
                <p className="typography-body opacity-80">For serious job seekers</p>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {proPlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check 
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-3 flex-shrink-0" 
                      style={{ color: var(--color-success-500) }}
                    />
                    <span className="typography-body text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant="accent"
                size="lg"
                style={{
                  backgroundColor: var(--color-warning-500),
                  color: '#ffffff'
                }}
                onClick={() => openAuthDialog({
                  title: "Upgrade to Pro",
                  description: "Sign in to upgrade to Pro and get unlimited generations."
                })}
              >
                Upgrade to Pro
              </Button>
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