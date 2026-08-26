import { Check, Star } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import ATSShieldIcon from "../assets/icons/ats-shield.svg?react"
import MultiFormatExportIcon from "../assets/icons/multi-format-export.svg?react"
import AnalyticsDashboardIcon from "../assets/icons/analytics-dashboard.svg?react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useAuthDialog } from "@/hooks/useAuthDialog"
import { LoginDialog } from "@/components/LoginDialog"
import { SubscriptionModal } from "@/components/SubscriptionModal"
import { Link, useLocation } from "wouter"

const freePlanFeatures = [
  {
    text: "3 AI Resume Generations / Month",
    description: "Full access to our core two-pass ATS optimization engine"
  },
  {
    text: "Tailored AI Cover Letters",
    description: "Generated alongside each resume to match the job post"
  },
  {
    text: "Interactive ATS Score Analysis",
    description: "Instant feedback on keyword density and section structure"
  },
  {
    text: "Multiple Export Formats",
    description: "Export to PDF (with watermark), Word DOCX, & TXT"
  },
  {
    text: "Secure Email Sign-In",
    description: "Get started in seconds with passwordless Clerk email verification"
  }
];

const proPlanFeatures = [
  {
    text: "Unlimited AI Resume Generations",
    description: "Apply to as many jobs as you need without monthly limits"
  },
  {
    text: "100% Watermark-Free Downloads",
    description: "Clean, professional PDF & DOCX files ready for submission"
  },
  {
    text: "Priority Instant AI Processing",
    description: "Zero wait times with instant high-speed generation"
  },
  {
    text: "Resume Version History & Cloud Storage",
    description: "Save, manage, and re-download all past generated resumes"
  },
  {
    text: "AI Interview Preparation Copilot",
    description: "Targeted behavioral, technical, and role-specific mock questions"
  },
  {
    text: "Unlimited Matched Cover Letters",
    description: "Personalized cover letters matching each tailored resume"
  },
  {
    text: "Priority Email Support",
    description: "Direct assistance whenever you need help"
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
    <Card className={`relative pricing-card border-2 ${highlighted ? 'border-primary dark:border-blue-500 shadow-xl' : 'border-gray-300 dark:border-gray-700 shadow-md'} ${popular ? 'scale-105' : ''} bg-white dark:bg-gray-800`}>
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>

          <div className="flex items-baseline justify-center mb-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{price}</span>
            {period && <span className="text-base text-gray-500 dark:text-gray-400 ml-2">{period}</span>}
          </div>
        </div>

        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-2">
                <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{feature.text}</span>
                {feature.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{feature.description}</p>
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
  const headerAnimation = useScrollAnimation({ threshold: 0.2 });
  const cardsAnimation = useScrollAnimation({ threshold: 0.3 });
  const { isOpen, openAuthDialog, closeAuthDialog, dialogConfig } = useAuthDialog();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { isSignedIn } = useAuth();
  const [, setLocation] = useLocation();

  const handleFreeClick = () => {
    if (!isSignedIn) {
      localStorage.setItem("auth_redirect", "/generator");
      openAuthDialog({
        title: "Sign in to continue",
        description: "Please sign in to access the resume generator.",
      });
    } else {
      setLocation("/generator");
    }
  };

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
      className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      style={{ display: 'block', visibility: 'visible', opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerAnimation.ref}
          className={`text-center mb-16 scroll-fade-in ${headerAnimation.isVisible ? 'visible' : ''}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start free, upgrade when you need unlimited access. No hidden fees, cancel anytime.
          </p>
        </div>

        <div
          ref={cardsAnimation.ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {/* Free Plan */}
          <div className={`scroll-fade-in scroll-fade-in-delay-1 ${cardsAnimation.isVisible ? 'visible' : ''}`}>
            <PricingCard
              title="Free"
              price="$0"
              period="/month"
              description="Perfect for trying CVGenie"
              features={freePlanFeatures}
              buttonText="Start Free"
              buttonLink="#"
              highlighted={false}
              onClick={handleFreeClick}
            />
          </div>

          {/* Pro Plan */}
          <div className={`scroll-fade-in scroll-fade-in-delay-2 ${cardsAnimation.isVisible ? 'visible' : ''}`}>
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
        </div>

        {/* Value Proposition */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <ATSShieldIcon className="w-12 h-12 text-primary dark:text-blue-400 mb-4" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">ATS Optimized</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Pass through applicant tracking systems</p>
            </div>
            <div className="flex flex-col items-center">
              <MultiFormatExportIcon className="w-12 h-12 text-primary dark:text-blue-400 mb-4" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Multiple Formats</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Export as DOCX or TXT</p>
            </div>
            <div className="flex flex-col items-center">
              <AnalyticsDashboardIcon className="w-12 h-12 text-primary dark:text-blue-400 mb-4" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Advanced algorithms optimize your content</p>
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300">
            Questions about pricing? Check our{" "}
            <Link to="/pricing-policy" className="text-primary dark:text-blue-400 hover:underline font-medium">
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