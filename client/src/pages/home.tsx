import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import TestimonialsSection from "@/components/testimonials-section";
import PricingSection from "@/components/pricing-section";
import { FAQSection } from "@/components/faq-section";
import Footer from "@/components/footer";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { TrustIndicatorsSection } from "@/components/trust-indicators-section";
import { ResumeComparison } from "@/components/resume-comparison";
import { InteractiveDemo } from "@/components/interactive-demo"; // Added import for InteractiveDemo

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />

        {/* Video Demo Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                See CVGenie in Action
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Watch how our AI transforms a basic resume into an interview-generating powerhouse in under 60 seconds
              </p>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8">
              <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                {/* Placeholder for video - replace with actual video when available */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue-500/10"></div>
                <div className="relative z-10 text-center p-8">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">Demo Video Coming Soon</p>
                  <p className="text-sm text-slate-500 mt-2">See before/after resume transformation</p>
                </div>
                {/* Uncomment when video is ready:
                <video 
                  src="/videos/resume-demo.mp4" 
                  controls 
                  className="w-full h-full object-cover"
                  style={{ borderRadius: "8px" }}
                  poster="/images/video-thumbnail.jpg"
                >
                  Your browser does not support the video tag.
                </video>
                */}
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                  <div className="text-2xl font-bold text-primary mb-1">40-60s</div>
                  <p className="text-sm text-slate-600">Generation Time</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">3x More</div>
                  <p className="text-sm text-slate-600">Interview Callbacks</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-slate-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">95%+</div>
                  <p className="text-sm text-slate-600">ATS Pass Rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Generator CTA Section */}
        <section id="generator" className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-blue-50">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="shadow-2xl border border-slate-200 floating-card bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Ready to Land More Interviews?
                </h2>
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  Join thousands of professionals who transformed their job search with resumes that actually get read. 
                  Start getting noticed by recruiters today—completely free!
                </p>
                

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Free resume builder - 3 generations/month</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">No signup required</span>
                  </div>
                  <div className="flex items-center text-purple-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">ATS-friendly resume templates</span>
                  </div>
                </div>


              </CardContent>
            </Card>
          </div>
        </section>

        <div className="py-16">
          <FeaturesSection />
        </div>
        <div className="py-16">
          <InteractiveDemo />
        </div>
        <div className="py-16">
          <TrustIndicatorsSection />
        </div>
        <div className="py-16">
          <TestimonialsSection />
        </div>
        <div className="py-16">
          <PricingSection />
        </div>
        <div className="py-16">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}