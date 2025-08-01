import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PricingPolicy() {
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
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Pricing and Refund Policy</h1>
        <div className="prose prose-slate max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Free Plan</h2>
            <ul className="space-y-2">
              <li>3 resume/cover letter generations per month</li>
              <li>No signup needed</li>
              <li>Full access to basic features</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Pro Plan</h2>
            <ul className="space-y-2 mb-4">
              <li>$9.99/month</li>
              <li>Unlimited generations</li>
              <li>Priority queue (where available)</li>
            </ul>
            <p className="text-slate-600">Pro subscriptions are billed monthly and can be cancelled anytime via your account.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Refunds</h2>
            <p className="text-slate-600">
              Refunds are granted only if a technical failure prevents delivery of Pro features and you contact support within 7 days of purchase.
            </p>
          </div>
          
          <p className="text-slate-600">
            For questions or cancellations, email <a href="mailto:billing@cvgenie.com" className="text-primary hover:underline">billing@cvgenie.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}