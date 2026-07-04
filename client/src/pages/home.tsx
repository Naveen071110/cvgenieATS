import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
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

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-stretch" style={{ perspective: 800 }}>
              {steps.map((step, index) => (
                <div key={step.num} className="contents">
                  <motion.div
                    className="relative flex flex-col items-start p-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:border-primary/40 dark:hover:border-blue-400/40 hover:shadow-lg transition-colors duration-200"
                    initial={shouldDisableAnimations ? { opacity: 1, rotateX: 0, y: 0 } : { opacity: 0, rotateX: 15, y: 40 }}
                    whileInView={shouldDisableAnimations ? undefined : { opacity: 1, rotateX: 0, y: 0 }}
                    whileHover={shouldDisableAnimations ? undefined : { y: -4, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
                    viewport={{ once: true, margin: "-80px" }}
                  >
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
                  </motion.div>
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
