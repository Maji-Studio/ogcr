"use client";

/**
 * Global error boundary
 * Catches unhandled errors from pages and layouts below the root layout
 */
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging; digest links to server logs
    console.error("Unhandled route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="title-heading-1 mb-m">Something went wrong</h1>
        <p className="body-large mb-l text-[var(--color-text-secondary)]">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-block rounded-lg bg-[var(--clr-dark-purple)] px-l py-m text-white hover:opacity-90"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
