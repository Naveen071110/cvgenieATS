import { createContext, useContext, useEffect, useState } from "react";
import { getCookie, setCookie } from "@/lib/cookies/client";
import { KNOWN_COOKIE_KEYS } from "../../../shared/cookies/types";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    
    // Check cookie first, fallback to localStorage
    const cookieTheme = getCookie<Theme>(KNOWN_COOKIE_KEYS.THEME);
    if (cookieTheme === 'light' || cookieTheme === 'dark') return cookieTheme;

    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Set both cookie (if functional consent allowed) and localStorage fallback
    setCookie(KNOWN_COOKIE_KEYS.THEME, theme, { maxAge: 365 * 24 * 60 * 60 });
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
