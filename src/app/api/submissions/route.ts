import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { currentUserId } from "@/lib/auth";

// Shared with the client form so validation messages match on both sides.
export const submissionSchema = z.object({
  name: z.string().min(4, "Give the task a name of at least 4 characters.").max(80),
  summary: z.string().min(20, "The one-line summary needs at least 20 characters.").max(160),
  description: z.string().min(80, "Describe the task in at least 80 characters.").max(2000),
  categorySlug: z.string().min(1, "Pick a category."),
  exampleTool: z.string().max(80).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const parsed = submissionSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Some fields need fixing.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const category = await prisma.category.findUnique({
    where: { slug: parsed.data.categorySlug },
    select: { id: true },
  });
  if (!category) {
    return NextResponse.json(
      { error: "That category doesn't exist.", fields: { categorySlug: ["Pick a category."] } },
      { status: 400 },
    );
  }

  const duplicate = await prisma.task.findFirst({
    where: { name: { equals: parsed.data.name, mode: "insensitive" } },
    select: { slug: true },
  });
  if (duplicate) {
    return NextResponse.json(
      {
        error: "That task already exists.",
        existingSlug: duplicate.slug,
      },
      { status: 409 },
    );
  }

  const submission = await prisma.taskSubmission.create({
    data: {
      ...parsed.data,
      exampleTool: parsed.data.exampleTool || null,
      submitterId: await currentUserId(),
    },
  });

  return NextResponse.json({ id: submission.id, status: submission.status }, { status: 201 });
}
