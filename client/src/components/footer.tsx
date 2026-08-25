import { Twitter, Linkedin, Github, ArrowRight } from "lucide-react";
import { Link } from "wouter"
import SecurityLockIcon from "../assets/icons/security-lock.svg?react";
import { useConsent } from "@/hooks/useConsent";

export default function Footer() {
  const { openPreferences } = useConsent();
  return (
    <footer className="bg-slate-900 text-white py-6 md:py-20 px-4 sm:px-6 lg:px-8">
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
                <Link to="/ats-score" className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base">
                  ATS Score Checker
                </Link>
              </li>
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

          {/* Company */}
          <div>
            <h4 className="typography-body font-semibold text-white mb-2 md:mb-4 text-sm md:text-base">Company</h4>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link to="/about" className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base">
                  About CVGenie
                </Link>
              </li>
              <li>
                <a href="mailto:singhnaveen360@gmail.com" className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base">
                  Contact Us
                </a>
              </li>
            </ul>
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
              <li>
                <button
                  type="button"
                  onClick={openPreferences}
                  className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base text-left"
                >
                  Cookie Preferences
                </button>
              </li>
              <li><a href="mailto:singhnaveen360@gmail.com" className="typography-body text-slate-400 hover:text-primary transition-colors text-sm md:text-base">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-6 md:mt-12 pt-4 md:pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="typography-small text-slate-400 text-xs md:text-sm">
            © 2026 CVGenie. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}