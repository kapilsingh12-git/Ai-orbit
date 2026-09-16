import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";
import { TaskCollection } from "@/components/task-card";
import { StateBlock } from "@/components/states";
import { plural } from "@/lib/utils";

export const metadata: Metadata = { title: "Saved tasks" };

export default async function SavedPage() {
  const userId = await currentUserId();
  if (!userId) redirect("/login?next=/saved");

  const saved = await prisma.savedTask.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      task: {
        include: { category: { select: { name: true, slug: true, accent: true } } },
      },
    },
  });

  return (
    <div className="container-page py-10 lg:py-14">
      <h1 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
        Saved tasks
      </h1>
      <p className="mt-3 text-sm text-[var(--color-ink-faint)]">
        {plural(saved.length, "task")}
      </p>

      <div className="mt-10">
        {saved.length === 0 ? (
          <StateBlock
            icon={<Bookmark className="h-5 w-5" />}
            title="Nothing saved yet"
            body="Save a task from its page and it lands here, so you can come back to the tool comparison later."
            action={{ label: "Browse tasks", href: "/tasks" }}
          />
        ) : (
          <TaskCollection tasks={saved.map((s) => s.task)} view="grid" />
        )}
      </div>
    </div>
  );
}
