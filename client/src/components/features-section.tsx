import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import AIBrainIcon from '../assets/icons/ai-brain.svg?react';
import ATSShieldIcon from '../assets/icons/ats-shield.svg?react';
import SpeedOptimizationIcon from '../assets/icons/speed-optimization.svg?react';

interface FeatureCheckProps {
  text: string;
  index: number;
}

const FeatureCheck = ({ text, index }: FeatureCheckProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.li
      className="flex items-start gap-3 group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <motion.div
        className="relative flex-shrink-0 mt-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <CheckCircle2
          className="w-6 h-6 text-primary dark:text-blue-400 transition-all duration-300"
          strokeWidth={2.5}
          fill={isHovered ? "currentColor" : "none"}
        />
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-primary/20 dark:bg-blue-400/20 rounded-full blur-md"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          />
        )}
      </motion.div>
      <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {text}
      </span>
    </motion.li>
  );
};

interface FeatureSectionProps {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  reverse?: boolean;
}

const FeatureSection = ({
  title,
  subtitle,
  description,
  features,
  icon,
  imageSrc,
  imageAlt = "Feature preview",
  reverse = false,
}: FeatureSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      className="py-16 md:py-24 lg:py-32"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${reverse ? 'lg:flex-row-reverse' : ''}`}>
          {/* Content Side */}
          <motion.div
            className={`space-y-6 ${reverse ? 'lg:order-2' : 'lg:order-1'}`}
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reverse ? 50 : -50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Icon & Title */}
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {icon}
              </motion.div>
              <div>
                <p className="text-sm font-semibold text-primary dark:text-blue-400 uppercase tracking-wide mb-1">
                  {subtitle}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {description}
            </p>

            {/* Feature List */}
            <ul className="space-y-4 mt-8">
              {features.map((feature, index) => (
                <FeatureCheck key={index} text={feature} index={index} />
              ))}
            </ul>
          </motion.div>

          {/* Image/Mockup Side */}
          <motion.div
            className={`relative ${reverse ? 'lg:order-1' : 'lg:order-2'}`}
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: reverse ? -50 : 50 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-pink-400/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Image Container */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transform transition-transform duration-300 group-hover:scale-[1.02]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent dark:from-blue-400/5 dark:via-purple-400/5 pointer-events-none" />

                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
              </div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-2xl opacity-30 dark:opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full blur-2xl opacity-30 dark:opacity-20"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.4, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
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
      icon: <AIBrainIcon className="w-8 h-8 text-primary dark:text-blue-400" />,
      imageSrc: undefined, // Add your resume preview image path here
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
      icon: <ATSShieldIcon className="w-8 h-8 text-primary dark:text-blue-400" />,
      imageSrc: undefined,
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
      icon: <SpeedOptimizationIcon className="w-8 h-8 text-primary dark:text-blue-400" />,
      imageSrc: undefined,
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