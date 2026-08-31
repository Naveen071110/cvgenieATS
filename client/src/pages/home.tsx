import { lazy, Suspense, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
import Icon3D from "@/components/Icon3D";
import { FileText, ClipboardPaste, Download, ChevronRight, Sparkles } from "lucide-react";
import resumeDocImg from "@assets/generated_images/icon-resume-doc-3d.webp";
import clipboardImg from "@assets/generated_images/icon-clipboard-3d.webp";
import downloadImg from "@assets/generated_images/icon-download-3d.webp";

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
const AtsCompatibilitySection = lazy(() => import("@/components/ats-compatibility-section").then(m => ({ default: m.AtsCompatibilitySection })));
const ComparisonSection = lazy(() => import("@/components/comparison-section").then(m => ({ default: m.ComparisonSection })));

function ScrollReveal({
  children,
  shouldDisableAnimations,
  delay = 0,
}: {
  children: React.ReactNode;
  shouldDisableAnimations: boolean;
  delay?: number;
}) {
  if (shouldDisableAnimations) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldDisableAnimations = isMobile || prefersReducedMotion;

  useEffect(() => {
    document.title = "AI Resume Builder — Beat ATS & Land Interviews | CVGenie ATS";
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = "Build ATS-optimized resumes and tailored cover letters in seconds with AI. Beat applicant tracking systems and land more interviews. Try CVGenie free today.";
    }
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) {
      canonical.href = "https://cvgenieats.com/";
    }
    if (!isLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);

  if (!isLoading && user) {
    return null;
  }

  const steps = [
    {
      num: "01",
      badge: "Step 1",
      img: resumeDocImg,
      icon: <FileText className="w-5 h-5" aria-hidden="true" />,
      glowColor: "rgba(59, 130, 246, 0.45)",
      title: "Upload Your Resume",
      body: "Upload your current resume in PDF, Word DOCX, or TXT format (or simply paste your text). CVGenie extracts your background, achievements, and work history without altering your authentic career story.",
    },
    {
      num: "02",
      badge: "Step 2",
      img: clipboardImg,
      icon: <ClipboardPaste className="w-5 h-5" aria-hidden="true" />,
      glowColor: "rgba(168, 85, 247, 0.45)",
      title: "Paste the Job Posting",
      body: "Paste the job description from LinkedIn, Indeed, or company portals. Our AI analyzes the role to identify mandatory keywords, technical competencies, and ATS screening triggers.",
    },
    {
      num: "03",
      badge: "Step 3",
      img: downloadImg,
      icon: <Download className="w-5 h-5" aria-hidden="true" />,
      glowColor: "rgba(20, 184, 166, 0.45)",
      title: "Download Tailored Resume",
      body: "In about 60 seconds, receive your ATS-optimized resume and personalized cover letter with high keyword alignment—formatted specifically to pass automated applicant tracking filters.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      <Header />
      <main>
        <HeroSection />

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-900/60 border-t border-b border-slate-200/80 dark:border-slate-800"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Simple 3-Step Process
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
                From Job Post to Interview-Ready in 60 Seconds
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                No complicated design tools, no manual formatting headaches. Let our two-pass AI align your resume to any job description in three effortless steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-8 relative items-stretch">
              {steps.map((step, index) => (
                <motion.div
                  key={step.num}
                  initial={shouldDisableAnimations ? undefined : { opacity: 0, y: 28 }}
                  whileInView={shouldDisableAnimations ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="group relative flex flex-col bg-white dark:bg-slate-800/90 rounded-2xl p-7 sm:p-8 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-500/25">
                        {step.num}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {step.badge}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:flex items-center text-slate-300 dark:text-slate-600">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* 3D Icon illustration */}
                  <div className="flex items-center justify-center my-4">
                    <Icon3D
                      src={step.img}
                      alt={`${step.title} 3D Illustration`}
                      size={96}
                      glowColor={step.glowColor}
                      disabled={shouldDisableAnimations}
                      floatDelay={index * 0.8}
                    />
                  </div>

                  {/* Step Description */}
                  <div className="mt-4 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ATS Compatibility Section */}
        <LazyLoadSection 
          fallback={<FeatureSectionSkeleton />}
          rootMargin="400px"
          minHeight="400px"
        >
          <div className="py-6">
            <Suspense fallback={<FeatureSectionSkeleton />}>
              <ScrollReveal shouldDisableAnimations={shouldDisableAnimations}>
                <AtsCompatibilitySection />
              </ScrollReveal>
            </Suspense>
          </div>
        </LazyLoadSection>

        {/* Features Section */}
        <LazyLoadSection 
          fallback={<FeatureSectionSkeleton />}
          rootMargin="400px"
          minHeight="400px"
        >
          <div className="py-12">
            <Suspense fallback={<FeatureSectionSkeleton />}>
              <ScrollReveal shouldDisableAnimations={shouldDisableAnimations}>
                <FeaturesSection />
              </ScrollReveal>
            </Suspense>
          </div>
        </LazyLoadSection>

        {/* Comparison Section */}
        <LazyLoadSection 
          fallback={<FeatureSectionSkeleton />}
          rootMargin="400px"
          minHeight="400px"
        >
          <div className="py-6">
            <Suspense fallback={<FeatureSectionSkeleton />}>
              <ScrollReveal shouldDisableAnimations={shouldDisableAnimations}>
                <ComparisonSection />
              </ScrollReveal>
            </Suspense>
          </div>
        </LazyLoadSection>
        
        {/* Trust Badges */}
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
              <ScrollReveal shouldDisableAnimations={shouldDisableAnimations}>
                <TrustIndicatorsSection />
              </ScrollReveal>
            </Suspense>
          </div>
        </LazyLoadSection>
        
        {/* Pricing Section */}
        <LazyLoadSection 
          fallback={<PricingSectionSkeleton />}
          rootMargin="300px"
          minHeight="500px"
        >
          <div className="py-12">
            <Suspense fallback={<PricingSectionSkeleton />}>
              <ScrollReveal shouldDisableAnimations={shouldDisableAnimations}>
                <PricingSection />
              </ScrollReveal>
            </Suspense>
          </div>
        </LazyLoadSection>
        
        {/* FAQ Section */}
        <LazyLoadSection 
          fallback={<FAQSkeleton />}
          rootMargin="300px"
          minHeight="400px"
        >
          <div className="py-12">
            <Suspense fallback={<FAQSkeleton />}>
              <ScrollReveal shouldDisableAnimations={shouldDisableAnimations}>
                <FAQSection />
              </ScrollReveal>
            </Suspense>
          </div>
        </LazyLoadSection>
      </main>
      <Footer />
    </div>
  );
}
