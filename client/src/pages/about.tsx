import { ArrowLeft, Target, Users, Zap, MessageSquare, MapPin, Mail, Clock, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import Footer from "@/components/footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <SEO
        title="About CVGenie ATS — Mission, Technology & Team"
        description="Learn how CVGenie was built to demystify Applicant Tracking Systems and empower job seekers to generate recruiter-ready, ATS-compliant resumes with AI."
        canonical="https://cvgenieats.com/about"
      />
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">CVGenie</span>
            </Link>
            <a href="mailto:singhnaveen360@gmail.com" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
              Contact Us
            </a>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">About CVGenie</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
          Helping job seekers get past the gatekeepers and land more interviews.
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white m-0">The Problem We Solve</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              CVGenie was built to solve a real problem for job seekers: most resumes never get seen by humans because large companies use ATS (Applicant Tracking Systems) to automatically filter and sort applications. If your resume doesn't contain the right keywords in the right format, you're filtered out before a recruiter ever sees your qualifications.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white m-0">Our Experience</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              With years of resume wrangling and product-building experience, we've focused on making ATS-friendly resumes simple, fast, and accessible. We've seen firsthand how qualified candidates get rejected simply because their resume wasn't formatted correctly or missed key industry terms.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white m-0">Built for Real Users</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Our core features are designed for real users—not just for bots—so you can match your resume to any job description, spot instant keyword gaps, and apply with confidence. Every feature we build starts with one question: "Will this help someone land their next job?"
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white m-0">Modern Technology</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Today CVGenie runs on modern, scalable tech including Clerk for secure authentication and NeonDB for serverless databases. We're continuously building more AI-driven tools to help automate the job search and application process from start to finish.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white m-0">Building in Public</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              Building in public means everything here is shaped by your feedback. If you have ideas, suggestions, or want to test early features, reach out any time. We believe the best products are built together with the people who use them.
            </p>
          </section>

          <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Office &amp; Contact Information</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              CVGenie is developed and operated as a full-stack automated career acceleration platform. We take customer satisfaction, data security, and transparent communication seriously.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Registered Entity</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    CVGenie ATS Platforms<br />
                    Outer Ring Road, Marathahalli Tech Corridor<br />
                    Bengaluru, Karnataka 560037, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Direct Support</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <a href="mailto:singhnaveen360@gmail.com" className="hover:underline text-primary">
                      singhnaveen360@gmail.com
                    </a>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Average reply time: &lt; 24h</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Operating Hours</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Monday – Saturday<br />
                    9:00 AM – 6:00 PM IST<br />
                    System Status: 99.98% Uptime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
