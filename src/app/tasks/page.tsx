import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import {
  getCategoriesWithCounts,
  getTasks,
  hasActiveFilters,
  parseTaskQuery,
  PAGE_SIZE,
} from "@/lib/tasks";
import { prisma } from "@/lib/prisma";
import { FilterBar } from "@/components/filter-bar";
import { TaskCollection } from "@/components/task-card";
import { Pagination } from "@/components/pagination";
import { StateBlock, TaskCollectionSkeleton } from "@/components/states";
import { buildQuery, compactNumber, plural } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tasks",
  description:
    "Browse AI tasks by category — tools, models, and devices for every use case.",
};

type SearchParams = Record<string, string | string[] | undefined>;

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const query = parseTaskQuery(params);

  const [categories, totals] = await Promise.all([
    getCategoriesWithCounts(),
    prisma.task.aggregate({ _count: true, _sum: { toolCount: true } }),
  ]);

  return (
    <div className="container-page py-10 lg:py-14">
      <Hero
        taskCount={totals._count}
        toolCount={totals._sum.toolCount ?? 0}
        categoryCount={categories.length}
      />

      <div className="mt-10">
        <FilterBar
          categories={categories.map((c) => ({
            slug: c.slug,
            name: c.name,
            count: c._count.tasks,
          }))}
          total={totals._count}
        />
      </div>

      {/* Keyed so a filter change re-suspends and shows skeletons rather than
          holding the previous results while the query runs. */}
      <Suspense
        key={JSON.stringify(query)}
        fallback={
          <div className="mt-8">
            <TaskCollectionSkeleton view={query.view} count={PAGE_SIZE} />
          </div>
        }
      >
        <Results params={params} />
      </Suspense>
    </div>
  );
}

function Hero({
  taskCount,
  toolCount,
  categoryCount,
}: {
  taskCount: number;
  toolCount: number;
  categoryCount: number;
}) {
  return (
    <div className="edge-lit max-w-3xl">
      <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-white sm:text-5xl">
        What do you want AI to do?
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--color-ink-muted)]">
        Start from the job rather than the tool. Every task lists the tools,
        models and devices people actually use for it, ranked by the community.
      </p>
      <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
        {[
          [compactNumber(taskCount), "tasks"],
          [compactNumber(toolCount), "tool listings"],
          [String(categoryCount), "categories"],
        ].map(([value, label]) => (
          <div key={label}>
            <dt className="sr-only">{label}</dt>
            <dd>
              <span className="text-2xl font-medium tabular-nums text-white">
                {value}
              </span>{" "}
              <span className="text-sm text-[var(--color-ink-faint)]">{label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

async function Results({ params }: { params: SearchParams }) {
  const query = parseTaskQuery(params);
  const { items, total, page, pageCount } = await getTasks(query);

  if (items.length === 0) {
    return (
      <div className="mt-8">
        <StateBlock
          icon={<SearchX className="h-5 w-5" />}
          title={
            hasActiveFilters(query)
              ? "No tasks match these filters"
              : "No tasks published yet"
          }
          body={
            hasActiveFilters(query)
              ? "Try removing a filter or searching for a tool name instead — searching matches the tools listed under each task."
              : "Tasks will appear here once the catalogue is populated. You can suggest one in the meantime."
          }
          action={
            hasActiveFilters(query)
              ? { label: "Clear filters", href: "/tasks" }
              : { label: "Suggest a task", href: "/tasks/submit" }
          }
        />
      </div>
    );
  }

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <>
      <p
        aria-live="polite"
        className="mt-8 mb-5 text-sm tabular-nums text-[var(--color-ink-faint)]"
      >
        {total > PAGE_SIZE
          ? `Showing ${from}–${to} of ${plural(total, "task")}`
          : plural(total, "task")}
      </p>

      <TaskCollection tasks={items} view={query.view} />

      <Pagination
        page={page}
        pageCount={pageCount}
        buildHref={(p) =>
          `/tasks${buildQuery(
            {
              q: query.q,
              category: query.category ?? undefined,
              difficulty: query.difficulty ?? undefined,
              trending: query.trending ? "1" : undefined,
              sort: query.sort,
              view: query.view,
              page: p,
            },
            { sort: "popular", view: "grid", page: 1 },
          )}`
        }
      />
    </>
  );
}
