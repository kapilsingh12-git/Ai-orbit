"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with your reporter (Sentry, Axiom) in production.
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-24">
      <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] px-6 py-16 text-center">
        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink-muted)]">
          <TriangleAlert className="h-5 w-5" />
        </span>
        <h1 className="text-base font-medium text-white">
          Something broke while loading this page
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-ink-muted)]">
          The request didn't complete. Trying again usually works; if it keeps
          failing, the data source may be down.
        </p>
        {error.digest && (
          <code className="mt-4 rounded bg-[var(--color-surface)] px-2 py-1 font-mono text-xs text-[var(--color-ink-faint)]">
            {error.digest}
          </code>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-[var(--radius-control)] bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
