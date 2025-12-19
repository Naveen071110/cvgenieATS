import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Terms() {
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-600 dark:text-slate-400 mb-6"><strong className="text-slate-900 dark:text-white">Effective Date:</strong> August 1, 2025</p>
          
          <p className="mb-6 text-slate-600 dark:text-slate-400">By using CVGenie, you agree to these terms:</p>
          
          <ul className="space-y-4 mb-8 text-slate-600 dark:text-slate-400">
            <li>You are responsible for the content you upload or submit.</li>
            <li>You agree not to use CVGenie for illegal purposes or harmful activity.</li>
            <li>All AI-generated content is for informational purposes; you should review outputs before use.</li>
            <li>Access to free and paid features may change; paid plans are billed monthly and auto-renew unless cancelled.</li>
            <li>You use CVGenie "as is"; we are not liable for employment decisions or data loss.</li>
          </ul>
          
          <p className="text-slate-600 dark:text-slate-400">
            For questions, contact <a href="mailto:support@cvgenie.com" className="text-primary hover:underline">support@cvgenie.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
