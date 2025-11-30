import { useRef } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import AIBrainIcon from '../assets/icons/ai-brain.svg?react';
import ATSShieldIcon from '../assets/icons/ats-shield.svg?react';
import SpeedOptimizationIcon from '../assets/icons/speed-optimization.svg?react';
import { useIsMobile, useReducedMotion } from "@/hooks/useIntersectionLoader";

interface FeatureCheckProps {
  text: string;
}

const FeatureCheck = ({ text }: FeatureCheckProps) => {
  return (
    <li className="flex items-start gap-3 group">
      <div className="relative flex-shrink-0 mt-1">
        <CheckCircle2
          className="w-5 h-5 text-primary dark:text-blue-400"
          strokeWidth={2.5}
        />
      </div>
      <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {text}
      </span>
    </li>
  );
};

interface FeatureSectionProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  reverse?: boolean;
}

const FeatureSection = ({
  title,
  subtitle,
  description,
  features,
  icon,
  reverse = false,
}: FeatureSectionProps) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = isMobile || prefersReducedMotion;

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`space-y-5 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl">
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-primary dark:text-blue-400 uppercase tracking-wide mb-1">
                  {subtitle}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
              </div>
            </div>

            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>

            <ul className="space-y-3 mt-6">
              {features.map((feature, index) => (
                <FeatureCheck key={index} text={feature} />
              ))}
            </ul>
          </div>

          <div className={`relative ${reverse ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="relative group">
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent dark:from-blue-400/5 dark:via-purple-400/5 pointer-events-none" />
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                  <Sparkles className="w-14 h-14 text-gray-300 dark:text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function FeaturesSection() {
  const features = [
    {
      title: "Intelligent Resume Transformation",
      subtitle: "AI-Powered Excellence",
      description: "Our advanced AI analyzes job descriptions and tailors your resume to match exactly what recruiters are looking for, highlighting your most relevant skills and achievements.",
      features: [
        "Smart keyword optimization for ATS compatibility",
        "Dynamic content restructuring based on job requirements",
        "Achievement quantification and impact highlighting",
        "Industry-specific language and terminology adaptation",
      ],
      icon: <AIBrainIcon className="w-7 h-7 text-primary dark:text-blue-400" />,
    },
    {
      title: "ATS-Optimized Formatting",
      subtitle: "Pass Every Screen",
      description: "Get past applicant tracking systems with professionally formatted resumes that maintain readability for both AI scanners and human recruiters.",
      features: [
        "Clean, parser-friendly document structure",
        "Optimal section organization and hierarchy",
        "Compatible with all major ATS platforms",
        "Professional templates that impress humans too",
      ],
      icon: <ATSShieldIcon className="w-7 h-7 text-primary dark:text-blue-400" />,
    },
    {
      title: "Lightning-Fast Generation",
      subtitle: "Speed Meets Quality",
      description: "Generate professional resumes and cover letters in seconds, not hours. Our optimized AI engine delivers quality results faster than traditional methods.",
      features: [
        "Complete resume in 40-60 seconds",
        "Instant preview and editing capabilities",
        "Quick iterations for multiple job applications",
        "Export-ready documents with one click",
      ],
      icon: <SpeedOptimizationIcon className="w-7 h-7 text-primary dark:text-blue-400" />,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/30 dark:to-gray-900">
      {features.map((feature, index) => (
        <FeatureSection
          key={index}
          {...feature}
          reverse={index % 2 === 1}
        />
      ))}
    </div>
  );
}
