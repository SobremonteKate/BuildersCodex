import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "codexTheme";

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {}
  // Respect OS preference
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  // Sync theme to <html> for body background + swap favicon
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    // Swap favicon to match the current theme
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = theme === "light" ? "/favicon-light.svg" : "/favicon.svg";
    }
  }, [theme]);

  return { theme, setTheme, toggleTheme, isLight: theme === "light" };
}
