import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuthDialog } from "@/hooks/useAuthDialog";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const { isOpen, openAuthDialog, closeAuthDialog, dialogConfig } = useAuthDialog();

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
              <span className="typography-subheader text-primary">CVGenie</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/generator"
                className="typography-body text-slate-600 hover:text-primary transition-colors"
              >
                Generator
              </Link>
              <button 
                onClick={() => scrollToSection("features")}
                className="typography-body text-slate-600 hover:text-primary transition-colors"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="typography-body text-slate-600 hover:text-primary transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection("faq")}
                className="typography-body text-slate-600 hover:text-primary transition-colors"
              >
                FAQ
              </button>

              {/* Auth Section */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-600" />
                    <span className="text-sm text-slate-600">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    disabled={isLoading}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => openAuthDialog()}
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Sign In
                </Button>
              )}
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
              How it Works
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

            {/* Mobile Auth Section */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-600" />
                    <span className="text-sm text-slate-600">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={signOut}
                    disabled={isLoading}
                    className="w-full justify-start text-slate-600 hover:text-slate-900"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    openAuthDialog();
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginDialog 
        open={isOpen} 
        onOpenChange={closeAuthDialog}
        title={dialogConfig.title}
        description={dialogConfig.description}
      />
    </>
  );
}