import { useState, useEffect } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuthDialog } from "@/hooks/useAuthDialog";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "@/components/ThemeToggle";

interface SubscriptionStatus {
  isPro: boolean;
  subscriptionStatus: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut, isLoading } = useAuth();
  const { isOpen, openAuthDialog, closeAuthDialog, dialogConfig } = useAuthDialog();

  // Check subscription status for Pro features
  const { data: subscriptionStatus } = useQuery<SubscriptionStatus>({
    queryKey: ["/api/subscription/status"],
    enabled: !!user,
    retry: false,
  });

  const isPro = subscriptionStatus?.isPro && subscriptionStatus?.subscriptionStatus === 'active';

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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 ${
        isScrolled ? "bg-white/90 dark:bg-gray-900/90" : "bg-white/80 dark:bg-gray-900/80"
      }`}>
        <nav 
          style={{ 
            maxWidth: 'var(--container-2xl)',
            margin: '0 auto',
            paddingLeft: 'var(--space-4)',
            paddingRight: 'var(--space-4)'
          }}
          aria-label="Main navigation"
        >
          <div 
            className="flex items-center justify-between"
            style={{ height: 'var(--space-16)' }}
          >
            {/* Logo */}
            <div 
              className="flex items-center"
              style={{ gap: 'var(--space-2)' }}
            >
              <div 
                className="rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
                style={{ 
                  width: 'var(--space-8)',
                  height: 'var(--space-8)'
                }}
                role="img"
                aria-label="CVGenie logo"
              >
                <span className="text-white font-bold text-lg">CV</span>
              </div>
              <span className="text-card-title text-primary dark:text-blue-400">CVGenie</span>
            </div>

            {/* Navigation Links */}
            <div 
              className="hidden md:flex items-center"
              style={{ gap: 'var(--space-8)' }}
            >
              <Link 
                to="/generator"
                className="text-body transition-colors text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400"
                aria-label="Go to Generator page"
              >
                Generator
              </Link>
              {user && isPro && (
                <Link 
                  to="/resume-history"
                  className="text-body transition-colors text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400"
                  aria-label="Go to Resume History page"
                  data-testid="link-resume-history"
                >
                  Resume History
                </Link>
              )}
              <button 
                onClick={() => scrollToSection("features")}
                className="text-body transition-colors text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400"
                aria-label="Scroll to Features section"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection("pricing")}
                className="text-body transition-colors text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400"
                aria-label="Scroll to Pricing section"
              >
                Pricing
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Section */}
              {isLoading ? (
                <div 
                  className="rounded-full bg-gray-200 animate-pulse"
                  style={{ 
                    width: 'var(--space-8)',
                    height: 'var(--space-8)'
                  }}
                  role="img"
                  aria-label="Loading user profile"
                ></div>
              ) : user ? (
                <div 
                  className="flex items-center"
                  style={{ gap: 'var(--space-3)' }}
                >
                  <div 
                    className="flex items-center"
                    style={{ gap: 'var(--space-2)' }}
                  >
                    <div 
                      className="rounded-full bg-primary text-white flex items-center justify-center"
                      style={{ 
                        width: 'var(--space-8)',
                        height: 'var(--space-8)'
                      }}
                      role="img"
                      aria-label="User avatar"
                    >
                      <User 
                        style={{ 
                          width: 'var(--space-4)',
                          height: 'var(--space-4)'
                        }}
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{user.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    aria-label="Sign Out"
                  >
                    <LogOut 
                      style={{ 
                        width: 'var(--space-4)',
                        height: 'var(--space-4)',
                        marginRight: 'var(--space-1)'
                      }}
                      aria-hidden="true"
                    />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openAuthDialog({
                      title: "Sign In",
                      description: "Access your account to manage your generations."
                    })}
                    className="text-gray-700 border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
                    aria-label="Sign In"
                  >
                    <User 
                      style={{ 
                        width: 'var(--space-4)',
                        height: 'var(--space-4)',
                        marginRight: 'var(--space-1)'
                      }}
                      aria-hidden="true"
                    />
                    Sign In
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                aria-label="Toggle navigation menu"
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
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
            <div 
              style={{ 
                padding: 'var(--space-2)',
                paddingTop: 'var(--space-2)',
                paddingBottom: 'var(--space-3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-1)'
              }}
            >
              <Link
                to="/generator"
                className="block rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{ padding: 'var(--space-3)' }}
                onClick={() => setIsMenuOpen(false)}
                aria-label="Go to Generator page"
              >
                Generator
              </Link>
              {user && isPro && (
                <Link
                  to="/resume-history"
                  className="block rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  style={{ padding: 'var(--space-3)' }}
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Go to Resume History page"
                  data-testid="link-resume-history-mobile"
                >
                  Resume History
                </Link>
              )}
              <button
                onClick={() => scrollToSection("features")}
                className="block w-full text-left rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{ padding: 'var(--space-3)' }}
                aria-label="Scroll to Features section"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="block w-full text-left rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{ padding: 'var(--space-3)' }}
                aria-label="Scroll to Pricing section"
              >
                Pricing
              </button>

              {/* Mobile Theme Toggle */}
              <div 
                className="flex items-center justify-between rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{ padding: 'var(--space-3)' }}
              >
                <span className="text-base font-medium text-gray-600 dark:text-gray-300">Theme</span>
                <ThemeToggle />
              </div>

              {/* Mobile Auth Section */}
              <div 
                className="border-t border-gray-200 dark:border-gray-700"
                style={{ 
                  paddingTop: 'var(--space-4)',
                  marginTop: 'var(--space-4)'
                }}
              >
                {isLoading ? (
                  <div style={{ padding: 'var(--space-3)' }}>
                    <div 
                      className="w-full rounded bg-gray-200 animate-pulse"
                      style={{ height: 'var(--space-8)' }}
                      role="img"
                      aria-label="Loading user profile"
                    ></div>
                  </div>
                ) : user ? (
                  <div 
                    style={{ 
                      padding: 'var(--space-3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-3)'
                    }}
                  >
                    <div 
                      className="flex items-center"
                      style={{ gap: 'var(--space-3)' }}
                    >
                      <div 
                        className="rounded-full bg-primary text-white flex items-center justify-center"
                        style={{ 
                          width: 'var(--space-8)',
                          height: 'var(--space-8)'
                        }}
                        role="img"
                        aria-label="User avatar"
                      >
                        <User 
                          style={{ 
                            width: 'var(--space-4)',
                            height: 'var(--space-4)'
                          }}
                          aria-hidden="true"
                        />
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
                      aria-label="Sign Out"
                    >
                      <LogOut 
                        style={{ 
                          width: 'var(--space-4)',
                          height: 'var(--space-4)',
                          marginRight: 'var(--space-2)'
                        }}
                        aria-hidden="true"
                      />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div style={{ padding: 'var(--space-3)' }}>
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
                      aria-label="Sign In"
                    >
                      <User 
                        style={{ 
                          width: 'var(--space-4)',
                          height: 'var(--space-4)',
                          marginRight: 'var(--space-2)'
                        }}
                        aria-hidden="true"
                      />
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