"use client";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { BlockProvider } from "@/context/BlockContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BlockProvider>
          {children}
        </BlockProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
