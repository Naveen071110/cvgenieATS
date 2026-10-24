import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import Footer from "@/components/footer";

export default function PricingPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <SEO
        title="Pricing &amp; Refund Policy | CVGenie ATS"
        description="Transparent pricing for CVGenie ATS. Compare our Free tier and $9.99/month Pro subscription, recurring billing rules, cancellation, and 14-day money-back guarantee."
        canonical="https://cvgenieats.com/pricing-policy"
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
              Contact Us
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-8">Pricing and Refund Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Free Plan ($0 / Month)</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
              <li>3 AI resume and tailored cover letter generations per month</li>
              <li>Core two-pass ATS keyword optimization algorithm</li>
              <li>PDF (with discrete footer watermark), DOCX, and TXT document downloads</li>
              <li>Secure Email sign-in (powered by Clerk authentication)</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Pro Plan ($9.99 / Month)</h2>
            <ul className="list-disc pl-5 space-y-2 mb-4 text-slate-600 dark:text-slate-400">
              <li><strong>Unlimited</strong> AI resume and cover letter generations</li>
              <li><strong>100% Watermark-free</strong> clean PDF and Word DOCX downloads</li>
              <li>Priority instant AI generation speed (zero queue delays)</li>
              <li>Full resume version history with encrypted cloud persistence</li>
              <li>AI mock interview preparation and behavioral question copilot</li>
              <li>Priority customer support via dedicated email queue</li>
            </ul>
            <p className="text-sm text-slate-600 dark:text-slate-400 m-0">
              Pro subscriptions are billed monthly on a recurring basis via <strong>Dodo Payments</strong> and can be cancelled at any time directly from your account settings without cancellation fees.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">14-Day Satisfaction Guarantee &amp; Refund Policy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We want you to be completely confident with CVGenie. If you experience technical issues or are not satisfied with your Pro subscription, you may request a <strong>100% full refund within 14 days of purchase</strong> by emailing our billing team at <a href="mailto:singhnaveen360@gmail.com" className="text-primary underline">singhnaveen360@gmail.com</a>. Refunds are credited to your original payment method within 3–5 business days.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-sm text-slate-500">
            <p>
              Operating Entity: CVGenie ATS Platforms • Outer Ring Road, Marathahalli Tech Corridor, Bengaluru, Karnataka 560037, India.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
