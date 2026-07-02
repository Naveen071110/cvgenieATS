import { CheckCircle2, FileText, Zap, Sparkles } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import AIBrainIcon from '../assets/icons/ai-brain.svg?react';
import ATSShieldIcon from '../assets/icons/ats-shield.svg?react';
import SpeedOptimizationIcon from '../assets/icons/speed-optimization.svg?react';

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

// Mockup 1 — Keyword matching: Job description (left) → Resume bullet (right)
const KeywordMatchMockup = () => (
  <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-gray-800 dark:to-gray-900 p-4 sm:p-5 flex items-center">
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-3 w-full">
      {/* Left card — Job Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 flex flex-col">
        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
          <FileText className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">Job Description</span>
        </div>
        <p className="text-[11px] sm:text-[12px] leading-relaxed text-gray-700 dark:text-gray-300">
          PM to lead{' '}
          <mark className="bg-yellow-200 dark:bg-yellow-700/50 text-yellow-900 dark:text-yellow-100 px-1 rounded font-medium">cross-functional teams</mark>
          , build{' '}
          <mark className="bg-yellow-200 dark:bg-yellow-700/50 text-yellow-900 dark:text-yellow-100 px-1 rounded font-medium">API integrations</mark>
          {' '}and drive{' '}
          <mark className="bg-yellow-200 dark:bg-yellow-700/50 text-yellow-900 dark:text-yellow-100 px-1 rounded font-medium">revenue growth</mark>.
        </p>
      </div>

      {/* Center label — CVGenie matches these → */}
      <div className="flex flex-col items-center justify-center px-1">
        <div className="flex flex-col items-center gap-1.5 px-2 py-2 bg-primary/10 dark:bg-blue-900/40 rounded-lg">
          <Sparkles className="w-3 h-3 text-primary dark:text-blue-300" />
          <span className="text-[9px] sm:text-[10px] font-semibold text-primary dark:text-blue-300 text-center leading-tight">
            CVGenie matches these
          </span>
          <span className="text-base font-bold text-primary dark:text-blue-300 leading-none -mt-0.5">→</span>
        </div>
      </div>

      {/* Right card — Tailored bullet */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 flex flex-col">
        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
          <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
          <span className="truncate">Your Tailored Bullet</span>
        </div>
        <p className="text-[11px] sm:text-[12px] leading-relaxed text-gray-700 dark:text-gray-300">
          Led{' '}
          <strong className="text-blue-700 dark:text-blue-300 font-semibold">cross-functional teams</strong>
          {' '}of 12 to ship 3{' '}
          <strong className="text-blue-700 dark:text-blue-300 font-semibold">API integrations</strong>
          , driving $2.4M in{' '}
          <strong className="text-blue-700 dark:text-blue-300 font-semibold">revenue growth</strong>.
        </p>
      </div>
    </div>
  </div>
);

// Mockup 2 — ATS Compatibility checklist
const ATSChecklistMockup = () => {
  const items = [
    'Single-column layout',
    'Standard section headers',
    'No tables or graphics',
    'Readable font (11pt+)',
    'PDF / DOCX format',
  ];
  return (
    <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-green-50/30 dark:from-gray-800 dark:to-gray-900 p-5 flex items-center justify-center">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-100 dark:border-gray-700">
          <div className="text-[12px] font-bold text-gray-900 dark:text-white">
            ATS Compatibility Check
          </div>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
            5/5
          </div>
        </div>
        <ul className="space-y-2 mb-3">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/40 flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" strokeWidth={3} />
              </div>
              <span className="text-[12px] text-gray-700 dark:text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-center gap-2 mt-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" strokeWidth={2.5} />
          <span className="text-[12px] font-semibold text-green-800 dark:text-green-200">
            Ready to Submit
          </span>
        </div>
      </div>
    </div>
  );
};

// Mockup 3 — Speed before/after
const SpeedComparisonMockup = () => (
  <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-teal-50/30 dark:from-gray-800 dark:to-gray-900 p-5 flex flex-col justify-center gap-4">
    {/* Before */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3.5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700">
            <FileText className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Manual editing
          </span>
        </div>
        <span className="text-[12px] font-bold text-gray-700 dark:text-gray-300">
          2–3 hours
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full w-[88%] bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 rounded-full" />
      </div>
    </div>

    {/* After */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 border-primary/30 dark:border-blue-400/40 p-3.5 relative">
      <div className="absolute -top-2 right-3 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
        180× faster
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/15 dark:bg-blue-900/40">
            <Zap className="w-3.5 h-3.5 text-primary dark:text-blue-300" strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-primary dark:text-blue-300">
            CVGenie
          </span>
        </div>
        <span className="text-[12px] font-bold text-gray-900 dark:text-white">
          ~60 seconds
        </span>
      </div>
      <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full w-[6%] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      </div>
    </div>
  </div>
);

interface FeatureSectionProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  mockup: React.ReactNode;
  reverse?: boolean;
}

const FeatureSection = ({
  title,
  subtitle,
  description,
  features,
  icon,
  mockup,
  reverse = false,
}: FeatureSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div ref={ref} className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          <div
            className={`space-y-5 ${reverse ? 'lg:order-2' : 'lg:order-1'} ${reverse ? 'slide-in-right' : 'slide-in-left'} ${isVisible ? 'visible' : ''}`}
          >
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

          <div
            className={`relative ${reverse ? 'lg:order-1' : 'lg:order-2'} ${reverse ? 'slide-in-left' : 'slide-in-right'} ${isVisible ? 'visible' : ''}`}
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {mockup}
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
      mockup: <KeywordMatchMockup />,
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
      mockup: <ATSChecklistMockup />,
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
      mockup: <SpeedComparisonMockup />,
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
