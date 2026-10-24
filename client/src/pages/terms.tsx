import { ArrowLeft, Shield, CheckCircle2, AlertCircle, Scale, FileText } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import Footer from "@/components/footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <SEO
        title="Terms of Service | CVGenie ATS"
        description="Review the CVGenie ATS Terms of Service. Understand subscription billing terms, usage policies, intellectual property rights, and user responsibilities."
        canonical="https://cvgenieats.com/terms"
      />

      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
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
              Contact Support
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4">
            <Scale className="w-4 h-4" />
            Transparent &amp; Fair Commercial Terms
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Terms of Service</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last Updated: August 31, 2026 • Effective Immediately
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 leading-relaxed text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or using <strong>CVGenie ATS</strong> (available at <a href="https://cvgenieats.com" className="text-primary underline">https://cvgenieats.com</a>), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree with any part of these terms, you must discontinue use immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              2. User Content &amp; Intellectual Property
            </h2>
            <p>
              <strong>You retain 100% full ownership</strong> of all original resume content, employment history, personal biographies, and materials you upload or enter into CVGenie. We claim zero ownership over your career data.
            </p>
            <p>
              You grant CVGenie a temporary, limited technical license strictly to process, format, optimize, and deliver your resume documents as requested through our AI pipeline.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              3. Free Tier vs. Pro Subscriptions
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Free Tier:</strong> Includes 3 ATS-optimized resume generations per month with standard processing and CVGenie footer watermark. Free features are provided without financial obligation.</li>
              <li><strong>Pro Plan ($9.99/month):</strong> Includes unlimited AI resume generations, watermark-free vector PDF and DOCX downloads, instant generation speed, priority interview preparation copilot, and persistent cloud resume history.</li>
              <li><strong>Billing &amp; Processing:</strong> Subscriptions are billed on a recurring monthly cycle managed by our merchant partner <strong>Dodo Payments</strong>. You can cancel your subscription at any time directly through your account dashboard or by contacting support.</li>
              <li><strong>Cancellation:</strong> Upon cancellation, your Pro benefits remain active until the end of your paid billing period, after which your account reverts to the Free tier without unexpected charges.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              4. AI Disclaimers &amp; User Review Responsibility
            </h2>
            <p>
              CVGenie employs state-of-the-art language models and ATS vector algorithms to optimize your resume's keyword density and structural readability. However, <strong>you are solely responsible for reviewing and confirming the factual accuracy</strong> of your generated resumes before submitting them to prospective employers.
            </p>
            <p>
              CVGenie does not guarantee employment offers, interview invitations, or specific hiring outcomes, as hiring decisions remain entirely within the discretion of third-party employers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the platform to distribute fraudulent, defamatory, or unlawful materials.</li>
              <li>Attempt to reverse-engineer, decompile, or scrape the service or bypass API rate limits.</li>
              <li>Share account credentials or abuse free tier quotas through automated bot scripts.</li>
            </ul>
          </section>

          <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              6. Governing Entity &amp; Inquiries
            </h2>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm space-y-2">
              <p><strong>Operating Entity:</strong> CVGenie ATS Platforms</p>
              <p><strong>Office Location:</strong> Outer Ring Road, Marathahalli Tech Corridor, Bengaluru, Karnataka 560037, India</p>
              <p><strong>Customer Support:</strong> <a href="mailto:singhnaveen360@gmail.com" className="text-primary underline">singhnaveen360@gmail.com</a></p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
