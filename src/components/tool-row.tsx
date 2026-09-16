import { ExternalLink, Star } from "lucide-react";
import { UpvoteButton } from "./actions";
import { Badge } from "./ui";

const PRICING_LABEL: Record<string, string> = {
  FREE: "Free",
  FREEMIUM: "Freemium",
  PAID: "Paid",
  ENTERPRISE: "Enterprise",
};

const KIND_LABEL: Record<string, string> = {
  TOOL: "Tool",
  MODEL: "Model",
  AGENT: "Agent",
  DEVICE: "Device",
};

export type ToolRowData = {
  id: string;
  upvotes: number;
  note: string | null;
  voted: boolean;
  tool: {
    slug: string;
    name: string;
    tagline: string;
    websiteUrl: string;
    pricing: string;
    kind: string;
    platforms: string[];
    rating: number;
  };
};

/**
 * Rank is shown as a number because this list genuinely is an ordered ranking —
 * the position is the information, not decoration.
 */
export function ToolRow({
  row,
  rank,
  returnTo,
}: {
  row: ToolRowData;
  rank: number;
  returnTo: string;
}) {
  return (
    <li className="flex gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition-colors hover:border-[var(--color-line-strong)] sm:p-5">
      <UpvoteButton
        taskToolId={row.id}
        initialCount={row.upvotes}
        initialVoted={row.voted}
        returnTo={returnTo}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-xs tabular-nums text-[var(--color-ink-faint)]">
            {String(rank).padStart(2, "0")}
          </span>
          <h3 className="font-medium text-white">{row.tool.name}</h3>
          <span className="inline-flex items-center gap-1 text-xs text-[var(--color-ink-muted)]">
            <Star className="h-3 w-3 fill-current text-amber-400" />
            {row.tool.rating.toFixed(1)}
          </span>
        </div>

        <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          {row.tool.tagline}
        </p>

        {row.note && (
          <p className="mt-3 border-l border-[var(--color-line-strong)] pl-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {row.note}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>{PRICING_LABEL[row.tool.pricing] ?? row.tool.pricing}</Badge>
          <Badge>{KIND_LABEL[row.tool.kind] ?? row.tool.kind}</Badge>
          {row.tool.platforms.slice(0, 3).map((p) => (
            <Badge key={p}>{p}</Badge>
          ))}
          <a
            href={row.tool.websiteUrl}
            target="_blank"
            rel="noreferrer noopener nofollow"
            className="ml-auto inline-flex items-center gap-1.5 text-sm text-white underline-offset-4 hover:underline"
          >
            Visit site
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </li>
  );
}
