import { Twitter, Linkedin, Github, ArrowRight } from "lucide-react";
import { Link } from "wouter"
import SecurityLockIcon from "../assets/icons/security-lock.svg?react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
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
            <h4 className="typography-body font-semibold text-slate-900 mb-2 md:mb-4 text-sm md:text-base">Product</h4>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("features");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="typography-body text-slate-600 hover:text-primary transition-colors text-sm md:text-base"
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
                  className="typography-body text-slate-600 hover:text-primary transition-colors text-sm md:text-base"
                >
                  Pricing
                </button>
              </li>

            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="typography-body font-semibold text-slate-900 mb-2 md:mb-4 text-sm md:text-base">Resources</h4>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById("faq");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="typography-body text-slate-600 hover:text-primary transition-colors text-sm md:text-base"
                >
                  FAQ
                </button>
              </li>
              <li><a href="#" className="typography-body text-slate-600 hover:text-primary transition-colors text-sm md:text-base">Resume Tips</a></li>
              <li><a href="#" className="typography-body text-slate-600 hover:text-primary transition-colors text-sm md:text-base">Career Advice</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="typography-body font-semibold text-slate-900 mb-2 md:mb-4 text-sm md:text-base">Legal</h4>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link to="/privacy" className="typography-body text-slate-600 hover:text-primary transition-colors text-sm md:text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="typography-body text-slate-600 hover:text-primary transition-colors text-sm md:text-base">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/pricing-policy" className="typography-body text-slate-600 hover:text-primary transition-colors text-sm md:text-base">
                  Pricing Policy
                </Link>
              </li>
              <li><a href="mailto:support@cvgenie.com" className="typography-body text-slate-600 hover:text-primary transition-colors text-sm md:text-base">Contact</a></li>
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