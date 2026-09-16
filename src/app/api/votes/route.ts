import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";

const schema = z.object({ taskToolId: z.string().min(1) });

/**
 * Toggles the caller's vote on a task/tool pairing. The vote row and the
 * denormalised counter move together in a transaction, so the count can't
 * drift if the second write fails.
 */
export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in to vote." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "taskToolId is required." }, { status: 400 });
  }

  const { taskToolId } = parsed.data;

  const link = await prisma.taskTool.findUnique({ where: { id: taskToolId } });
  if (!link) {
    return NextResponse.json({ error: "That tool listing no longer exists." }, { status: 404 });
  }

  const existing = await prisma.vote.findUnique({
    where: { userId_taskToolId: { userId, taskToolId } },
  });

  const [, updated] = await prisma.$transaction(
    existing
      ? [
          prisma.vote.delete({ where: { id: existing.id } }),
          prisma.taskTool.update({
            where: { id: taskToolId },
            data: { upvotes: { decrement: 1 } },
          }),
        ]
      : [
          prisma.vote.create({ data: { userId, taskToolId } }),
          prisma.taskTool.update({
            where: { id: taskToolId },
            data: { upvotes: { increment: 1 } },
          }),
        ],
  );

  return NextResponse.json({ voted: !existing, upvotes: updated.upvotes });
}
