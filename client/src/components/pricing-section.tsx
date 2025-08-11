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
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 scroll-fade-in ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start for free, upgrade when you need unlimited access
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card
            ref={freePlanAnimation.ref}
            className={`bg-white shadow-lg floating-card pricing-card-scale ${
              freePlanAnimation.isVisible ? 'visible' : ''
            }`}
          >
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-slate-900 mb-4">
                  $0
                  <span className="text-lg font-normal text-slate-500">/month</span>
                </div>
                <p className="text-slate-600">Perfect for trying out CVGenie</p>
              </div>

              <ul className="space-y-4 mb-8">
                {freePlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant="outline"
                className="w-full py-3 px-6 font-semibold"
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
            className={`bg-primary text-white shadow-xl relative floating-card pricing-card-flip pricing-shimmer ${
              proPlanAnimation.isVisible ? 'visible' : ''
            }`}
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="badge-accent mb-4 badge-pulse">
                MOST POPULAR
              </div>
            </div>

            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-4">
                  $9.99
                  <span className="text-lg font-normal opacity-80">/month</span>
                </div>
                <p className="opacity-80">For serious job seekers</p>
              </div>

              <ul className="space-y-4 mb-8">
                {proPlanFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                variant="accent"
                size="lg"
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