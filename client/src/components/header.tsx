import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-200" : "bg-white/80 backdrop-blur-md border-b border-slate-200"
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <span className="text-xl font-bold text-slate-900">CVGenie</span>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/generator"
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                Generator
              </Link>
              <button 
                onClick={() => scrollToSection("features")}
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection("faq")}
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                FAQ
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white md:hidden">
          <div className="flex flex-col h-full pt-20 px-6">
            <Link 
              to="/generator"
              className="py-4 text-lg font-medium text-slate-700 border-b border-slate-200 text-left block"
              onClick={() => setIsMenuOpen(false)}
            >
              Generator
            </Link>
            <button 
              onClick={() => scrollToSection("features")}
              className="py-4 text-lg font-medium text-slate-700 border-b border-slate-200 text-left"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection("pricing")}
              className="py-4 text-lg font-medium text-slate-700 border-b border-slate-200 text-left"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection("faq")}
              className="py-4 text-lg font-medium text-slate-700 border-b border-slate-200 text-left"
            >
              FAQ
            </button>
          </div>
        </div>
      )}
    </>
  );
}
