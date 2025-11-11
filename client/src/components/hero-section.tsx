import { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Zap,
  Sparkles, // Import Sparkles icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { StatsWidget } from "./stats-widget";
import AIBrainIcon from "../assets/icons/ai-brain.svg?react";
import ATSShieldIcon from "../assets/icons/ats-shield.svg?react";
import SpeedOptimizationIcon from "../assets/icons/speed-optimization.svg?react";
import MailIcon from "../assets/icons/mail.svg?react";

const rotatingTexts = [
  "Any Job",
  "Tech Roles",
  "Creative Positions",
  "Leadership Roles",
  "Remote Work",
];

// Particle component
const Particle = ({ delay }: { delay: number }) => (
  <div
    className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
    style={{
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${6 + Math.random() * 4}s`,
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
  <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg p-4">
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
  </div>
);

// Placeholder for progress indicator component
const ProgressIndicator = ({ progress }: { progress: number }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
    <div
      className="bg-primary dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    ></div>
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
      setGradientShift((prev) => (prev + 1) % 360);
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
      className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10"
      role="region"
      aria-label="Hero section with resume generation services"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="particle-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="hero-bg" aria-hidden="true">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient id="wcA" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#9ec5fe" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#9ec5fe" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="wcB" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#b1e3c1" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#b1e3c1" stopOpacity="0" />
            </radialGradient>
            <filter id="wcBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" />
            </filter>
          </defs>
          {/* Blurred watercolor washes */}
          <g className="hero-blob" style={{ transformOrigin: "18% 62%" }}>
            <circle
              cx="18"
              cy="62"
              r="28"
              fill="url(#wcA)"
              filter="url(#wcBlur)"
            />
          </g>
          <g
            className="hero-blob hero-blob--alt"
            style={{ transformOrigin: "82% 28%" }}
          >
            <circle
              cx="82"
              cy="28"
              r="24"
              fill="url(#wcB)"
              filter="url(#wcBlur)"
            />
          </g>
        </svg>
      </div>
      <div className="hero-bg-blob" aria-hidden="true"></div>
      <div
        className="hero-content"
        style={{
          paddingTop: "calc(var(--space-20) + var(--space-8))",
          paddingBottom: "var(--space-20)",
          paddingLeft: "var(--space-4)",
          paddingRight: "var(--space-4)",
        }}
        role="banner"
        aria-labelledby="hero-title"
      >
        <div
          className="max-w-7xl mx-auto relative z-10"
          style={{
            margin: "0 auto",
            paddingLeft: "var(--space-4)",
            paddingRight: "var(--space-4)",
          }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1
                id="hero-title"
                className="hero-title text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight animate-fade-in-up"
              >
                Get Noticed Faster. Land More Interviews for{" "}
                <span
                  className={`inline-block min-w-0 transition-opacity duration-300 text-primary dark:text-blue-400 ${
                    isVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {rotatingTexts[currentTextIndex]}
                </span>
              </h1>
              <p
                className="hero-subtitle text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl leading-relaxed animate-fade-in-up animation-delay-200"
                style={{ animationDelay: "0.2s" }}
              >
                Create ATS-optimized resumes and cover letters in seconds with AI.
                Get past filters, impress recruiters, and land more interviews.
              </p>
              <div
                className="flex flex-col sm:flex-row justify-center lg:justify-start items-center w-full fade-in-up"
                style={{
                  gap: "var(--space-4)",
                  marginBottom: "var(--space-8)",
                  animationDelay: "0.4s",
                }}
              >
                {isLoading ? (
                  <div className="w-full sm:w-auto flex flex-col items-center gap-4">
                    <Spinner />
                    <ProgressIndicator progress={progress} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Generating your resume...
                    </span>
                  </div>
                ) : (
                  <Link to="/generator">
                    <Button
                      size="lg"
                      className="magic-cta genie-lamp text-lg px-10 py-7 rounded-full shadow-2xl font-bold tracking-wide animate-fade-in-up animation-delay-400 hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] dark:hover:shadow-[0_0_40px_rgba(167,139,250,0.8)] transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-purple-500/50 dark:focus:ring-purple-400/50"
                      onClick={handleCreateResume}
                      aria-label="Start your free resume generation - Go to generator page"
                    >
                      <Sparkles className="mr-2 h-6 w-6" aria-hidden="true" />
                      Grant My Wish
                      <ArrowRight
                        className="ml-2 h-6 w-6"
                        aria-hidden="true"
                      />
                    </Button>
                  </Link>
                )}
                <div
                  className="flex items-center text-gray-600 dark:text-gray-300"
                  style={{ gap: "var(--space-3)" }}
                >
                  <Zap
                    className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 dark:text-yellow-400"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium">
                    Generated in 40-60 seconds
                  </span>
                </div>
              </div>
            </div>
            {/* Hero Illustration */}
            <div className="hidden lg:block lg:ml-auto">
              {/* Placeholder for your hero illustration component */}
              <div className="w-full h-full flex items-center justify-center">
                {/* Replace with your actual illustration or image */}
                <svg
                  className="w-full h-auto max-w-md"
                  viewBox="0 0 500 500"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="250"
                    cy="250"
                    r="240"
                    stroke="url(#heroGradient)"
                    strokeWidth="10"
                  />
                  <defs>
                    <linearGradient
                      id="heroGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                  {/* Add more SVG elements for a detailed illustration */}
                </svg>
              </div>
            </div>
          </div>

          {/* Feature Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="feature-card bg-white/5 dark:bg-gray-800 border border-white/10 dark:border-gray-700 backdrop-blur-sm rounded-xl p-6 text-left">
              <AIBrainIcon
                className="w-12 h-12 text-primary dark:text-blue-400 mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Smart Resume Intelligence
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Harness cutting-edge AI that understands what recruiters want and
                positions you as the perfect candidate for every role.
              </p>
            </div>
            <div className="feature-card bg-white/5 dark:bg-gray-800 border border-white/10 dark:border-gray-700 backdrop-blur-sm rounded-xl p-6 text-left">
              <ATSShieldIcon
                className="w-12 h-12 text-primary dark:text-blue-400 mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Beat Applicant Filters
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Expertly formatted to sail through automated screening—ensuring
                your resume reaches hiring managers, not rejection folders.
              </p>
            </div>
            <div className="feature-card bg-white/5 dark:bg-gray-800 border border-white/10 dark:border-gray-700 backdrop-blur-sm rounded-xl p-6 text-left">
              <SpeedOptimizationIcon
                className="w-12 h-12 text-primary dark:text-blue-400 mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Lightning-Fast Results
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start applying in minutes, not days. Create polished,
                interview-ready documents while others are still formatting.
              </p>
            </div>
            <div className="feature-card bg-white/5 dark:bg-gray-800 border border-white/10 dark:border-gray-700 backdrop-blur-sm rounded-xl p-6 text-left">
              <MailIcon
                className="w-12 h-12 text-primary dark:text-blue-400 mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Personalized Every Time
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Each application gets custom-crafted content that speaks directly
                to the employer's needs and gets you noticed.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 py-12 px-4 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              we are just getting started
            </h2>
            <StatsWidget />
          </div>
        </div>
      </div>
    </section>
  );
}