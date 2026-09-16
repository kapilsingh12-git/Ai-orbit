import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { TaskCollection } from "@/components/task-card";
import { StateBlock } from "@/components/states";
import { accent } from "@/components/ui";
import { TaskIcon } from "@/components/task-icon";
import { plural } from "@/lib/utils";

export async function generateStaticParams() {
  const categories = await prisma.category.findMany({ select: { slug: true } });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} tasks`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      tasks: {
        orderBy: { viewCount: "desc" },
        include: { category: { select: { name: true, slug: true, accent: true } } },
      },
    },
  });

  if (!category) notFound();
  const a = accent(category.accent);

  return (
    <div className="container-page py-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center gap-1.5 text-sm text-[var(--color-ink-faint)]">
          <li>
            <Link href="/tasks" className="transition-colors hover:text-white">
              Tasks
            </Link>
          </li>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          <li aria-current="page" className="text-[var(--color-ink-muted)]">
            {category.name}
          </li>
        </ol>
      </nav>

      <header className="flex items-start gap-4">
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-card)] ring-1 ${a.glow} ${a.ring} ${a.text}`}
        >
          <TaskIcon name={category.icon} className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[var(--color-ink-muted)]">
            {category.description}
          </p>
        </div>
      </header>

      <p className="mt-10 mb-5 text-sm text-[var(--color-ink-faint)]">
        {plural(category.tasks.length, "task")}
      </p>

      {category.tasks.length === 0 ? (
        <StateBlock
          title="Nothing in this category yet"
          body="Tasks get added here as the catalogue grows. Suggest one if you know a job this category is missing."
          action={{ label: "Suggest a task", href: "/tasks/submit" }}
        />
      ) : (
        <TaskCollection tasks={category.tasks} view="grid" />
      )}
    </div>
  );
}
