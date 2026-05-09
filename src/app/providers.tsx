"use client";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/lib/context/AuthContext";
import { BlockProvider } from "@/lib/context/BlockContext";

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
