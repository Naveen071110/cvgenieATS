import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <span className="text-xl font-bold text-slate-900">CVGenie</span>
            </Link>
            <a href="mailto:singhnaveen360@gmail.com" className="text-sm text-slate-600 hover:text-primary transition-colors">
              Contact Us
            </a>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6"><strong>Effective Date:</strong> August 1, 2025</p>
          
          <ul className="space-y-4 mb-8">
            <li>We only collect information you provide (resume content, job description, email for Pro accounts).</li>
            <li>We do not store or reuse your data after generation unless you have a user account and explicitly save a resume.</li>
            <li>No personal data is sold to third parties.</li>
            <li>Analytics are anonymized and used only to improve the service.</li>
            <li>All transmissions are encrypted; payments are securely processed via Stripe or similar providers.</li>
          </ul>
          
          <p className="text-slate-600">
            To request data deletion, email <a href="mailto:privacy@cvgenie.com" className="text-primary hover:underline">privacy@cvgenie.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}