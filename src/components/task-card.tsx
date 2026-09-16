import Link from "next/link";
import { ArrowUpRight, Flame } from "lucide-react";
import type { TaskListItem } from "@/lib/tasks";
import { TaskIcon } from "./task-icon";
import { DifficultyPill, accent } from "./ui";
import { compactNumber, plural } from "@/lib/utils";

/**
 * One card, two layouts. Grid and list render the same fields in a different
 * arrangement rather than exposing different information, so switching views
 * never hides something the user was relying on.
 */
export function TaskCard({
  task,
  view,
}: {
  task: TaskListItem;
  view: "grid" | "list";
}) {
  const a = accent(task.category.accent);

  if (view === "list") {
    return (
      <li>
        <Link
          href={`/tasks/${task.slug}`}
          className="group flex items-start gap-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-4 transition-colors duration-200 hover:border-[var(--color-line-strong)] hover:bg-[var(--color-surface-raised)] sm:items-center sm:p-5"
        >
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] ring-1 ${a.glow} ${a.ring} ${a.text}`}
          >
            <TaskIcon name={task.icon} className="h-[18px] w-[18px]" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium text-white">{task.name}</h3>
              {task.isTrending && (
                <Flame className="h-3.5 w-3.5 shrink-0 text-amber-400" aria-label="Trending" />
              )}
            </div>
            <p className="mt-1 line-clamp-1 text-sm text-[var(--color-ink-muted)]">
              {task.summary}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-6 sm:flex">
            <span className={`text-xs ${a.text}`}>{task.category.name}</span>
            <DifficultyPill value={task.difficulty} />
            <span className="w-16 text-right text-sm tabular-nums text-[var(--color-ink-muted)]">
              {plural(task.toolCount, "tool")}
            </span>
            <ArrowUpRight className="h-4 w-4 text-[var(--color-ink-faint)] transition-colors group-hover:text-white" />
          </div>

          <span className="shrink-0 text-xs text-[var(--color-ink-faint)] sm:hidden">
            {task.toolCount}
          </span>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={`/tasks/${task.slug}`}
        className="group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5 transition-colors duration-200 hover:border-[var(--color-line-strong)] hover:bg-[var(--color-surface-raised)]"
      >
        <div className="flex items-start justify-between gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] ring-1 ${a.glow} ${a.ring} ${a.text}`}
          >
            <TaskIcon name={task.icon} className="h-[18px] w-[18px]" />
          </span>
          {task.isTrending && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-400">
              <Flame className="h-3.5 w-3.5" />
              Trending
            </span>
          )}
        </div>

        <h3 className="mt-4 font-medium leading-snug text-white">{task.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          {task.summary}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className={`text-xs ${a.text}`}>{task.category.name}</span>
          <span className="text-xs tabular-nums text-[var(--color-ink-faint)]">
            {plural(task.toolCount, "tool")} · {compactNumber(task.viewCount)} views
          </span>
        </div>
      </Link>
    </li>
  );
}

export function TaskCollection({
  tasks,
  view,
}: {
  tasks: TaskListItem[];
  view: "grid" | "list";
}) {
  if (view === "list") {
    return (
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} view="list" />
        ))}
      </ul>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} view="grid" />
      ))}
    </ul>
  );
}
