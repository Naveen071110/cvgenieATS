import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { LoginDialog } from "@/components/LoginDialog";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      const currentPath = window.location.pathname;
      localStorage.setItem("auth_redirect", currentPath);
      setShowLogin(true);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Sign in required
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please sign in to access this feature
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              Sign In
            </button>
          </div>
        </div>
        <LoginDialog
          open={showLogin}
          onOpenChange={(open) => {
            setShowLogin(open);
            if (!open && !user) {
              setLocation("/");
            }
          }}
          title="Sign in to continue"
          description="Access this feature by signing in to your account"
        />
      </>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
