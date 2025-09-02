import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import TestimonialsSection from "@/components/testimonials-section";
import PricingSection from "@/components/pricing-section";
import FAQSection from "@/components/faq-section";
import Footer from "@/components/footer";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { TrustIndicatorsSection } from "@/components/trust-indicators-section";
import { ResumeComparison } from "@/components/resume-comparison";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />

        {/* Generator CTA Section */}
        <section id="generator" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="shadow-2xl border border-slate-200 floating-card bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                  Ready to Transform Your Resume?
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                  Upload your current resume and paste any job description. Our AI will create an ATS-optimized resume and personalized cover letter in seconds.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">3 free generations per month</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">No signup required</span>
                  </div>
                  <div className="flex items-center text-purple-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">ATS-optimized results</span>
                  </div>
                </div>


              </CardContent>
            </Card>
          </div>
        </section>

        <FeaturesSection />
        <ResumeComparison />
        <TrustIndicatorsSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}