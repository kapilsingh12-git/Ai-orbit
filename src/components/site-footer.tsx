import Link from "next/link";
import Image from "next/image";

// Column structure and link order taken directly from aiorbit.club's footer.
const COLUMNS = [
  {
    heading: "Explore",
    links: [
      ["AI Tools", "/tools"],
      ["AI Agents", "/agents"],
      ["AI Models", "/models"],
      ["AI Companies", "/companies"],
      ["AI Devices", "/devices"],
      ["AI Robots", "/robots"],
    ],
  },
  {
    heading: "Discover",
    links: [
      ["AI News", "/news"],
      ["AI Videos", "/videos"],
      ["AI Trends", "/trends"],
      ["AI Comparisons", "/tools/compare"],
      ["Leaderboard", "/leaderboard"],
    ],
  },
  {
    heading: "Ecosystem",
    links: [
      ["Repositories", "/repositories"],
      ["MCP", "/mcp"],
      ["Tasks", "/tasks"],
      ["Submit AI", "/tasks/submit"],
      ["Advertise", "/advertise"],
    ],
  },
  {
    heading: "Company",
    links: [
      ["About", "/about"],
      ["Contact", "/contact"],
      ["Write", "/write-for-us"],
      ["Press", "/press"],
      ["Privacy", "/privacy"],
      ["Terms", "/terms"],
    ],
  },
] as const;

const SOCIAL = [
  ["X", "https://x.com"],
  ["LinkedIn", "https://linkedin.com"],
  ["Instagram", "https://instagram.com"],
  ["YouTube", "https://youtube.com"],
  ["Discord", "https://discord.com"],
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[var(--color-line)]">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-xs">
          <Image
            src="/logo-full.svg"
            alt="AI Orbit"
            width={128}
            height={32}
            unoptimized
            className="h-8 w-auto"
          />
          <p className="mt-5 text-base text-white">The Home of Everything AI.</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            Discover the tools, companies, and technologies shaping the global AI
            ecosystem.
          </p>
          <ul className="mt-6 flex gap-4">
            {SOCIAL.map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="text-sm text-[var(--color-ink-faint)] transition-colors hover:text-white"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.heading}>
            <h2 className="text-sm font-medium text-white">{column.heading}</h2>
            <ul className="mt-4 space-y-3">
              {column.links.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--color-ink-muted)] transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="container-page py-6">
          <p className="text-sm text-[var(--color-ink-faint)]">
            © {new Date().getFullYear()} AI Orbit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
