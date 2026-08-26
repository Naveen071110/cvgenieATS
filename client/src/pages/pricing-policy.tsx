import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PricingPolicy() {
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Pricing and Refund Policy</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Free Plan</h2>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>3 AI resume and cover letter generations per month</li>
              <li>Core two-pass ATS keyword optimization</li>
              <li>PDF (with watermark), DOCX, and TXT document exports</li>
              <li>Free account creation with secure Email sign-in (via Clerk)</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Pro Plan ($9.99 / Month)</h2>
            <ul className="space-y-2 mb-4 text-slate-600 dark:text-slate-400">
              <li>Unlimited AI resume and cover letter generations</li>
              <li>100% Watermark-free clean PDF and Word DOCX downloads</li>
              <li>Priority instant AI generation speed (zero queue delays)</li>
              <li>Full resume version history with encrypted cloud persistence</li>
              <li>AI mock interview preparation and behavioral question copilot</li>
              <li>Priority email customer support</li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400">
              Pro subscriptions are billed monthly on a recurring basis and can be cancelled at any time directly from your account settings.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Refund Policy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We want you to be completely satisfied with CVGenie. If you experience technical issues or are not satisfied with your Pro subscription, you may request a full refund within 14 days of purchase by contacting our billing team.
            </p>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400">
            For billing inquiries, subscription cancellations, or refunds, please email <a href="mailto:singhnaveen360@gmail.com" className="text-primary hover:underline">singhnaveen360@gmail.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
