import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const SORTS = {
  popular: { label: "Most popular", order: [{ viewCount: "desc" }, { name: "asc" }] },
  tools: { label: "Most tools", order: [{ toolCount: "desc" }, { name: "asc" }] },
  newest: { label: "Newest", order: [{ createdAt: "desc" }] },
  az: { label: "A–Z", order: [{ name: "asc" }] },
} as const;

export type SortKey = keyof typeof SORTS;
export const DEFAULT_SORT: SortKey = "popular";
export const PAGE_SIZE = 12;

export const DIFFICULTIES = ["EASY", "MODERATE", "ADVANCED"] as const;
export type DifficultyKey = (typeof DIFFICULTIES)[number];

export type ViewMode = "grid" | "list";

export interface TaskQuery {
  q: string;
  category: string | null;
  difficulty: DifficultyKey | null;
  trending: boolean;
  sort: SortKey;
  view: ViewMode;
  page: number;
}

type RawParams = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Every filter lives in the URL, so any listing state is shareable and
 * back/forward works without client state. Invalid values fall back to the
 * default rather than erroring — a hand-edited URL should never 500.
 */
export function parseTaskQuery(params: RawParams): TaskQuery {
  const sortParam = one(params.sort);
  const difficultyParam = one(params.difficulty)?.toUpperCase();
  const viewParam = one(params.view);
  const pageParam = Number(one(params.page));

  return {
    q: (one(params.q) ?? "").trim().slice(0, 80),
    category: one(params.category) ?? null,
    difficulty: DIFFICULTIES.includes(difficultyParam as DifficultyKey)
      ? (difficultyParam as DifficultyKey)
      : null,
    trending: one(params.trending) === "1",
    sort: sortParam && sortParam in SORTS ? (sortParam as SortKey) : DEFAULT_SORT,
    view: viewParam === "list" ? "list" : "grid",
    page: Number.isFinite(pageParam) && pageParam > 0 ? Math.floor(pageParam) : 1,
  };
}

export function hasActiveFilters(query: TaskQuery) {
  return Boolean(query.q || query.category || query.difficulty || query.trending);
}

function buildWhere(query: TaskQuery): Prisma.TaskWhereInput {
  const where: Prisma.TaskWhereInput = {};

  if (query.category) where.category = { slug: query.category };
  if (query.difficulty) where.difficulty = query.difficulty;
  if (query.trending) where.isTrending = true;

  if (query.q) {
    // Matches the task itself or any tool linked to it, so searching "figma"
    // surfaces the tasks Figma is listed under.
    where.OR = [
      { name: { contains: query.q, mode: "insensitive" } },
      { summary: { contains: query.q, mode: "insensitive" } },
      { description: { contains: query.q, mode: "insensitive" } },
      { tools: { some: { tool: { name: { contains: query.q, mode: "insensitive" } } } } },
    ];
  }

  return where;
}

export async function getTasks(query: TaskQuery) {
  const where = buildWhere(query);

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: SORTS[query.sort].order as unknown as Prisma.TaskOrderByWithRelationInput[],
      skip: (query.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { name: true, slug: true, accent: true } } },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    items,
    total,
    page: query.page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export type TaskListItem = Awaited<ReturnType<typeof getTasks>>["items"][number];

export async function getCategoriesWithCounts() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { tasks: true } } },
  });
  return categories;
}

export async function getTaskBySlug(slug: string, userId?: string) {
  return prisma.task.findUnique({
    where: { slug },
    include: {
      category: true,
      faqs: { orderBy: { position: "asc" } },
      tools: {
        orderBy: [{ upvotes: "desc" }, { tool: { rating: "desc" } }],
        include: {
          tool: true,
          votes: userId ? { where: { userId }, select: { id: true } } : false,
        },
      },
      saves: userId ? { where: { userId }, select: { id: true } } : false,
    },
  });
}

export type TaskDetail = NonNullable<Awaited<ReturnType<typeof getTaskBySlug>>>;

/** Sibling tasks in the same category, used for the "related" rail. */
export async function getRelatedTasks(taskId: string, categoryId: string) {
  return prisma.task.findMany({
    where: { categoryId, NOT: { id: taskId } },
    orderBy: { viewCount: "desc" },
    take: 4,
    include: { category: { select: { name: true, slug: true, accent: true } } },
  });
}
