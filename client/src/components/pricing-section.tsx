import { Check, Star } from "lucide-react"
import { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import ATSShieldIcon from "../assets/icons/ats-shield.svg?react"
import MultiFormatExportIcon from "../assets/icons/multi-format-export.svg?react"
import AnalyticsDashboardIcon from "../assets/icons/analytics-dashboard.svg?react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useAuthDialog } from "@/hooks/useAuthDialog"
import { LoginDialog } from "@/components/LoginDialog"
import { SubscriptionModal } from "@/components/SubscriptionModal"
import { Link } from "wouter"

const freePlanFeatures = [
  {
    text: "3 Genie's Wishes per month",
    description: "Perfect for testing our magical AI technology"
  },
  {
    text: "Professional ATS optimization",
    description: "Beat applicant tracking systems"
  },
  {
    text: "Personalized cover letters",
    description: "Match each job application perfectly"
  },
  {
    text: "Multiple export formats (DOCX, TXT)",
    description: "Compatible with all job applications"
  },
  {
    text: "No signup required",
    description: "Start immediately without barriers"
  }
];

const proPlanFeatures = [
  {
    text: "Unlimited Genie's Wishes",
    description: "Apply to as many jobs as you want"
  },
  {
    text: "Priority Genie processing",
    description: "Your wishes granted faster than free users"
  },
  {
    text: "Advanced magical optimizations",
    description: "Premium spells for better results"
  },
  {
    text: "Premium export formats",
    description: "Additional styling and layout options"
  },
  {
    text: "Email support",
    description: "Direct help when you need it"
  },
  {
    text: "Resume version history",
    description: "Track and compare different versions"
  },
  {
    text: "Job-specific customization",
    description: "Tailor resumes for specific roles"
  }
];

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: Array<{ text: string; description: string }>;
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
  popular?: boolean;
  onClick?: () => void;
}

const PricingCard = ({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonLink,
  highlighted = false,
  popular = false,
  onClick
}: PricingCardProps) => {
  return (
    <Card className={`relative pricing-card border-2 ${highlighted ? 'border-primary shadow-xl' : 'border-gray-300 shadow-md'} ${popular ? 'scale-105' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-4">
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Most Popular
          </div>
        </div>
      )}

      <CardContent className="p-8 pt-12">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>

          <div className="flex items-baseline justify-center mb-2">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            {period && <span className="text-base text-gray-500 ml-2">{period}</span>}
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-2">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900">{feature.text}</span>
                {feature.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <Link to={buttonLink} className="w-full">
          <Button
            onClick={onClick}
            className={`w-full py-2.5 text-base font-semibold transition-all duration-200 ${
              highlighted
                ? 'magic-cta genie-lamp'
                : 'magic-secondary'
            }`}
            variant={highlighted ? 'default' : 'outline'}
          >
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default function PricingSection() {
  console.log("PricingSection: Component is rendering");
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const cardsAnimation = useScrollAnimation({ threshold: 0.3 });
  const { isOpen, openAuthDialog, closeAuthDialog, dialogConfig } = useAuthDialog();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { isSignedIn } = useUser();

  const handleUpgradeClick = () => {
    if (!isSignedIn) {
      openAuthDialog({
        title: "Sign in to upgrade",
        description: "Please sign in to your account to upgrade to Pro.",
      });
    } else {
      setShowSubscriptionModal(true);
    }
  };

  const handleNeedLogin = () => {
    openAuthDialog({
      title: "Sign in to upgrade",
      description: "Please sign in to your account to upgrade to Pro.",
    });
  };

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
      style={{ display: 'block', visibility: 'visible', opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 scroll-fade-in ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free, upgrade when you need unlimited access. No hidden fees, cancel anytime.
          </p>
        </div>

        <div
          ref={cardsAnimation.ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto scroll-fade-in ${cardsAnimation.isVisible ? 'visible' : ''}`}
        >
          {/* Free Plan */}
          <PricingCard
            title="Free"
            price="$0"
            period="/month"
            description="Perfect for trying CVGenie"
            features={freePlanFeatures}
            buttonText="Start Free"
            buttonLink="/generator"
            highlighted={false}
          />

          {/* Pro Plan */}
          <PricingCard
            title="Pro"
            price="$9.99"
            period="/month"
            description="For serious job seekers"
            features={proPlanFeatures}
            buttonText="Upgrade to Pro"
            buttonLink="#"
            highlighted={true}
            popular={true}
            onClick={handleUpgradeClick}
          />
        </div>

        {/* Value Proposition */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <ATSShieldIcon className="w-12 h-12 text-primary mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">ATS Optimized</h4>
              <p className="text-gray-600 text-sm">Pass through applicant tracking systems</p>
            </div>
            <div className="flex flex-col items-center">
              <MultiFormatExportIcon className="w-12 h-12 text-primary mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Multiple Formats</h4>
              <p className="text-gray-600 text-sm">Export as DOCX or TXT</p>
            </div>
            <div className="flex flex-col items-center">
              <AnalyticsDashboardIcon className="w-12 h-12 text-primary mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-gray-600 text-sm">Advanced algorithms optimize your content</p>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Questions about pricing? Check our{" "}
            <Link to="/pricing-policy" className="text-primary hover:underline font-medium">
              pricing policy
            </Link>{" "}
            or contact support.
          </p>
        </div>
      </div>

      <LoginDialog
        open={isOpen}
        onOpenChange={closeAuthDialog}
        title={dialogConfig.title}
        description={dialogConfig.description}
      />

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onNeedLogin={handleNeedLogin}
      />
    </section>
  );
}