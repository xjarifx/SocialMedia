import { createContext, useEffect } from "react";

// Always use dark theme
const ThemeContext = createContext<undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Always set dark mode
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <ThemeContext.Provider value={undefined}>{children}</ThemeContext.Provider>
  );
}

// Hook for compatibility (no-op now)
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return { theme: "dark" as const };
}
