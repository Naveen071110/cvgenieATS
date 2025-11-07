import { Twitter, Linkedin, Github, ArrowRight } from "lucide-react";
import { Link } from "wouter"
import SecurityLockIcon from "../assets/icons/security-lock.svg?react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 dark:bg-gray-950 text-white py-6 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3 md:mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <span className="text-xl font-bold">CVGenie</span>
            </div>
            <p className="text-slate-400 mb-3 md:mb-4 text-sm md:text-base">
              The best AI resume builder for creating ATS-friendly resumes. Free resume builder with professional templates and instant optimization.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/NaveenBale" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Follow us on X (Twitter)" data-testid="link-twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com/Naveen071110" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Visit our GitHub" data-testid="link-github">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/naveen-guru-b23a7816a" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="Connect on LinkedIn" data-testid="link-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="typography-body font-semibold text-white mb-2 md:mb-4 text-sm md:text-base">Product</h4>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("features");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("pricing");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base"
                >
                  Pricing
                </button>
              </li>

            </ul>
          </div>

          {/* About */}
          <div className="md:col-span-2 lg:col-span-1">
            <h4 className="typography-body font-semibold text-white mb-2 md:mb-4 text-sm md:text-base">About CVgenie</h4>
            <div className="text-slate-400 text-xs md:text-sm leading-relaxed space-y-2">
              <p>
                CVgenie was built to solve a real problem for job seekers: most resumes never get seen by humans because large companies use ATS (Applicant Tracking Systems) to automatically filter and sort applications.
              </p>
              <p>
                With years of resume wrangling and product-building experience, we've focused on making ATS-friendly resumes simple, fast, and accessible.
              </p>
              <p>
                Our core features are designed for real users—not just for bots—so you can match your resume to any job description, spot instant keyword gaps, and apply with confidence.
              </p>
              <p>
                Today CVgenie runs on modern, scalable tech (Clerk for login, NeonDB for serverless databases), and we're building more agent-driven tools to help automate the job search and application process from start to finish.
              </p>
              <p>
                Building in public means everything here is shaped by your feedback. If you have ideas, suggestions, or want to test early features, reach out any time.
              </p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="typography-body font-semibold text-white mb-2 md:mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link to="/privacy" className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/pricing-policy" className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base">
                  Pricing Policy
                </Link>
              </li>
              <li><a href="mailto:singhnaveen360@gmail.com" className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-6 md:mt-12 pt-4 md:pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="typography-small text-slate-400 text-xs md:text-sm">
            © 2025 CVGenie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}