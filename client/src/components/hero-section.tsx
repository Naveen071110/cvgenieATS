import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import {
  ArrowRight,
  Users,
  FileText,
  Zap,
  Sparkles,
  TrendingUp,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AIBrainIcon from "../assets/icons/ai-brain.svg?react";
import ATSShieldIcon from "../assets/icons/ats-shield.svg?react";
import SpeedOptimizationIcon from "../assets/icons/speed-optimization.svg?react";
import MailIcon from "../assets/icons/mail.svg?react";
import AnimatedStatCard from "./AnimatedStatCard";
import { useIsMobile, useReducedMotion } from "@/hooks/useIntersectionLoader";
import { useRequireAuth } from "@/hooks/useRequireAuth";



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
  const [shouldAnimateStats, setShouldAnimateStats] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldDisableAnimations = isMobile || prefersReducedMotion;
  const { requireAuthThenNavigate, AuthDialog } = useRequireAuth();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 25 });
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 25 });
  const { scrollY } = useScroll();
  const blobParallaxY = useTransform(scrollY, [0, 700], [0, 80]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldDisableAnimations || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    if (shouldDisableAnimations) return;
    
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length);
        setIsVisible(true);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [shouldDisableAnimations]);

  // Intersection observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldAnimateStats) {
            setShouldAnimateStats(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [shouldAnimateStats]);

  const handleCreateResume = () => {
    requireAuthThenNavigate("/generator");
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10"
      role="region"
      aria-label="Hero section with resume generation services"
    >
      {/* Animated Background Particles - reduced count for performance */}
      {!shouldDisableAnimations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particle-container">
            {[...Array(8)].map((_, i) => (
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
      )}

      {/* Simplified background blobs - static on mobile, parallax on desktop */}
      {!shouldDisableAnimations && (
        <motion.div style={{ y: blobParallaxY }} aria-hidden="true">
          <div className="hero-bg">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <radialGradient id="wcA" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#9ec5fe" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#9ec5fe" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="wcB" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#b1e3c1" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#b1e3c1" stopOpacity="0" />
                </radialGradient>
                <filter id="wcBlur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="10" />
                </filter>
              </defs>
              <g className="hero-blob" style={{ transformOrigin: "18% 62%" }}>
                <circle cx="18" cy="62" r="28" fill="url(#wcA)" filter="url(#wcBlur)" />
              </g>
              <g className="hero-blob hero-blob--alt" style={{ transformOrigin: "82% 28%" }}>
                <circle cx="82" cy="28" r="24" fill="url(#wcB)" filter="url(#wcBlur)" />
              </g>
            </svg>
          </div>
          <div className="hero-bg-blob"></div>
        </motion.div>
      )}
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
                <Button
                  size="lg"
                  className="magic-cta genie-lamp text-lg px-10 py-7 rounded-full shadow-2xl font-bold tracking-wide animate-fade-in-up animation-delay-400 hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] dark:hover:shadow-[0_0_40px_rgba(167,139,250,0.8)] transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-purple-500/50 dark:focus:ring-purple-400/50"
                  onClick={handleCreateResume}
                  aria-label="Start your free resume generation - Sign in required"
                >
                  <Sparkles className="mr-2 h-6 w-6" aria-hidden="true" />
                  Grant My Wish
                  <ArrowRight
                    className="ml-2 h-6 w-6"
                    aria-hidden="true"
                  />
                </Button>
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
            {/* Hero Product Mockup */}
            <div className="flex justify-center items-center mt-8 lg:mt-0 px-2 sm:px-0">
              <motion.div
                className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] mx-auto animate-fade-in-up animation-delay-600"
                style={shouldDisableAnimations
                  ? { marginTop: '16px', marginBottom: '16px' }
                  : { marginTop: '16px', marginBottom: '16px', rotateX, rotateY, transformPerspective: 1200 }
                }
                aria-label="Sample of a CVGenie-tailored resume"
                role="img"
              >
                {/* Floating ATS Score Badge */}
                <div className={`absolute -top-3 -right-2 sm:-top-4 sm:-right-4 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-2.5${!shouldDisableAnimations ? ' animate-badge-float-a' : ''}`}>
                  <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-green-100 dark:bg-green-900/40">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 leading-tight">
                      ATS Score
                    </div>
                    <div className="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
                      94<span className="text-xs sm:text-sm text-gray-500">/100</span>
                    </div>
                  </div>
                </div>

                {/* Resume Document */}
                <div
                  className={`relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden${!shouldDisableAnimations ? ' animate-mockup-float' : ''}`}
                  style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)' }}
                >
                  {/* Tailored-for badge */}
                  <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-2.5 sm:pb-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-primary dark:text-blue-300">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                      <span className="truncate">Tailored for: Senior Data Engineer</span>
                    </div>
                  </div>

                  {/* Resume header */}
                  <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4">
                    <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                      Naveen Guru
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                      Data Analyst / Engineer · New Delhi, India
                    </div>
                  </div>

                  {/* Section divider */}
                  <div className="px-4 sm:px-6">
                    <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1.5">
                      Experience
                    </div>
                  </div>

                  {/* Job entry */}
                  <div className="px-4 sm:px-6 pt-3 sm:pt-4 pb-4 sm:pb-5">
                    <div className="flex items-baseline justify-between gap-2 mb-2">
                      <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                        Data Specialist · Wipro DOP
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        Dec 2021 — Present
                      </div>
                    </div>

                    <ul className="space-y-2 sm:space-y-2.5">
                      <li className="flex gap-2 text-[11px] sm:text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="text-gray-400 mt-1 sm:mt-1.5">•</span>
                        <span>
                          Designed end-to-end <mark className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 font-semibold px-1 rounded">ETL workflows</mark> using <mark className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 font-semibold px-1 rounded">Informatica</mark> &amp; IICS on AWS Appstream.
                        </span>
                      </li>
                      <li className="flex gap-2 text-[11px] sm:text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="text-gray-400 mt-1 sm:mt-1.5">•</span>
                        <span>
                          Built advanced <mark className="bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-200 font-semibold px-1 rounded">SQL</mark> queries for data extraction &amp; cleansing, improving analytics quality.
                        </span>
                      </li>
                      <li className="flex gap-2 text-[11px] sm:text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="text-gray-400 mt-1 sm:mt-1.5">•</span>
                        <span>
                          Led training for 3+ engineers; recognised by US team for <mark className="bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 font-semibold px-1 rounded">exceptional delivery</mark>.
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Floating "matched keywords" pill */}
                <div className={`absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-4 z-20 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2${!shouldDisableAnimations ? ' animate-badge-float-b' : ''}`}>
                  <div className="flex -space-x-1">
                    <span className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500 border-2 border-white dark:border-gray-800"></span>
                    <span className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    <span className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-500 border-2 border-white dark:border-gray-800"></span>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200">
                    18 keywords matched
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Feature Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="feature-card group bg-gradient-to-br from-blue-50/80 via-white/60 to-purple-50/80 dark:from-blue-950/40 dark:via-gray-800/60 dark:to-purple-950/40 border border-blue-200/50 dark:border-blue-700/30 backdrop-blur-sm rounded-xl p-6 text-left transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-400/30 hover:border-blue-300/70 dark:hover:border-blue-500/50">
              <div className="flex items-center justify-center w-16 h-16 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <AIBrainIcon
                  className="w-12 h-12 text-primary dark:text-blue-400 transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Keyword matching from any job posting
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Paste a job description and CVGenie pulls the exact phrases ATS bots scan for — then rewrites your bullets to include them naturally.
              </p>
            </div>
            <div className="feature-card group bg-gradient-to-br from-purple-50/80 via-white/60 to-pink-50/80 dark:from-purple-950/40 dark:via-gray-800/60 dark:to-pink-950/40 border border-purple-200/50 dark:border-purple-700/30 backdrop-blur-sm rounded-xl p-6 text-left transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/20 dark:hover:shadow-purple-400/30 hover:border-purple-300/70 dark:hover:border-purple-500/50">
              <div className="flex items-center justify-center w-16 h-16 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <ATSShieldIcon
                  className="w-12 h-12 text-primary dark:text-blue-400 transition-all duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Formatted to pass every ATS scan
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Single-column layout, standard section labels, no tables or columns — the formatting rules that stop ATS from garbling your experience.
              </p>
            </div>
            <div className="feature-card group bg-gradient-to-br from-teal-50/80 via-white/60 to-cyan-50/80 dark:from-teal-950/40 dark:via-gray-800/60 dark:to-cyan-950/40 border border-teal-200/50 dark:border-teal-700/30 backdrop-blur-sm rounded-xl p-6 text-left transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/20 dark:hover:shadow-teal-400/30 hover:border-teal-300/70 dark:hover:border-teal-500/50">
              <div className="flex items-center justify-center w-16 h-16 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <SpeedOptimizationIcon
                  className="w-12 h-12 text-primary dark:text-blue-400 transition-all duration-300 group-hover:text-teal-600 dark:group-hover:text-teal-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                A tailored resume in under 60 seconds
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Paste your resume and the job description. CVGenie generates a fully tailored resume and cover letter in about a minute.
              </p>
            </div>
            <div className="feature-card group bg-gradient-to-br from-indigo-50/80 via-white/60 to-violet-50/80 dark:from-indigo-950/40 dark:via-gray-800/60 dark:to-violet-950/40 border border-indigo-200/50 dark:border-indigo-700/30 backdrop-blur-sm rounded-xl p-6 text-left transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-400/30 hover:border-indigo-300/70 dark:hover:border-indigo-500/50">
              <div className="flex items-center justify-center w-16 h-16 mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <MailIcon
                  className="w-12 h-12 text-primary dark:text-blue-400 transition-all duration-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Different resume for every application
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                The same experience, reframed for each role's priorities. No more copy-pasting and hoping for the best.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div 
            ref={statsRef}
            className="mt-20 py-12 px-6 md:px-8 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-2xl"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white text-center mb-10 md:mb-12">
              We are Just Getting Started
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <AnimatedStatCard
                icon={<Users className="w-8 h-8 md:w-10 md:h-10" />}
                value={10}
                suffix="+"
                label="Active Users"
                shouldAnimate={shouldAnimateStats}
              />
              <AnimatedStatCard
                icon={<TrendingUp className="w-8 h-8 md:w-10 md:h-10" />}
                value={94}
                suffix="%"
                label="ATS Pass Rate"
                shouldAnimate={shouldAnimateStats}
              />
              <AnimatedStatCard
                icon={<FileText className="w-8 h-8 md:w-10 md:h-10" />}
                value={100}
                suffix="+"
                label="Resumes Optimized"
                shouldAnimate={shouldAnimateStats}
              />
              <AnimatedStatCard
                icon={<Star className="w-8 h-8 md:w-10 md:h-10" />}
                value={4.9}
                suffix="/5"
                label="User Rating"
                decimals={1}
                shouldAnimate={shouldAnimateStats}
              />
            </div>
          </div>
        </div>
      </div>
      <AuthDialog />
    </section>
  );
}