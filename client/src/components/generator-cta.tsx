import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function GeneratorCTA() {
  return (
    <section className="py-20 relative overflow-hidden" style={{ background: 'var(--genie-gradient)' }}>
      <div className="container mx-auto px-4 text-center relative">
        {/* Magic smoke effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-20 h-20 rounded-full opacity-20" style={{ background: 'var(--magic-smoke)', animation: 'smoke-rise 4s ease-out infinite' }}></div>
          <div className="absolute bottom-0 right-1/3 w-16 h-16 rounded-full opacity-30" style={{ background: 'var(--magic-smoke)', animation: 'smoke-rise 5s ease-out infinite', animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-3xl mx-auto space-y-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8" style={{ color: 'var(--magic-sparkle)' }}>
            Join thousands of professionals who've already upgraded their resumes with CV Genie
          </p>
          <Button
            size="lg"
            className="bg-white hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cta-pulse"
            style={{ color: 'var(--magic-purple)' }}
            onClick={() => navigate('/generator')}
          >
            Start Your Resume Transformation
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}