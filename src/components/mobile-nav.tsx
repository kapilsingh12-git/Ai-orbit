"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav({
  items,
  signedIn,
}: {
  items: Array<{ label: string; href: string }>;
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation, otherwise the panel survives the route change.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-control)] border border-[var(--color-line)] md:hidden"
      >
        <span className="relative block h-3 w-4">
          <span
            className={`absolute left-0 h-px w-4 bg-white transition-transform duration-200 ${
              open ? "top-1.5 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1.5 h-px w-4 bg-white transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 h-px w-4 bg-white transition-transform duration-200 ${
              open ? "top-1.5 -rotate-45" : "top-3"
            }`}
          />
        </span>
      </button>

      {open && (
        <div className="fixed inset-x-0 top-16 z-40 border-b border-[var(--color-line)] bg-black md:hidden">
          <nav className="container-page flex flex-col py-2">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="border-b border-[var(--color-line)] py-4 text-base text-white last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={signedIn ? "/saved" : "/login"}
              className="py-4 text-base text-[var(--color-ink-muted)]"
            >
              {signedIn ? "Saved tasks" : "Sign in"}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
