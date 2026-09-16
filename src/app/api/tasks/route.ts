import { NextResponse } from "next/server";
import { getTasks, parseTaskQuery } from "@/lib/tasks";

/**
 * Public read API for the listing. Same parser as the page, so the JSON and the
 * HTML can never disagree about what a given querystring means.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params = Object.fromEntries(searchParams.entries());
  const query = parseTaskQuery(params);

  try {
    const result = await getTasks(query);
    return NextResponse.json(
      {
        query,
        total: result.total,
        page: result.page,
        pageCount: result.pageCount,
        items: result.items.map((t) => ({
          slug: t.slug,
          name: t.name,
          summary: t.summary,
          category: t.category.slug,
          difficulty: t.difficulty,
          toolCount: t.toolCount,
          viewCount: t.viewCount,
          isTrending: t.isTrending,
        })),
      },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch {
    return NextResponse.json({ error: "Could not load tasks." }, { status: 500 });
  }
}
