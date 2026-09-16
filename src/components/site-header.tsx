import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/lib/auth";
import { MobileNav } from "./mobile-nav";

// Mirrors the nav on aiorbit.club so this module reads as part of the same site.
export const NAV = [
  { label: "Business AI", href: "/tasks?category=business" },
  { label: "Tasks", href: "/tasks" },
  { label: "Leaderboard", href: "/leaderboard" },
  { label: "Resources", href: "/tools" },
];

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-black/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-6">
        <Link href="/tasks" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo-full.svg"
            alt="AI Orbit"
            width={112}
            height={28}
            priority
            unoptimized
            className="h-7 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-[var(--radius-control)] px-3 py-2 text-sm text-[var(--color-ink-muted)] transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {session?.user ? (
            <>
              <Link
                href="/saved"
                className="hidden rounded-[var(--radius-control)] px-3 py-2 text-sm text-[var(--color-ink-muted)] transition-colors hover:bg-white/5 hover:text-white sm:block"
              >
                Saved
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/tasks" });
                }}
              >
                <button
                  type="submit"
                  className="hidden rounded-[var(--radius-control)] px-3 py-2 text-sm text-[var(--color-ink-muted)] transition-colors hover:bg-white/5 hover:text-white sm:block"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-[var(--radius-control)] px-3 py-2 text-sm text-[var(--color-ink-muted)] transition-colors hover:bg-white/5 hover:text-white sm:block"
            >
              Sign in
            </Link>
          )}

          <Link
            href="/tasks/submit"
            className="rounded-[var(--radius-control)] bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Submit task
          </Link>

          <MobileNav items={NAV} signedIn={Boolean(session?.user)} />
        </div>
      </div>
    </header>
  );
}
