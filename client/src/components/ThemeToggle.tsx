import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      data-testid="button-theme-toggle"
    >
      <Sun
        className={`h-5 w-5 transition-all duration-200 ${
          theme === "light"
            ? "rotate-0 scale-100"
            : "rotate-90 scale-0 absolute"
        }`}
      />
      <Moon
        className={`h-5 w-5 transition-all duration-200 ${
          theme === "dark"
            ? "rotate-0 scale-100"
            : "-rotate-90 scale-0 absolute"
        }`}
      />
    </Button>
  );
}
