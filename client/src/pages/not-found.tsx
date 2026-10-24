import { Link } from "wouter";
import { ArrowLeft, Sparkles, FileText, Target, Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <SEO
        title="404 — Page Not Found | CVGenie ATS"
        description="The page you are looking for does not exist or has been moved. Explore our AI resume builder, free ATS checker, or return home."
        noindex={true}
      />
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl w-full text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            Error Code 404 • Page Not Found
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-white">
            Lost in the Application Pipeline?
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            The link you followed doesn't exist or has moved to a new route. Don't worry — your resume journey isn't lost. Choose where you'd like to head next:
          </p>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left">
            <Link
              to="/generator"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-slate-900 dark:text-white text-base">
                  Build ATS Resume
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Optimize your resume with our AI generator in under 60 seconds.
              </p>
            </Link>

            <Link
              to="/ats-score"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/60 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-slate-900 dark:text-white text-base">
                  Check ATS Score
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Scan your resume against any job description for instant feedback.
              </p>
            </Link>

            <Link
              to="/blog"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-slate-900 dark:text-white text-base">
                  Resume Advice &amp; Guides
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Read actionable ATS formatting guides and interview tips.
              </p>
            </Link>

            <Link
              to="/about"
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-slate-900 dark:text-white text-base">
                  About &amp; Support
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Learn how CVGenie beats ATS scanners or reach our team.
              </p>
            </Link>
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/">
              <Button size="lg" className="gap-2 px-8">
                <Home className="w-4 h-4" />
                Back to Homepage
              </Button>
            </Link>
            <a href="mailto:singhnaveen360@gmail.com">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
