import { useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Zap,
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
    <div className="hero-section bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Decorative watercolor SVG layer below content */}
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
          className="relative w-full text-center"
          style={{
            maxWidth: "var(--container-2xl)",
            margin: "0 auto",
            paddingLeft: "var(--space-4)",
            paddingRight: "var(--space-4)",
          }}
        >
          <h1
            id="hero-title"
            className="display-lg text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white fade-in-up"
            style={{ marginBottom: "var(--space-6)" }}
          >
            Get Noticed Faster. Land More Interviews for{" "}
            <span
              className={`inline-block min-w-0 transition-opacity duration-300 text-blue-400 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {rotatingTexts[currentTextIndex]}
            </span>
          </h1>
          <p
            className="lead text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-gray-300 fade-in-up"
            style={{ marginBottom: "var(--space-8)", animationDelay: "0.2s" }}
          >
            Transform your resume into interview invitations. Our intelligent AI crafts 
            personalized resumes that bypass automated screening systems and reach real recruiters—in seconds.
          </p>
          <div
            className="flex flex-col sm:flex-row justify-center items-center w-full fade-in-up"
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
                <button
                  className="magic-cta group relative inline-flex items-center"
                  onClick={handleCreateResume}
                  aria-label="Start your free resume generation - Go to generator page"
                >
                  <FileText className="w-5 h-5 mr-2" aria-hidden="true" />
                  Grant My Wish
                  <ArrowRight
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </button>
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

          {/* Feature Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="feature-card bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-xl p-6 text-left">
              <AIBrainIcon
                className="w-12 h-12 text-blue-400 mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold text-white mb-2">
                Smart Resume Intelligence
              </h3>
              <p className="text-gray-300">
                Harness cutting-edge AI that understands what recruiters want and 
                positions you as the perfect candidate for every role.
              </p>
            </div>
            <div className="feature-card bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-xl p-6 text-left">
              <ATSShieldIcon
                className="w-12 h-12 text-blue-400 mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold text-white mb-2">
                Beat Applicant Filters
              </h3>
              <p className="text-gray-300">
                Expertly formatted to sail through automated screening—ensuring 
                your resume reaches hiring managers, not rejection folders.
              </p>
            </div>
            <div className="feature-card bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-xl p-6 text-left">
              <SpeedOptimizationIcon
                className="w-12 h-12 text-blue-400 mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold text-white mb-2">
                Lightning-Fast Results
              </h3>
              <p className="text-gray-300">
                Start applying in minutes, not days. Create polished, 
                interview-ready documents while others are still formatting.
              </p>
            </div>
            <div className="feature-card bg-gray-800/50 border border-gray-700 backdrop-blur-sm rounded-xl p-6 text-left">
              <MailIcon
                className="w-12 h-12 text-blue-400 mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold text-white mb-2">
                Personalized Every Time
              </h3>
              <p className="text-gray-300">
                Each application gets custom-crafted content that speaks directly 
                to the employer's needs and gets you noticed.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 py-12 px-4 bg-gradient-to-br from-blue-600/90 to-purple-700/90 rounded-2xl shadow-xl border border-blue-500/20">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Trusted by Few
            </h2>
            <StatsWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
