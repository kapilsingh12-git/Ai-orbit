# AI Orbit — Tasks module

A full-stack build of the Tasks module for [aiorbit.club](https://aiorbit.club),
submitted for the module design & development task.

A **task** is a job someone is trying to get done ("Remove image background",
"Transcribe audio"), and each task page is a community-ranked list of the tools,
models, agents and devices that do it. The listing is the entry point; the detail
page is where the comparison happens.

## Stack

Next.js 15 (App Router, React 19) · TypeScript · Tailwind CSS v4 · Prisma ·
PostgreSQL · Auth.js v5 · Zod · deployed on Vercel.

## Running locally

```bash
npm install
cp .env.example .env          # fill in DATABASE_URL and AUTH_SECRET
npx prisma db push
npm run db:seed
npm run dev
```

`npx auth secret` generates `AUTH_SECRET`. Any Postgres works — Neon, Supabase
and Vercel Postgres have all been tested against this schema.

Demo account after seeding: `demo@aiorbit.dev` / `password123`.

## Routes

| Route | What it does |
| --- | --- |
| `/tasks` | Listing. Grid/list toggle, search, category, difficulty, trending, sort, pagination — all in the URL |
| `/tasks/[slug]` | Detail. Ranked tools with upvoting, in-page pricing filter, FAQ, related tasks, FAQ JSON-LD |
| `/tasks/category/[slug]` | Category landing, statically generated per category |
| `/tasks/submit` | Suggest a task. Client + server validation off one Zod schema, duplicate detection |
| `/saved` | Saved tasks, auth-gated with a return path |
| `/login` | Credentials sign-in |
| `/api/tasks` | Public read API over the same query parser the page uses |
| `/api/votes` | Toggle an upvote (transactional) |
| `/api/saved` | Toggle / list saved tasks |
| `/api/submissions` | Create a submission |

## Things worth looking at

**URL is the state.** `parseTaskQuery` in `src/lib/tasks.ts` is the only place
search params are interpreted, and both the page and `/api/tasks` call it. A
hand-edited or malformed querystring falls back to defaults instead of throwing,
so `?sort=banana&page=-4` renders page one rather than a 500.

**Counters can't drift.** Votes and saves write the join row and the
denormalised counter inside one `$transaction`. The client updates optimistically
and rolls back on failure; a 401 pushes to `/login?next=…` rather than silently
doing nothing.

**Every state is built, not just the happy path.** Route-level `loading.tsx`
skeletons that match the real layout, empty states for both "no results" and "no
results *because of your filters*", a filtered-to-nothing state inside the detail
page's tool list, an error boundary that surfaces the digest, a 404, and offline
copy on both forms.

**One token layer.** Every colour, radius and type step resolves through
`@theme` in `src/app/globals.css`. Re-pointing the module at measured values
from the live site means editing that block only. See `docs/DESIGN.md`.

## Deploying

1. Push to GitHub, import into Vercel.
2. Set `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`.
3. The build script runs `prisma generate && prisma migrate deploy` before
   `next build`. Run the seed once against the production database:
   `npx dotenv -e .env.production -- npm run db:seed`.

## Data

All content is dummy data in `prisma/seed.ts` — 8 categories, 36 tasks, 48
tools, 120+ task/tool links with per-task rankings and editorial notes, plus
FAQs on the tasks where they earn their place. The notes were written per task
rather than generated from a template, because the detail page is only worth
visiting if it says something the tool's own marketing doesn't.
