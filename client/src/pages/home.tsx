import { lazy, Suspense, memo } from "react";
import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FeatureSectionSkeleton,
  PricingSectionSkeleton,
  FAQSkeleton,
  TrustBadgesSkeleton,
} from "@/components/ui/section-skeletons";
import { LazyLoadSection } from "@/hooks/useIntersectionLoader";

const FeaturesSection = lazy(() => import("@/components/features-section"));
const PricingSection = lazy(() => import("@/components/pricing-section"));
const FAQSection = lazy(() => import("@/components/faq-section").then(m => ({ default: m.FAQSection })));
const TrustIndicatorsSection = lazy(() => import("@/components/trust-indicators-section").then(m => ({ default: m.TrustIndicatorsSection })));

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      <Header />
      <main>
        <HeroSection />

        <section id="generator" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-blue-50 dark:from-slate-900 dark:to-slate-800">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="shadow-2xl border border-slate-200 dark:border-gray-700 floating-card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Ready to Land More Interviews?
                </h2>
                <p className="text-lg text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join thousands of professionals who transformed their job search with resumes that actually get read.
                  Start getting noticed by recruiters today—completely free!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Free resume builder - 3 generations/month</span>
                  </div>
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">No signup required</span>
                  </div>
                  <div className="flex items-center text-purple-600 dark:text-purple-400">
                    <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">ATS-friendly resume templates</span>
                  </div>
                </div>
              </CardContent>
            </Card>
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
