import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { LoginDialog } from "@/components/LoginDialog";

export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [showLogin, setShowLogin] = useState(false);
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);

  const requireAuthThenNavigate = useCallback((destination: string) => {
    if (user) {
      setLocation(destination);
    } else {
      localStorage.setItem("auth_redirect", destination);
      setPendingDestination(destination);
      setShowLogin(true);
    }
  }, [user, setLocation]);

  const requireAuthThenAction = useCallback((action: () => void) => {
    if (user) {
      action();
    } else {
      setShowLogin(true);
    }
  }, [user]);

  const AuthDialog = useCallback(() => (
    <LoginDialog
      open={showLogin}
      onOpenChange={(open) => {
        setShowLogin(open);
      }}
      title="Sign in to continue"
      description="Please sign in to access this feature"
    />
  ), [showLogin]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    requireAuthThenNavigate,
    requireAuthThenAction,
    showLogin,
    setShowLogin,
    AuthDialog,
  };
}
