"use client";

import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-4">
      <div className="text-4xl">!</div>
      <h1 className="text-xl font-bold text-text-primary">Something went wrong</h1>
      <p className="text-sm text-text-secondary">An unexpected error occurred.</p>
      <button
        onClick={reset}
        className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Try again
      </button>
    </div>
  );
}
