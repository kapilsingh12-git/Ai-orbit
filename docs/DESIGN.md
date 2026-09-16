# Design notes

The brief was explicit: don't reinvent the design system. This documents what
was taken from aiorbit.club unchanged, what was inferred, and the few places
something was added.

## Taken directly from the live site

These came out of the served HTML and `<meta>` tags, so they are exact rather
than eyeballed:

- **Canvas** — `meta-theme-color: #000000`. The page background is true black,
  not a tinted near-black.
- **Viewport** — `width=device-width, initial-scale=1, maximum-scale=5`.
  Replicated in `layout.tsx` rather than using the Next.js default, which caps
  at 1 and blocks pinch-zoom.
- **Header nav** — Business AI, Leaderboard, Resources, Newsletter, with a
  filled white "Submit" button on the right and the logo at the left.
- **Footer** — four columns in this order: Explore (Tools, Agents, Models,
  Companies, Devices, Robots), Discover (News, Videos, Trends, Comparisons,
  Leaderboard), Ecosystem (Repositories, MCP, Tasks, Submit AI, Advertise),
  Company (About, Contact, Write, Press, Privacy, Terms). Above them, the
  wordmark, "The Home of Everything AI.", the one-line ecosystem description,
  and five social links. Copyright line reads "© 2026 AI Orbit. All rights
  reserved."
- **Voice** — sentence case, no exclamation marks, short product nouns.

## Inferred, and where to correct it

aiorbit.club renders client-side, so computed styles couldn't be read remotely.
The values below are placeholders chosen to sit in the same register as the
reference, and they are **all in one block** — `@theme` in
`src/app/globals.css`. Nothing in any component hard-codes a colour.

| Token | Current value | How to correct |
| --- | --- | --- |
| `--color-surface` | `#0a0a0a` | Inspect a card, read `background-color` |
| `--color-line` | `rgba(255,255,255,.08)` | Read `border-color` on the same card |
| `--color-ink-muted` | `#a1a1aa` | Read `color` on any secondary paragraph |
| `--radius-card` | `16px` | Read `border-radius` on a card |
| `--font-sans` | Inter | Read `font-family` on `body` |

Paste measured values in, and the whole module follows.

## Where something was added

Four changes, each a refinement rather than a redirection:

**Category accents as an index, not decoration.** Each category carries one hue
(`Category.accent` in the database), used only as a small icon tint and a 1px
ring. Never a fill, never a gradient wash. On a listing of 36 tasks the hue
tells you which category a card belongs to before you read the label, which is
the job a grid of identical white-on-black cards does badly. Colour stays out of
the way everywhere else — the primary action is still white-on-black.

**Difficulty as three bars rather than a coloured pill.** A green/amber/red pill
would have introduced a second, competing colour language for something that is
ordinal. Three bars filled to the level reads at a glance and needs no legend.

**`edge-lit`** — a single hairline gradient across the top edge of the listing
hero, the way light catches a physical bevel. It's the one piece of decoration
in the module and it appears once per page.

**Rank numbers on the detail page only.** Numbered markers are a common
generated-page tell, so they're used in exactly one place: the tool list, where
the position genuinely is the information being conveyed.

## Grid and list

Both views render the same fields in a different arrangement — list adds
category, difficulty and tool count as aligned columns for scanning; grid gives
the summary two lines of breathing room for browsing. Switching views never
hides information you were relying on, which is the failure mode of most
toggles. The choice persists in the URL, so a shared link keeps the sender's
view.

## Quality floor

- Responsive at 375 / 768 / 1024 / 1440. Listing collapses 3 → 2 → 1 column;
  the detail page drops its sticky sidebar below `lg` and moves the save action
  up under the hero.
- Visible keyboard focus everywhere via `:focus-visible`, so pointer users don't
  see rings but keyboard users do. Skip-to-content link on every page.
- `prefers-reduced-motion` respected — the skeleton shimmer becomes a flat
  block, all transitions collapse.
- Filter controls use real `aria-pressed` buttons and a labelled `<select>`;
  pagination is real anchors, so it works with JS disabled and is crawlable.
- Result counts announce through `aria-live="polite"` when filters change.
- Sign-in failure doesn't reveal whether the email exists.
