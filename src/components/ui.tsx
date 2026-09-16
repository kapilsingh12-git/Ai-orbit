import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Category accents. Each category gets one hue, used only as a small icon tint
 * and a 1px left rule — never as a fill — so the page stays black and white
 * with colour used as an index rather than decoration.
 */
export const ACCENTS: Record<string, { text: string; ring: string; glow: string }> = {
  default: { text: "text-white", ring: "ring-white/15", glow: "bg-white/5" },
  violet: { text: "text-violet-400", ring: "ring-violet-400/20", glow: "bg-violet-400/10" },
  cyan: { text: "text-cyan-400", ring: "ring-cyan-400/20", glow: "bg-cyan-400/10" },
  amber: { text: "text-amber-400", ring: "ring-amber-400/20", glow: "bg-amber-400/10" },
  rose: { text: "text-rose-400", ring: "ring-rose-400/20", glow: "bg-rose-400/10" },
  emerald: { text: "text-emerald-400", ring: "ring-emerald-400/20", glow: "bg-emerald-400/10" },
};

export function accent(key?: string | null) {
  return ACCENTS[key ?? "default"] ?? ACCENTS.default;
}

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-line)] px-2.5 py-1 text-xs text-[var(--color-ink-muted)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: "Easy",
  MODERATE: "Moderate",
  ADVANCED: "Advanced",
};

export function DifficultyPill({ value }: { value: string }) {
  // Three filled bars out of three encode the level without needing a legend.
  const level = value === "EASY" ? 1 : value === "MODERATE" ? 2 : 3;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-ink-muted)]">
      <span className="flex items-end gap-0.5" aria-hidden>
        {[1, 2, 3].map((bar) => (
          <span
            key={bar}
            style={{ height: `${bar * 3 + 2}px` }}
            className={cn(
              "w-0.5 rounded-full",
              bar <= level ? "bg-white/70" : "bg-white/15",
            )}
          />
        ))}
      </span>
      {DIFFICULTY_LABEL[value] ?? value}
    </span>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-lg font-medium tabular-nums text-white">{value}</div>
      <div className="mt-0.5 text-xs text-[var(--color-ink-faint)]">{label}</div>
    </div>
  );
}

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4">
      <h2 className="text-lg font-medium text-white">{title}</h2>
      {action && (
        <Link
          href={action.href}
          className="text-sm text-[var(--color-ink-muted)] transition-colors hover:text-white"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
