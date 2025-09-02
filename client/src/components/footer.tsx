import { Twitter, Linkedin, Github } from "lucide-react";
import { Link } from "wouter"
import SecurityLockIcon from "../assets/icons/security-lock.svg?react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <span className="text-xl font-bold">CVGenie</span>
            </div>
            <p className="text-slate-400 mb-4">
              Transform your resume with AI-powered optimization for better job opportunities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="typography-body font-semibold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById("features");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="typography-body text-slate-600 hover:text-primary transition-colors"
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
                  className="typography-body text-slate-600 hover:text-primary transition-colors"
                >
                  Pricing
                </button>
              </li>

            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="typography-body font-semibold text-slate-900 mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    const element = document.getElementById("faq");
                    if (element) element.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="typography-body text-slate-600 hover:text-primary transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li><a href="#" className="typography-body text-slate-600 hover:text-primary transition-colors">Resume Tips</a></li>
              <li><a href="#" className="typography-body text-slate-600 hover:text-primary transition-colors">Career Advice</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="typography-body font-semibold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="typography-body text-slate-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="typography-body text-slate-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/pricing-policy" className="typography-body text-slate-600 hover:text-primary transition-colors">
                  Pricing Policy
                </Link>
              </li>
              <li><a href="mailto:support@cvgenie.com" className="typography-body text-slate-600 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="typography-small text-slate-400 text-sm">
            © 2025 CVGenie. All rights reserved.
          </p>
          <p className="typography-small text-slate-400 text-sm mt-4 sm:mt-0">
            Made with ❤️ for job seekers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}