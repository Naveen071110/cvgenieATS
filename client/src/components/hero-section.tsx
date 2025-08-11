import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const rotatingTexts = ['Any Job', 'Tech Roles', 'Creative Positions', 'Leadership Roles', 'Remote Work'];

// Particle component
const Particle = ({ delay }: { delay: number }) => (
  <div
    className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${6 + Math.random() * 4}s`
    }}
  />
);

export default function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [gradientShift, setGradientShift] = useState(0);

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

  useEffect(() => {
    const gradientInterval = setInterval(() => {
      setGradientShift(prev => (prev + 1) % 360);
    }, 100);

    return () => clearInterval(gradientInterval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 transition-all duration-1000"
        style={{
          background: `linear-gradient(${gradientShift}deg, hsl(210, 40%, 98%) 0%, hsl(0, 0%, 100%) 50%, hsl(210, 20%, 97%) 100%)`
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }, (_, i) => (
          <Particle key={i} delay={i * 0.5} />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
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
            variant="accent"
            className="cta-button cta-pulse text-lg px-8 py-4"
          >
            Start Generating Now
          </Button>
        </Link>

      </div>
    </section>
  );
}