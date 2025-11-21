import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { CheckCircle, ArrowRight, Target, Zap, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LazyImage } from "@/components/LazyImage";

interface ResumeComparisonProps {
  className?: string;
}

interface ATSMetrics {
  score: number;
  keywords: number;
  sections: number;
  formatting: number;
}

interface ImprovementDetail {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: string;
}

const beforeMetrics: ATSMetrics = {
  score: 42,
  keywords: 5,
  sections: 3,
  formatting: 60
};

const afterMetrics: ATSMetrics = {
  score: 89,
  keywords: 18,
  sections: 6,
  formatting: 95
};

const improvements: ImprovementDetail[] = [
  {
    title: "+13 ATS Keywords",
    description: "Added industry-specific keywords to match job requirements",
    icon: <Target className="w-4 h-4" />,
    value: "+260%"
  },
  {
    title: "Better Formatting",
    description: "Optimized layout and structure for ATS parsing",
    icon: <Zap className="w-4 h-4" />,
    value: "+35%"
  },
  {
    title: "Achievements Quantified",
    description: "Added measurable results and impact metrics",
    icon: <TrendingUp className="w-4 h-4" />,
    value: "+3 sections"
  }
];

function AnimatedCounter({
  value,
  duration = 1000,
  suffix = ""
}: {
  value: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(startValue + (value - startValue) * easeOutQuart);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    const timer = setTimeout(updateCount, 100);
    return () => clearTimeout(timer);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

function ATSScoreBar({
  score,
  isVisible = false
}: {
  score: number;
  isVisible?: boolean;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">ATS Score</span>
        <span className={cn(
          "text-sm font-semibold",
          score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"
        )}>
          {isVisible && <AnimatedCounter value={score} suffix="%" duration={1500} />}
          {!isVisible && "0%"}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", getScoreColor(score))}
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${score}%` : '0%' }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-gray-500 text-center">
        {getScoreLabel(score)}
      </p>
    </div>
  );
}

function ImprovementTooltip({
  improvement,
  children
}: {
  improvement: ImprovementDetail;
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`Show details for ${improvement.title}`}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs"
          >
            <div className="flex items-center gap-2 mb-1">
              {improvement.icon}
              <span className="font-semibold">{improvement.title}</span>
            </div>
            <p className="text-gray-300">{improvement.description}</p>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ResumeComparison({ className }: ResumeComparisonProps) {
  const [currentView, setCurrentView] = useState<'before' | 'after'>('before');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = async () => {
    setIsTransitioning(true);

    // Small delay to show loading state
    setTimeout(() => {
      setCurrentView(currentView === 'before' ? 'after' : 'before');
      setIsTransitioning(false);
    }, 300);
  };

  const currentMetrics = currentView === 'before' ? beforeMetrics : afterMetrics;
  const isAfterView = currentView === 'after';

  return (
    <section className={cn("py-16 bg-gradient-to-br from-blue-50 to-indigo-100", className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See Your Resume Transform
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch how AI optimization dramatically improves your resume's ATS compatibility and professional impact
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Control Panel */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center bg-white rounded-lg p-1 shadow-lg">
              <Button
                variant={currentView === 'before' ? 'default' : 'ghost'}
                onClick={() => !isTransitioning && setCurrentView('before')}
                disabled={isTransitioning}
                className="px-6 py-2"
              >
                Before
              </Button>
              <Button
                variant={currentView === 'after' ? 'default' : 'ghost'}
                onClick={() => !isTransitioning && setCurrentView('after')}
                disabled={isTransitioning}
                className="px-6 py-2"
              >
                After
              </Button>
            </div>
          </div>

          {/* ATS Score Section */}
          <div className="mb-8">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <ATSScoreBar score={currentMetrics.score} isVisible={!isTransitioning} />
              </CardContent>
            </Card>
          </div>

          {/* Resume Comparison */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="h-96 overflow-hidden">
                  <CardContent className="p-6 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        {currentView === 'before' ? 'Original Resume' : 'Optimized Resume'}
                      </h3>
                      <Badge variant={currentView === 'before' ? 'destructive' : 'default'}>
                        {currentView === 'before' ? 'Needs Work' : 'ATS Ready'}
                      </Badge>
                    </div>

                    <div className="space-y-4 text-sm">
                      {currentView === 'before' ? (
                        <>
                          <div className="border-l-4 border-red-300 pl-3">
                            <p className="font-medium text-gray-700">John Smith</p>
                            <p className="text-gray-500">Software Developer</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-gray-600">• Worked on various projects</p>
                            <p className="text-gray-600">• Good team player</p>
                            <p className="text-gray-600">• Knows programming languages</p>
                          </div>
                          <div className="bg-red-50 p-3 rounded">
                            <p className="text-xs text-red-600">⚠ Missing key sections and quantified achievements</p>
                          </div>
                          {/* Placeholder for the image that will be lazy-loaded */}
                          <div className="relative w-full h-40 bg-gray-300 rounded-lg animate-pulse">
                            <span className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                              Original Resume Screenshot
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="border-l-4 border-green-500 pl-3">
                            <p className="font-medium text-gray-700">John Smith</p>
                            <p className="text-gray-500">Senior Full-Stack Software Engineer</p>
                            <p className="text-xs text-gray-500">React • Node.js • AWS • Python</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-gray-600">• Developed 15+ scalable web applications using React and Node.js, serving 100K+ users</p>
                            <p className="text-gray-600">• Led cross-functional team of 6 engineers, reducing deployment time by 40%</p>
                            <p className="text-gray-600">• Architected microservices infrastructure on AWS, improving system performance by 35%</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded">
                            <p className="text-xs text-green-600">✓ Optimized with industry keywords and quantified achievements</p>
                          </div>
                          {/* Placeholder for the image that will be lazy-loaded */}
                          <div className="relative w-full h-40 bg-gray-300 rounded-lg animate-pulse">
                            <span className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                              Optimized Resume Screenshot
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Metrics Panel */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Resume Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Keywords Match</span>
                    <span className="font-semibold">
                      <AnimatedCounter value={currentMetrics.keywords} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sections</span>
                    <span className="font-semibold">
                      <AnimatedCounter value={currentMetrics.sections} />
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Format Score</span>
                    <span className="font-semibold">
                      <AnimatedCounter value={currentMetrics.formatting} suffix="%" />
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Improvements Section - Only show in after view */}
          <AnimatePresence>
            {isAfterView && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid md:grid-cols-3 gap-4"
              >
                {improvements.map((improvement, index) => (
                  <ImprovementTooltip key={index} improvement={improvement}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                      className="cursor-pointer"
                    >
                      <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                        <CardContent className="p-4 text-center">
                          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                            {improvement.icon}
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{improvement.title}</h4>
                          <p className="text-xs text-gray-500 mb-2">{improvement.value}</p>
                          <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </ImprovementTooltip>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              onClick={handleToggle}
              disabled={isTransitioning}
              className="cta-vibrant interactive-button cta-animate group disabled:opacity-50 disabled:hover:transform-none disabled:hover:scale-100"
            >
              {isTransitioning ? (
                <>
                  <span className="loading-spinner inline-block mr-2"></span>
                  Transforming...
                </>
              ) : (
                <>
                  See {currentView === 'before' ? 'Optimized' : 'Original'} Version
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}