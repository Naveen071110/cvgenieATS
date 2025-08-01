import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const rotatingTexts = ['Any Job', 'Tech Roles', 'Creative Positions', 'Leadership Roles', 'Remote Work'];

export default function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);



  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
          Transform Your Resume for{" "}
          <span 
            className={`text-primary inline-block min-w-0 transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {rotatingTexts[currentTextIndex]}
          </span>
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          Generate ATS-optimized resumes and personalized cover letters in seconds using AI. 
          Upload your current resume, paste a job description, and let our AI do the magic.
        </p>
        <Link to="/generator">
          <Button 
            size="lg"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            Generate My Resume
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
