import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const userId = await currentUserId();
  const { next } = await searchParams;
  if (userId) redirect(next ?? "/tasks");

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-medium tracking-tight text-white">Sign in</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          Voting and saved tasks are tied to an account. Everything else works
          signed out.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="mt-6 rounded-[var(--radius-control)] border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-xs leading-relaxed text-[var(--color-ink-faint)]">
          Demo account — demo@aiorbit.dev / password123
        </p>
      </div>
    </div>
  );
}
