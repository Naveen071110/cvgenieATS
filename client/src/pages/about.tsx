import { ArrowLeft, Target, Users, Zap, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
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

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Get in Touch</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Have questions, feedback, or just want to say hello? We'd love to hear from you.
            </p>
            <a 
              href="mailto:singhnaveen360@gmail.com" 
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
