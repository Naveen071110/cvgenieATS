import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function GeneratorCTA() {
  return (
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
              <Link to="/generator">
                <button
                  className="magic-cta group genie-lamp"
                  aria-label="Start your free resume transformation"
                >
                  Grant My Wish
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
              </Link>
              <Link to="/pricing">
                <button
                  className="magic-secondary group"
                  aria-label="View pricing plans and features"
                >
                  View Plans
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
              </Link>
            </div>

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

            <Link to="/generator">
              <button
                  className="magic-cta group genie-lamp"
                  aria-label="Start generating your optimized resume now"
                >
                  Unleash the Magic
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}