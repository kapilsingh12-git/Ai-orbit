import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SubmitForm } from "./submit-form";

export const metadata: Metadata = {
  title: "Suggest a task",
  description: "Suggest an AI task that's missing from the catalogue.",
};

export default async function SubmitPage({
  searchParams,
}: {
  searchParams: Promise<{ task?: string }>;
}) {
  const [{ task }, categories] = await Promise.all([
    searchParams,
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { slug: true, name: true },
    }),
  ]);

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
            Suggest a task
          </li>
        </ol>
      </nav>

      <div className="max-w-xl">
        <h1 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
          Suggest a task
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
          Tasks are jobs people are trying to get done, not product categories.
          &ldquo;Remove image background&rdquo; is a task; &ldquo;image
          tools&rdquo; is not. Submissions go into a review queue.
        </p>

        <div className="mt-10">
          <SubmitForm categories={categories} prefillNote={task} />
        </div>
      </div>
    </div>
  );
}
