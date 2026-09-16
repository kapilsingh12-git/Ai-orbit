import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight, Eye, Bookmark, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";
import { getRelatedTasks, getTaskBySlug } from "@/lib/tasks";
import { TaskIcon } from "@/components/task-icon";
import { DifficultyPill, SectionHeading, Stat, accent } from "@/components/ui";
import { ToolRow } from "@/components/tool-row";
import { SaveButton } from "@/components/actions";
import { FaqList } from "@/components/faq";
import { TaskCollection } from "@/components/task-card";
import { StateBlock } from "@/components/states";
import { compactNumber, plural } from "@/lib/utils";

const PRICING_FILTERS = [
  ["", "All pricing"],
  ["FREE", "Free"],
  ["FREEMIUM", "Freemium"],
  ["PAID", "Paid"],
  ["ENTERPRISE", "Enterprise"],
] as const;

export async function generateStaticParams() {
  const tasks = await prisma.task.findMany({ select: { slug: true } });
  return tasks.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const task = await prisma.task.findUnique({
    where: { slug },
    select: { name: true, summary: true, toolCount: true },
  });
  if (!task) return { title: "Task not found" };

  return {
    title: task.name,
    description: `${task.summary} Compare ${plural(task.toolCount, "AI tool")} for this task.`,
    alternates: { canonical: `/tasks/${slug}` },
  };
}

export default async function TaskDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  const userId = await currentUserId();
  const task = await getTaskBySlug(slug, userId ?? undefined);

  if (!task) notFound();

  // Fire-and-forget: a failed counter update must never fail the page render.
  prisma.task
    .update({ where: { id: task.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});

  const related = await getRelatedTasks(task.id, task.categoryId);
  const a = accent(task.category.accent);
  const returnTo = `/tasks/${slug}`;

  const pricing = typeof search.pricing === "string" ? search.pricing : "";
  const rows = task.tools.filter(
    (row) => !pricing || row.tool.pricing === pricing,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: task.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="container-page py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-ink-faint)]">
          <li>
            <Link href="/tasks" className="transition-colors hover:text-white">
              Tasks
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <li>
            <Link
              href={`/tasks/category/${task.category.slug}`}
              className="transition-colors hover:text-white"
            >
              {task.category.name}
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <li aria-current="page" className="text-[var(--color-ink-muted)]">
            {task.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {/* hero */}
          <header>
            <div className="flex items-start gap-4">
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-card)] ring-1 ${a.glow} ${a.ring} ${a.text}`}
              >
                <TaskIcon name={task.icon} className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h1 className="text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl">
                  {task.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Link
                    href={`/tasks/category/${task.category.slug}`}
                    className={`text-sm ${a.text} underline-offset-4 hover:underline`}
                  >
                    {task.category.name}
                  </Link>
                  <DifficultyPill value={task.difficulty} />
                  {task.isTrending && (
                    <span className="text-sm text-amber-400">Trending this week</span>
                  )}
                </div>
              </div>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              {task.description}
            </p>

            <div className="mt-7 lg:hidden">
              <SaveButton
                taskId={task.id}
                initialSaved={Array.isArray(task.saves) && task.saves.length > 0}
                returnTo={returnTo}
              />
            </div>
          </header>

          {/* tools */}
          <section className="mt-14">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="text-lg font-medium text-white">
                Tools for this task
              </h2>
              <span className="text-sm text-[var(--color-ink-faint)]">
                Ranked by community upvotes
              </span>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {PRICING_FILTERS.map(([value, label]) => {
                const active = pricing === value;
                return (
                  <Link
                    key={label}
                    href={value ? `?pricing=${value}` : "?"}
                    scroll={false}
                    aria-current={active ? "true" : undefined}
                    className={`h-9 rounded-[var(--radius-pill)] border px-3.5 text-sm leading-[2.1] transition-colors ${
                      active
                        ? "border-white bg-white text-black"
                        : "border-[var(--color-line)] text-[var(--color-ink-muted)] hover:border-[var(--color-line-strong)] hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>

            {rows.length === 0 ? (
              <StateBlock
                icon={<Wrench className="h-5 w-5" />}
                title="No tools at this price point"
                body="Nothing listed under this task matches that pricing model yet. Clearing the filter shows every option."
                action={{ label: "Show all pricing", href: `/tasks/${slug}` }}
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {rows.map((row, i) => (
                  <ToolRow
                    key={row.id}
                    rank={i + 1}
                    returnTo={returnTo}
                    row={{
                      id: row.id,
                      upvotes: row.upvotes,
                      note: row.note,
                      voted: Array.isArray(row.votes) && row.votes.length > 0,
                      tool: row.tool,
                    }}
                  />
                ))}
              </ul>
            )}
          </section>

          {/* faq */}
          {task.faqs.length > 0 && (
            <section className="mt-16">
              <SectionHeading title="Common questions" />
              <FaqList items={task.faqs} />
            </section>
          )}
        </div>

        {/* sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <div className="grid grid-cols-3 gap-4">
              <Stat label="Tools" value={String(task.toolCount)} />
              <Stat label="Views" value={compactNumber(task.viewCount)} />
              <Stat label="Saves" value={compactNumber(task.saveCount)} />
            </div>
            <div className="mt-5 hidden lg:block">
              <SaveButton
                taskId={task.id}
                initialSaved={Array.isArray(task.saves) && task.saves.length > 0}
                returnTo={returnTo}
              />
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-[var(--color-ink-faint)]">
              <Eye className="h-3.5 w-3.5" />
              Updated{" "}
              {task.updatedAt.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="mt-4 rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
            <h2 className="text-sm font-medium text-white">Missing a tool?</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              Suggest one and it goes into the review queue for this task.
            </p>
            <Link
              href={`/tasks/submit?task=${task.slug}`}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-[var(--radius-control)] border border-[var(--color-line)] px-3.5 text-sm text-white transition-colors hover:border-[var(--color-line-strong)] hover:bg-white/5"
            >
              <Bookmark className="h-3.5 w-3.5" />
              Suggest a tool
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <SectionHeading
            title={`More in ${task.category.name}`}
            action={{
              label: "View category",
              href: `/tasks/category/${task.category.slug}`,
            }}
          />
          <TaskCollection tasks={related} view="grid" />
        </section>
      )}

      {task.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </div>
  );
}
