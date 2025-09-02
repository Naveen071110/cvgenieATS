import { useState, useEffect } from "react";
import { ArrowRight, Zap, Target, FileText, Package } from "lucide-react";
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
    <section 
      className="relative overflow-hidden"
      style={{ 
        paddingTop: 'calc(var(--space-20) + var(--space-8))', 
        paddingBottom: 'var(--space-20)',
        paddingLeft: 'var(--space-4)',
        paddingRight: 'var(--space-4)'
      }}
    >
      {/* Animated Background */}
      <div
        className="absolute inset-0 transition-all duration-1000 bg-gradient-to-br from-blue-50 via-white to-gray-50"
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 15 }, (_, i) => (
          <Particle key={i} delay={i * 0.5} />
        ))}
      </div>

      <div 
        className="relative w-full text-center"
        style={{ 
          maxWidth: 'var(--container-2xl)',
          margin: '0 auto',
          paddingLeft: 'var(--space-4)',
          paddingRight: 'var(--space-4)'
        }}
      >
        <h1 
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
          style={{ marginBottom: 'var(--space-6)' }}
        >
          Transform Your Career with{" "}
          <span
            className={`inline-block min-w-0 transition-opacity duration-300 text-primary ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {rotatingTexts[currentTextIndex]}
          </span>
        </h1>
        <p 
          className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-gray-600"
          style={{ marginBottom: 'var(--space-8)' }}
        >
          Generate ATS-optimized resumes and personalized cover letters in seconds using AI.
          Upload your current resume, paste a job description, and let our AI do the magic.
        </p>
        <div 
          className="flex flex-col sm:flex-row justify-center items-center w-full"
          style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}
        >
          <Link to="/generator" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="btn-primary cta-button text-base sm:text-lg cta-pulse w-full"
              style={{ 
                padding: 'var(--space-3) var(--space-6)',
                fontSize: 'var(--font-size-lg)'
              }}
            >
              Create Resume Now
              <FileText 
                className="h-4 sm:h-5 w-4 sm:w-5" 
                style={{ marginLeft: 'var(--space-2)' }}
              />
            </Button>
          </Link>
          <div 
            className="flex items-center text-gray-600"
            style={{ gap: 'var(--space-3)' }}
          >
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            <span className="text-sm font-medium">Generated in 10-15 seconds</span>
          </div>
        </div>

      </div>
    </section>
  );
}