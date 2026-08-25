import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

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

  const closeLogin = useCallback(() => {
    setShowLogin(false);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    requireAuthThenNavigate,
    requireAuthThenAction,
    showLogin,
    setShowLogin,
    closeLogin,
    pendingDestination,
  };
}
