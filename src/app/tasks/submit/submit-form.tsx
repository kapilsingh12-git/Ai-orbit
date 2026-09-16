"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type Fields = Record<string, string[] | undefined>;

const EMPTY = {
  name: "",
  summary: "",
  description: "",
  categorySlug: "",
  exampleTool: "",
};

export function SubmitForm({
  categories,
  prefillNote,
}: {
  categories: Array<{ slug: string; name: string }>;
  prefillNote?: string;
}) {
  const [values, setValues] = useState({ ...EMPTY, exampleTool: prefillNote ?? "" });
  const [fields, setFields] = useState<Fields>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function set(key: keyof typeof EMPTY, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (fields[key]) setFields((f) => ({ ...f, [key]: undefined }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setDuplicate(null);
    setFields({});

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.status === 409) {
        setDuplicate(data.existingSlug);
        return;
      }
      if (!res.ok) {
        setFields(data.fields ?? {});
        setFormError(data.error ?? "That didn't go through.");
        return;
      }
      setDone(true);
    } catch {
      setFormError("You appear to be offline. Your answers are still here — try again when you reconnect.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-line)] bg-[var(--color-surface)] p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black">
          <Check className="h-5 w-5" />
        </span>
        <h2 className="mt-5 text-lg font-medium text-white">Suggestion received</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          It&rsquo;s in the review queue. Approved tasks usually appear within a
          few days, and you&rsquo;ll see them on the listing once they&rsquo;re live.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tasks"
            className="rounded-[var(--radius-control)] bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Back to tasks
          </Link>
          <button
            type="button"
            onClick={() => {
              setValues(EMPTY);
              setDone(false);
            }}
            className="rounded-[var(--radius-control)] border border-[var(--color-line)] px-4 py-2 text-sm text-white transition-colors hover:border-[var(--color-line-strong)] hover:bg-white/5"
          >
            Suggest another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      <Field
        label="Task name"
        hint="Start with a verb, as a person would describe the job."
        error={fields.name?.[0]}
      >
        <input
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Remove image background"
          className={input(fields.name)}
        />
      </Field>

      <Field
        label="One-line summary"
        hint={`${values.summary.length}/160 — this is what shows on the card.`}
        error={fields.summary?.[0]}
      >
        <input
          value={values.summary}
          onChange={(e) => set("summary", e.target.value.slice(0, 160))}
          placeholder="Cut a subject out cleanly, including hair and soft edges."
          className={input(fields.summary)}
        />
      </Field>

      <Field
        label="Description"
        hint="What makes this task hard, and what separates the good tools from the rest."
        error={fields.description?.[0]}
      >
        <textarea
          rows={5}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          className={`${input(fields.description)} resize-y py-3 leading-relaxed`}
        />
      </Field>

      <Field label="Category" error={fields.categorySlug?.[0]}>
        <select
          value={values.categorySlug}
          onChange={(e) => set("categorySlug", e.target.value)}
          className={input(fields.categorySlug)}
        >
          <option value="">Choose a category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Example tool"
        hint="Optional. One tool that does this well, to help reviewers place it."
        error={fields.exampleTool?.[0]}
      >
        <input
          value={values.exampleTool}
          onChange={(e) => set("exampleTool", e.target.value)}
          placeholder="remove.bg"
          className={input(fields.exampleTool)}
        />
      </Field>

      {duplicate && (
        <p className="rounded-[var(--radius-control)] border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          A task with this name already exists.{" "}
          <Link href={`/tasks/${duplicate}`} className="underline underline-offset-4">
            Open it instead
          </Link>
          .
        </p>
      )}

      {formError && !duplicate && (
        <p className="rounded-[var(--radius-control)] border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="h-11 w-full rounded-[var(--radius-control)] bg-white text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-6"
      >
        {submitting ? "Sending…" : "Submit for review"}
      </button>
    </form>
  );
}

function input(error?: string[]) {
  return `h-11 w-full rounded-[var(--radius-control)] border bg-[var(--color-surface)] px-3.5 text-sm text-white placeholder:text-[var(--color-ink-faint)] focus:outline-none ${
    error
      ? "border-rose-400/50 focus:border-rose-400"
      : "border-[var(--color-line)] focus:border-[var(--color-line-strong)]"
  }`;
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-white">{label}</span>
      <div className="mt-2">{children}</div>
      {error ? (
        <span className="mt-2 block text-xs text-rose-400">{error}</span>
      ) : hint ? (
        <span className="mt-2 block text-xs text-[var(--color-ink-faint)]">{hint}</span>
      ) : null}
    </label>
  );
}
