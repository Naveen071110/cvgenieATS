import { useLocation } from "wouter";
import { Link } from "wouter";
import { CheckCircle2, Crown, Sparkles, ArrowRight, Download, MessageSquare, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ThankYou() {
  const [location] = useLocation();
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const type = searchParams.get("type") || "pro";

  const isProUpgrade = type === "pro" || type === "upgrade";
  const isContact = type === "contact";
  const isSignup = type === "signup";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <SEO
        title="Thank You | CVGenie ATS"
        description="Thank you for choosing CVGenie ATS. Your request has been confirmed. Start building resumes that beat applicant tracking systems."
        noindex={true}
      />
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-xl w-full text-center">
          {/* Animated Celebration Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-inner ring-8 ring-emerald-50 dark:ring-emerald-950/30">
            {isProUpgrade ? (
              <Crown className="w-10 h-10 animate-bounce" />
            ) : (
              <CheckCircle2 className="w-10 h-10" />
            )}
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-slate-900 dark:text-white">
            {isProUpgrade
              ? "Welcome to CVGenie Pro!"
              : isContact
              ? "Message Received!"
              : "Thank You for Joining CVGenie!"}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            {isProUpgrade
              ? "Your Pro subscription is active. You now have unlimited watermark-free AI resume generations, instant priority processing, and mock interview prep."
              : isContact
              ? "Thank you for getting in touch. Our support team typically replies within 24 hours at singhnaveen360@gmail.com."
              : "Your account is ready. Start building ATS-optimized resumes and tailor your cover letters in seconds."}
          </p>

          {/* Card with Perks / Order summary */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left mb-8 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              {isProUpgrade ? "What's unlocked on your account:" : "Recommended next steps:"}
            </h2>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Unlimited AI generations</strong> tailored to job descriptions</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>100% Watermark-free</strong> vector PDF &amp; DOCX downloads</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Full Resume History &amp; Cloud Storage</strong> to edit anytime</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Priority AI Interview Prep Copilot</strong> with tailored Q&amp;A</span>
              </li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/generator">
              <Button size="lg" className="gap-2 px-8 w-full sm:w-auto">
                <Sparkles className="w-4 h-4" />
                Build My Resume Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-8 text-xs text-slate-500 dark:text-slate-400">
            Need assistance? Reach us directly at{" "}
            <a href="mailto:singhnaveen360@gmail.com" className="text-primary underline">
              singhnaveen360@gmail.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
