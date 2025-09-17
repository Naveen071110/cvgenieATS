import { Check, Star } from "lucide-react"
import ATSShieldIcon from "../assets/icons/ats-shield.svg?react"
import MultiFormatExportIcon from "../assets/icons/multi-format-export.svg?react"
import AnalyticsDashboardIcon from "../assets/icons/analytics-dashboard.svg?react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useAuthDialog } from "@/hooks/useAuthDialog"
import { LoginDialog } from "@/components/LoginDialog"
import { Link } from "wouter"

const freePlanFeatures = [
  {
    text: "3 AI-generated resumes per month",
    description: "Perfect for testing our AI technology"
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
    text: "Unlimited resume generations",
    description: "Apply to as many jobs as you want"
  },
  {
    text: "Priority AI processing",
    description: "Get results faster than free users"
  },
  {
    text: "Advanced AI optimizations",
    description: "Premium algorithms for better results"
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
}) => {
  return (
    <Card className={`relative pricing-card ${highlighted ? 'ring-2 ring-primary shadow-2xl' : 'shadow-lg'} ${popular ? 'scale-105' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="w-4 h-4 mr-1" />
            Most Popular
          </div>
        </div>
      )}

      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>

          <div className="flex items-baseline justify-center mb-2">
            <span className="text-5xl font-bold text-gray-900">{price}</span>
            {period && <span className="text-lg text-gray-500 ml-2">{period}</span>}
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-0.5 mr-3">
                <Check className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <span className="font-medium text-gray-900">{feature.text}</span>
                {feature.description && (
                  <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <Link to={buttonLink} className="w-full">
          <Button
            onClick={onClick}
            className={`w-full py-3 text-lg font-semibold transition-all duration-200 ${
              highlighted
                ? 'bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg hover:shadow-xl'
                : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
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

  const handleUpgradeClick = () => {
    console.log("Upgrade button clicked");
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
            buttonLink="/generator"
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
    </section>
  );
}