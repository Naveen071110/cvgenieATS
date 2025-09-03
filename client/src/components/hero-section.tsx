import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, Clock, Users, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { StatsWidget } from "./stats-widget";
import AIBrainIcon from "../assets/icons/ai-brain.svg?react";
import ATSShieldIcon from "../assets/icons/ats-shield.svg?react";
import SpeedOptimizationIcon from "../assets/icons/speed-optimization.svg?react";
import MailIcon from "../assets/icons/mail.svg?react";

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

// Placeholder for the spinner component
const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Placeholder for skeleton component
const SkeletonLoader = () => (
  <div className="animate-pulse bg-gray-200 rounded-lg p-4">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
  </div>
);

// Placeholder for progress indicator component
const ProgressIndicator = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
  </div>
);


export default function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [gradientShift, setGradientShift] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);



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

  // Simulate loading states and progress
  useEffect(() => {
    if (isLoading) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsLoading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      return () => clearInterval(progressInterval);
    }
  }, [isLoading]);

  const handleCreateResume = () => {
    setIsLoading(true);
    setProgress(0); // Reset progress
    // In a real app, this would trigger the resume generation process
    // For demonstration, we'll let the useEffect handle the progress
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: 'calc(var(--space-20) + var(--space-8))',
        paddingBottom: 'var(--space-20)',
        paddingLeft: 'var(--space-4)',
        paddingRight: 'var(--space-4)'
      }}
      role="banner"
      aria-labelledby="hero-title"
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
          id="hero-title"
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
          {isLoading ? (
            <div className="w-full sm:w-auto flex flex-col items-center gap-4">
              <Spinner />
              <ProgressIndicator progress={progress} />
              <span className="text-sm text-gray-500">Generating your resume...</span>
            </div>
          ) : (
            <Link to="/generator">
              <button
                className="cta-primary group relative shadow-xl hover:shadow-2xl cta-pulse"
                onClick={handleCreateResume}
                aria-label="Start your free resume generation - Go to generator page"
              >
                <FileText className="w-5 h-5 mr-2" aria-hidden="true" />
                Start Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </Link>
          )}
          <div
            className="flex items-center text-gray-600"
            style={{ gap: 'var(--space-3)' }}
          >
            <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" aria-hidden="true" />
            <span className="text-sm font-medium">Generated in 40-60 seconds</span>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <div className="feature-card bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
            <AIBrainIcon className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">AI Powered</h3>
            <p className="text-gray-600">Leverage advanced AI to craft perfect resumes and cover letters.</p>
          </div>
          <div className="feature-card bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
            <ATSShieldIcon className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">ATS Friendly</h3>
            <p className="text-gray-600">Ensure your resume passes through Applicant Tracking Systems.</p>
          </div>
          <div className="feature-card bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
            <SpeedOptimizationIcon className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Fast & Efficient</h3>
            <p className="text-gray-600">Generate professional documents in minutes, not hours.</p>
          </div>
          <div className="feature-card bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
            <MailIcon className="w-12 h-12 text-primary mb-4" aria-hidden="true" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Personalized</h3>
            <p className="text-gray-600">Tailor your application to each specific job description.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 py-12 px-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Trusted by Thousands
          </h2>
          <StatsWidget />
        </div>
      </div>
    </section>
  );
}

// Add necessary CSS for animations if not already present in global styles
// Ensure your Tailwind CSS configuration includes transitions and transforms.
// Example CSS for animations (can be placed in a global CSS file or styled-components):
/*
@keyframes float {
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.5s ease-out;
}

.btn-ripple:not(:disabled):active::after {
  opacity: 1;
  transform: translate(-50%, -50%) scale(2);
  transition: transform 0s, opacity 0.5s ease-out;
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.cta-pulse {
  animation: cta-pulse 2s infinite;
}

@keyframes cta-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}
*/