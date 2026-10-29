"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDarkMode: boolean;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initialize theme from storage/system preference.
  // The <html> class itself is set pre-paint by the inline script in the
  // root layout, so this only syncs React state with what's already applied.
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem("theme") as Theme | null;
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      if (storedTheme === "dark" || storedTheme === "light") {
        setTheme(storedTheme);
      } else {
        setTheme(prefersDark ? "dark" : "light");
      }
    } catch {
      setTheme("light");
    }
    setMounted(true);
  }, []);

  // Watch system theme changes (only while the user has no explicit choice)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      let hasStoredTheme = false;
      try {
        hasStoredTheme = !!localStorage.getItem("theme");
      } catch {
        hasStoredTheme = false;
      }
      if (hasStoredTheme) return;

      const next: Theme = e.matches ? "dark" : "light";
      setTheme(next);
      document.documentElement.classList.toggle("dark", next === "dark");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const newTheme: Theme = prevTheme === "light" ? "dark" : "light";
      try {
        localStorage.setItem("theme", newTheme);
      } catch {
        // Ignore localStorage errors
      }
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      return newTheme;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      isDarkMode: theme === "dark",
      mounted,
    }),
    [theme, toggleTheme, mounted],
  );

  // Children are always rendered so pages are server-rendered normally;
  // consumers use `mounted` to avoid hydration-sensitive UI.
  return (
    <ThemeContext.Provider value={contextValue}>
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
