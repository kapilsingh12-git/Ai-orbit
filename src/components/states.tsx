import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Empty and error states share one shell. Copy rule: say what happened and what
 * to do next — never apologise, never leave the person without an action.
 */
export function StateBlock({
  icon,
  title,
  body,
  action,
  secondary,
}: {
  icon?: ReactNode;
  title: string;
  body: string;
  action?: { label: string; href: string };
  secondary?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-[var(--color-line)] px-6 py-16 text-center">
      {icon && (
        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-ink-muted)]">
          {icon}
        </span>
      )}
      <h2 className="text-base font-medium text-white">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {body}
      </p>
      {action && (
        <Link
          href={action.href}
          className="mt-6 rounded-[var(--radius-control)] bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
        >
          {action.label}
        </Link>
      )}
      {secondary && <div className="mt-4">{secondary}</div>}
    </div>
  );
}

export function TaskCardSkeleton({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="flex items-center gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
        <div className="skeleton h-10 w-10 shrink-0 rounded-[var(--radius-control)]" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-48" />
          <div className="skeleton h-3 w-72 max-w-full" />
        </div>
        <div className="skeleton hidden h-3 w-16 sm:block" />
      </div>
    );
  }
  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      <div className="skeleton h-10 w-10 rounded-[var(--radius-control)]" />
      <div className="skeleton mt-4 h-4 w-3/4" />
      <div className="skeleton mt-3 h-3 w-full" />
      <div className="skeleton mt-2 h-3 w-5/6" />
      <div className="mt-6 flex justify-between">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-24" />
      </div>
    </div>
  );
}

export function TaskCollectionSkeleton({
  view = "grid",
  count = 9,
}: {
  view?: "grid" | "list";
  count?: number;
}) {
  return (
    <div
      className={
        view === "list"
          ? "flex flex-col gap-2"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} view={view} />
      ))}
    </div>
  );
}
