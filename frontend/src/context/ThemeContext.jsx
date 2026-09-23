"use client";
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

const DEFAULT_THEME = Object.freeze({
  primaryColor: "#0077F5",
  secondaryColor: "#12151C",
  logoUrl: "/assets/logo/devnixpro-logo.png",
  fontFamily: "Inter",
});

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved) setTheme({ ...DEFAULT_THEME, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const updateTheme = useCallback((newTheme) => {
    setTheme((prev) => {
      const merged = { ...prev, ...newTheme };
      localStorage.setItem("theme", JSON.stringify(merged));
      return merged;
    });
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME);
    localStorage.removeItem("theme");
  }, []);

  const value = useMemo(
    () => ({ theme, updateTheme, resetTheme }),
    [theme, updateTheme, resetTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be inside ThemeProvider");
  return ctx;
}
