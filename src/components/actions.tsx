"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Both buttons update optimistically and roll back on failure. A 401 sends the
 * person to sign-in with a return path rather than silently doing nothing.
 */

function useMutation(signInReturnTo: string) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function run(url: string, body: unknown, onFail: () => void) {
    setError(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        onFail();
        router.push(`/login?next=${encodeURIComponent(signInReturnTo)}`);
        return;
      }
      if (!res.ok) {
        onFail();
        setError("That didn't save. Try again.");
        return;
      }
      startTransition(() => router.refresh());
    } catch {
      onFail();
      setError("You appear to be offline. Try again when you reconnect.");
    }
  }

  return { run, pending, error };
}

export function UpvoteButton({
  taskToolId,
  initialCount,
  initialVoted,
  returnTo,
}: {
  taskToolId: string;
  initialCount: number;
  initialVoted: boolean;
  returnTo: string;
}) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(initialVoted);
  const { run, error } = useMutation(returnTo);

  async function toggle() {
    const prevCount = count;
    const prevVoted = voted;
    setVoted(!prevVoted);
    setCount(prevCount + (prevVoted ? -1 : 1));

    await run("/api/votes", { taskToolId }, () => {
      setVoted(prevVoted);
      setCount(prevCount);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={voted}
      aria-label={voted ? "Remove your upvote" : "Upvote this tool for this task"}
      title={error ?? undefined}
      className={cn(
        "flex h-14 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-[var(--radius-control)] border transition-colors",
        voted
          ? "border-white bg-white text-black"
          : "border-[var(--color-line)] text-[var(--color-ink-muted)] hover:border-[var(--color-line-strong)] hover:text-white",
      )}
    >
      <ChevronUp className="h-4 w-4" strokeWidth={2.25} />
      <span className="text-xs font-medium tabular-nums">{count}</span>
    </button>
  );
}

export function SaveButton({
  taskId,
  initialSaved,
  returnTo,
}: {
  taskId: string;
  initialSaved: boolean;
  returnTo: string;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const { run, error } = useMutation(returnTo);

  async function toggle() {
    const prev = saved;
    setSaved(!prev);
    await run("/api/saved", { taskId }, () => setSaved(prev));
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-[var(--radius-control)] border px-4 text-sm transition-colors",
          saved
            ? "border-white bg-white text-black"
            : "border-[var(--color-line)] text-white hover:border-[var(--color-line-strong)] hover:bg-white/5",
        )}
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
        {saved ? "Saved" : "Save task"}
      </button>
      {error && <span className="text-xs text-rose-400">{error}</span>}
    </div>
  );
}
