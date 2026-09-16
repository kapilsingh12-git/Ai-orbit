import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";

const schema = z.object({ taskId: z.string().min(1) });

/** Toggles a saved task for the caller, keeping Task.saveCount in step. */
export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to save tasks." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "taskId is required." }, { status: 400 });
  }

  const { taskId } = parsed.data;

  const task = await prisma.task.findUnique({ where: { id: taskId }, select: { id: true } });
  if (!task) {
    return NextResponse.json({ error: "That task no longer exists." }, { status: 404 });
  }

  const existing = await prisma.savedTask.findUnique({
    where: { userId_taskId: { userId, taskId } },
  });

  await prisma.$transaction(
    existing
      ? [
          prisma.savedTask.delete({ where: { id: existing.id } }),
          prisma.task.update({ where: { id: taskId }, data: { saveCount: { decrement: 1 } } }),
        ]
      : [
          prisma.savedTask.create({ data: { userId, taskId } }),
          prisma.task.update({ where: { id: taskId }, data: { saveCount: { increment: 1 } } }),
        ],
  );

  return NextResponse.json({ saved: !existing });
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to see saved tasks." }, { status: 401 });
  }

  const saved = await prisma.savedTask.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { task: { select: { slug: true, name: true, summary: true } } },
  });

  return NextResponse.json({ items: saved.map((s) => s.task) });
}
