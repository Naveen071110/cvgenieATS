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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 backdrop-blur-md border-b border-gray-200 ${
        isScrolled ? "bg-white/90" : "bg-white/80"
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <span className="text-card-title text-primary">CVGenie</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/generator"
                className="text-body transition-colors text-gray-600 hover:text-primary"
              >
                Generator
              </Link>
              <button 
                onClick={() => scrollToSection("features")}
                className="text-body transition-colors text-gray-600 hover:text-primary"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="text-body transition-colors text-gray-600 hover:text-primary"
              >
                Pricing
              </button>
              
              {/* Auth Section */}
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-700">{user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthDialog({
                    title: "Sign In",
                    description: "Access your account to manage your generations."
                  })}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/generator"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Generator
              </Link>
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
              >
                Pricing
              </button>
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isLoading ? (
                  <div className="px-3 py-2">
                    <div className="w-full h-8 rounded bg-gray-200 animate-pulse"></div>
                  </div>
                ) : user ? (
                  <div className="px-3 py-2 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-700">{user.email}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start text-gray-600 hover:text-gray-900"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        openAuthDialog({
                          title: "Sign In",
                          description: "Access your account to manage your generations."
                        });
                        setIsMenuOpen(false);
                      }}
                      className="w-full justify-start text-gray-700 border-gray-300 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <LoginDialog
        open={isOpen}
        onOpenChange={closeAuthDialog}
        title={dialogConfig.title}
        description={dialogConfig.description}
      />
    </>
  );
}