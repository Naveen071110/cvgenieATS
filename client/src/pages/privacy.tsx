import { ArrowLeft, ShieldCheck, Lock, EyeOff, FileText, Database, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import Footer from "@/components/footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <SEO
        title="Privacy Policy — Data Protection &amp; Security | CVGenie ATS"
        description="Read the CVGenie ATS Privacy Policy. Learn about our zero-retention AI data policy, encryption, GDPR/CCPA rights, and how your career data is protected."
        canonical="https://cvgenieats.com/privacy"
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            GDPR &amp; CCPA Compliant • Zero Model Training
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last Updated: August 31, 2026 • Effective Immediately
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-10 leading-relaxed text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              1. Our Core Privacy Pledge
            </h2>
            <p>
              At <strong>CVGenie ATS</strong> ("CVGenie", "we", "us", or "our"), we believe your career history is personal, confidential, and sacred. We adhere to a strict principle: <strong>We do not sell, rent, monetize, or broker your personal information or resume contents to any third party or recruiting database</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              2. Information We Collect
            </h2>
            <p>We only collect the data necessary to provide and operate the service:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Credentials:</strong> Email address and authentication tokens managed securely through Clerk Identity Services.</li>
              <li><strong>Resume &amp; Document Data:</strong> Text, work experience, educational history, and skills uploaded via PDF, DOCX, or direct text input for the purpose of ATS optimization.</li>
              <li><strong>Target Job Descriptions:</strong> Text from job postings you input so our engine can extract target keywords.</li>
              <li><strong>Payment Information:</strong> Subscription purchases are processed securely by <strong>Dodo Payments</strong>. We do not store or process raw credit card numbers on our servers.</li>
              <li><strong>Technical Metadata:</strong> Anonymized IP addresses, browser types, and operational telemetry used strictly for rate limiting, DDoS mitigation, and reliability monitoring.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-primary" />
              3. AI Processing &amp; Zero Model Training Guarantee
            </h2>
            <p>
              When you generate a resume or cover letter, your input text is transmitted via TLS 1.3 encrypted API calls to enterprise language model endpoints (including DeepSeek AI) strictly to produce your optimized documents.
            </p>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 my-4">
              <p className="font-semibold text-blue-900 dark:text-blue-200 text-sm mb-1">
                Zero AI Training Commitment:
              </p>
              <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 m-0">
                Under our enterprise API agreements, your resume text and career history are <strong>NEVER used to train, retrain, or fine-tune public artificial intelligence models</strong>.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              4. Data Retention &amp; Deletion
            </h2>
            <p>
              Temporary files created during document rendering in our staging environment are systematically deleted immediately after download. For authenticated users, your saved resumes in the Resume History are stored in encrypted Neon PostgreSQL databases and can be deleted by you at any time with a single click in your dashboard.
            </p>
            <p>
              To request a complete purge of your account, email us at <a href="mailto:singhnaveen360@gmail.com" className="text-primary underline">singhnaveen360@gmail.com</a>. We fulfill verified data deletion requests within 48 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              5. Your Legal Rights (GDPR &amp; CCPA)
            </h2>
            <p>
              Regardless of your jurisdiction, you have the right to access, rectify, export, or restrict processing of your personal information, as well as the right to withdraw consent without affecting prior lawful processing.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              6. Data Controller &amp; Contact Details
            </h2>
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm space-y-2">
              <p><strong>Entity Name:</strong> CVGenie ATS Platforms</p>
              <p><strong>Registered Address:</strong> Outer Ring Road, Marathahalli Tech Corridor, Bengaluru, Karnataka 560037, India</p>
              <p><strong>Data Protection Officer &amp; Support:</strong> Naveen Singh (<a href="mailto:singhnaveen360@gmail.com" className="text-primary underline">singhnaveen360@gmail.com</a>)</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
