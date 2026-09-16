import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Server-rendered pagination: real links, so it works without JS and is crawlable. */
export function Pagination({
  page,
  pageCount,
  buildHref,
}: {
  page: number;
  pageCount: number;
  buildHref: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  // Window of pages around the current one, with ellipses for the gaps.
  const pages: Array<number | "gap"> = [];
  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "gap") pages.push("gap");
  }

  const arrow =
    "flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-line)] transition-colors";

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} aria-label="Previous page" className={cn(arrow, "text-white hover:border-[var(--color-line-strong)] hover:bg-white/5")}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span aria-disabled className={cn(arrow, "text-[var(--color-ink-faint)] opacity-40")}>
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-[var(--color-ink-faint)]">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-[var(--radius-control)] border px-2 text-sm tabular-nums transition-colors",
              p === page
                ? "border-white bg-white text-black"
                : "border-[var(--color-line)] text-[var(--color-ink-muted)] hover:border-[var(--color-line-strong)] hover:text-white",
            )}
          >
            {p}
          </Link>
        ),
      )}

      {page < pageCount ? (
        <Link href={buildHref(page + 1)} aria-label="Next page" className={cn(arrow, "text-white hover:border-[var(--color-line-strong)] hover:bg-white/5")}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span aria-disabled className={cn(arrow, "text-[var(--color-ink-faint)] opacity-40")}>
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
