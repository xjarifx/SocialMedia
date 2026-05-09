"use client";

import { useEffect } from "react";

export default function MainError({
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
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <div className="text-4xl">!</div>
      <h1 className="text-lg font-bold text-text-primary">Something went wrong</h1>
      <p className="text-sm text-text-secondary">An unexpected error occurred in this section.</p>
      <button
        onClick={reset}
        className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Try again
      </button>
    </div>
  );
}
