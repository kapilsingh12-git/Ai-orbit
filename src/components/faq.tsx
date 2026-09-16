"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export function FaqList({
  items,
}: {
  items: Array<{ id: string; question: string; answer: string }>;
}) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <ul className="divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-start justify-between gap-6 py-5 text-left"
            >
              <span className="text-sm font-medium text-white">{item.question}</span>
              <Plus
                className={`mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ink-faint)] transition-transform duration-200 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
