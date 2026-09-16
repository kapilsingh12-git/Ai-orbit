"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = { slug: string; name: string; count: number };

const SORT_OPTIONS = [
  ["popular", "Most popular"],
  ["tools", "Most tools"],
  ["newest", "Newest"],
  ["az", "A–Z"],
] as const;

const DIFFICULTY_OPTIONS = [
  ["EASY", "Easy"],
  ["MODERATE", "Moderate"],
  ["ADVANCED", "Advanced"],
] as const;

export function FilterBar({
  categories,
  total,
}: {
  categories: Category[];
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const q = params.get("q") ?? "";
  const [draft, setDraft] = useState(q);
  const firstRender = useRef(true);

  /** Writes params to the URL. `page` always resets unless explicitly set. */
  const apply = useCallback(
    (next: Record<string, string | null>) => {
      const search = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(next)) {
        if (value === null || value === "") search.delete(key);
        else search.set(key, value);
      }
      if (!("page" in next)) search.delete("page");

      const qs = search.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [params, pathname, router],
  );

  // Debounce typing so we aren't pushing a history entry per keystroke.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (draft === q) return;
    const timer = setTimeout(() => apply({ q: draft || null }), 300);
    return () => clearTimeout(timer);
  }, [draft, q, apply]);

  // Keep the input in sync when the URL changes from elsewhere (e.g. "clear all").
  useEffect(() => setDraft(q), [q]);

  const activeCategory = params.get("category");
  const activeDifficulty = params.get("difficulty");
  const trending = params.get("trending") === "1";
  const sort = params.get("sort") ?? "popular";
  const view = params.get("view") === "list" ? "list" : "grid";
  const hasFilters = Boolean(q || activeCategory || activeDifficulty || trending);

  return (
    <div className={cn("transition-opacity", pending && "opacity-60")}>
      {/* row 1 — search + view */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-faint)]"
            aria-hidden
          />
          <input
            type="search"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search tasks or tools…"
            aria-label="Search tasks"
            className="h-11 w-full rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-surface)] pl-10 pr-10 text-sm text-white placeholder:text-[var(--color-ink-faint)] focus:border-[var(--color-line-strong)] focus:outline-none"
          />
          {draft && (
            <button
              type="button"
              onClick={() => setDraft("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-faint)] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          className="flex h-11 shrink-0 items-center rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-surface)] p-1"
          role="group"
          aria-label="View mode"
        >
          {(
            [
              ["grid", LayoutGrid, "Grid view"],
              ["list", List, "List view"],
            ] as const
          ).map(([value, Icon, label]) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={view === value}
              onClick={() => apply({ view: value === "grid" ? null : value, page: params.get("page") })}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                view === value
                  ? "bg-white/10 text-white"
                  : "text-[var(--color-ink-faint)] hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* row 2 — categories */}
      <div className="mt-4 -mx-5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2">
          <FilterChip
            active={!activeCategory}
            onClick={() => apply({ category: null })}
            label="All"
            count={total}
          />
          {categories.map((c) => (
            <FilterChip
              key={c.slug}
              active={activeCategory === c.slug}
              onClick={() =>
                apply({ category: activeCategory === c.slug ? null : c.slug })
              }
              label={c.name}
              count={c.count}
            />
          ))}
        </div>
      </div>

      {/* row 3 — refinements */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Select
          label="Difficulty"
          value={activeDifficulty ?? ""}
          options={DIFFICULTY_OPTIONS}
          placeholder="Any difficulty"
          onChange={(value) => apply({ difficulty: value || null })}
        />
        <Select
          label="Sort"
          value={sort}
          options={SORT_OPTIONS}
          onChange={(value) => apply({ sort: value === "popular" ? null : value })}
        />
        <button
          type="button"
          aria-pressed={trending}
          onClick={() => apply({ trending: trending ? null : "1" })}
          className={cn(
            "h-9 rounded-[var(--radius-pill)] border px-3.5 text-sm transition-colors",
            trending
              ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
              : "border-[var(--color-line)] text-[var(--color-ink-muted)] hover:border-[var(--color-line-strong)] hover:text-white",
          )}
        >
          Trending only
        </button>

        {hasFilters && (
          <button
            type="button"
            onClick={() =>
              apply({ q: null, category: null, difficulty: null, trending: null })
            }
            className="h-9 px-2 text-sm text-[var(--color-ink-faint)] underline-offset-4 hover:text-white hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-9 items-center gap-2 rounded-[var(--radius-pill)] border px-3.5 text-sm whitespace-nowrap transition-colors",
        active
          ? "border-white bg-white text-black"
          : "border-[var(--color-line)] text-[var(--color-ink-muted)] hover:border-[var(--color-line-strong)] hover:text-white",
      )}
    >
      {label}
      <span
        className={cn(
          "text-xs tabular-nums",
          active ? "text-black/50" : "text-[var(--color-ink-faint)]",
        )}
      >
        {count}
      </span>
    </button>
  );
}

function Select({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: ReadonlyArray<readonly [string, string]>;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-[var(--radius-pill)] border border-[var(--color-line)] bg-[var(--color-surface)] pl-3.5 pr-9 text-sm text-white transition-colors hover:border-[var(--color-line-strong)] focus:border-[var(--color-line-strong)] focus:outline-none"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 12 12"
        className="pointer-events-none absolute right-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 text-[var(--color-ink-faint)]"
        aria-hidden
      >
        <path d="M2 4.5 6 8.5 10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </label>
  );
}
