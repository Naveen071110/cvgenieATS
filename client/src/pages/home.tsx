import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
import { FileText, ClipboardPaste, Download, ChevronRight } from "lucide-react";
import {
  FeatureSectionSkeleton,
  PricingSectionSkeleton,
  FAQSkeleton,
  TrustBadgesSkeleton,
} from "@/components/ui/section-skeletons";
import { LazyLoadSection, useIsMobile, useReducedMotion } from "@/hooks/useIntersectionLoader";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

const FeaturesSection = lazy(() => import("@/components/features-section"));
const PricingSection = lazy(() => import("@/components/pricing-section"));
const FAQSection = lazy(() => import("@/components/faq-section").then(m => ({ default: m.FAQSection })));
const TrustIndicatorsSection = lazy(() => import("@/components/trust-indicators-section").then(m => ({ default: m.TrustIndicatorsSection })));

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldDisableAnimations = isMobile || prefersReducedMotion;
  const [activeStep, setActiveStep] = useState(0);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: howItWorksProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start start", "end end"],
  });
  const step1Height = useTransform(howItWorksProgress, [0, 0.33], ["0%", "100%"]);
  const step2Height = useTransform(howItWorksProgress, [0.33, 0.66], ["0%", "100%"]);

  useEffect(() => {
    if (shouldDisableAnimations) return;
    const unsubscribe = howItWorksProgress.on("change", (latest) => {
      if (latest < 0.33) setActiveStep(0);
      else if (latest < 0.66) setActiveStep(1);
      else setActiveStep(2);
    });
    return () => unsubscribe();
  }, [howItWorksProgress, shouldDisableAnimations]);

  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);

  if (!isLoading && user) {
    return null;
  }

  const steps = [
    {
      num: 1,
      icon: <FileText className="w-6 h-6" aria-hidden="true" />,
      title: "Upload your resume",
      body: "Paste your existing resume text or upload a DOCX/TXT file. CVGenie reads your background exactly as-is — no rewriting your story.",
    },
    {
      num: 2,
      icon: <ClipboardPaste className="w-6 h-6" aria-hidden="true" />,
      title: "Paste the job description",
      body: "Drop in any job posting. CVGenie extracts the keywords, required skills, and tone the recruiter is looking for.",
    },
    {
      num: 3,
      icon: <Download className="w-6 h-6" aria-hidden="true" />,
      title: "Download your tailored resume",
      body: "In about 60 seconds you get an ATS-optimized resume and matching cover letter, ready to submit.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      <Header />
      <main>
        <HeroSection />

        {shouldDisableAnimations ? (
          <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-14">
                <p className="text-sm font-semibold text-primary dark:text-blue-400 uppercase tracking-wide mb-3">
                  How it works
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Three simple steps
                </h2>
                <p className="text-lg text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
                  From your existing resume to a tailored, ATS-ready document in about a minute.
                </p>
              </div>

              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-stretch">
                {steps.map((step, index) => (
                  <div key={step.num} className="contents">
                    <div className="relative flex flex-col items-start p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-base shadow-sm">
                          {step.num}
                        </div>
                        <div className="text-primary dark:text-blue-400">
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                        {step.body}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-10"
                        style={{ left: `calc(${(index + 1) * 33.333}% - 16px)` }}>
                        <div className="flex items-center gap-1 text-slate-300 dark:text-slate-600">
                          <div className="w-8 border-t-2 border-dashed border-slate-300 dark:border-slate-600" />
                          <ChevronRight className="w-4 h-4 flex-shrink-0" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section id="how-it-works" ref={howItWorksRef} className="relative h-[300vh] bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-800">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center w-full">
                <div className="space-y-10">
                  <div>
                    <p className="text-sm font-semibold text-primary dark:text-blue-400 uppercase tracking-wide mb-3">
                      How it works
                    </p>
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white tracking-tighter leading-[1.02]">
                      From job post to interview
                    </h2>
                  </div>

                  <div className="relative space-y-10">
                    {steps.map((step, index) => (
                      <div key={step.num} className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={false}
                            animate={{
                              scale: activeStep === index ? 1.15 : 1,
                              backgroundColor: activeStep === index ? "#3b82f6" : "rgb(226, 232, 240)",
                            }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shadow-sm relative z-10 flex-shrink-0"
                          >
                            {step.num}
                          </motion.div>
                          {index < steps.length - 1 && (
                            <div className="w-0.5 flex-1 min-h-[40px] bg-slate-200 dark:bg-slate-700 mt-2 mb-2 rounded-full overflow-hidden">
                              <motion.div
                                style={{ height: index === 0 ? step1Height : step2Height }}
                                className="bg-primary dark:bg-blue-400 w-full"
                              />
                            </div>
                          )}
                        </div>
                        <motion.div
                          animate={{ opacity: activeStep === index ? 1 : 0.5, x: activeStep === index ? 6 : 0 }}
                          className="space-y-2 pb-2"
                        >
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {step.title}
                          </h3>
                          <p className="text-base text-slate-600 dark:text-gray-400 leading-relaxed max-w-md">
                            {step.body}
                          </p>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative aspect-square max-w-md mx-auto hidden lg:block" style={{ perspective: 1200 }}>
                  <motion.div
                    aria-hidden
                    animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-10 rounded-full bg-primary/30 dark:bg-blue-500/20 blur-3xl"
                  />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, scale: 0.8, rotateY: 55, rotateX: -8 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
                      exit={{ opacity: 0, scale: 0.85, rotateY: -55, rotateX: 8 }}
                      transition={{ type: "spring", damping: 18, stiffness: 90 }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="relative w-full h-full rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 p-10 flex flex-col justify-center items-center gap-8 bg-slate-50/60 dark:bg-slate-800/60 backdrop-blur-sm"
                    >
                      <motion.div
                        animate={{ y: [0, -12, 0], rotate: [0, 3, 0, -3, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-28 h-28 rounded-3xl flex items-center justify-center text-white bg-primary shadow-xl"
                      >
                        {steps[activeStep].icon}
                      </motion.div>
                      <div className="text-center space-y-2">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                          Step 0{activeStep + 1}
                        </div>
                        <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                          {steps[activeStep].title}
                        </h4>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        )}

        <LazyLoadSection 
          fallback={<FeatureSectionSkeleton />}
          rootMargin="400px"
          minHeight="400px"
        >
          <div className="py-12">
            <Suspense fallback={<FeatureSectionSkeleton />}>
              <FeaturesSection />
            </Suspense>
          </div>
        </LazyLoadSection>
        
        
        <LazyLoadSection 
          fallback={
            <div className="py-16 bg-gray-50 dark:bg-slate-900">
              <div className="max-w-7xl mx-auto px-4">
                <TrustBadgesSkeleton />
              </div>
            </div>
          }
          rootMargin="300px"
          minHeight="200px"
        >
          <div className="py-12">
            <Suspense fallback={
              <div className="py-16 bg-gray-50 dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-4">
                  <TrustBadgesSkeleton />
                </div>
              </div>
            }>
              <TrustIndicatorsSection />
            </Suspense>
          </div>
        </LazyLoadSection>
        
        <LazyLoadSection 
          fallback={<PricingSectionSkeleton />}
          rootMargin="300px"
          minHeight="500px"
        >
          <div className="py-12">
            <Suspense fallback={<PricingSectionSkeleton />}>
              <PricingSection />
            </Suspense>
          </div>
        </LazyLoadSection>
        
        <LazyLoadSection 
          fallback={<FAQSkeleton />}
          rootMargin="300px"
          minHeight="400px"
        >
          <div className="py-12">
            <Suspense fallback={<FAQSkeleton />}>
              <FAQSection />
            </Suspense>
          </div>
        </LazyLoadSection>
      </main>
      <Footer />
    </div>
  );
}
