"use client";

import { Compass } from "lucide-react";

type Props = {
  onChipClick: (term: string) => void;
};

const STARTER_CHIPS = [
  "razor",
  "lithium batteries",
  "alcohol",
  "peanut butter",
  "pepper spray",
  "lighter",
];

export default function EmptyState({ onChipClick }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border-strong bg-bg-paper text-accent-moss shadow-sm">
        <Compass className="h-6 w-6 animate-spin-slow" strokeWidth={1.6} />
      </span>
      <h3 className="mt-4 font-display text-lg font-bold text-ink-primary">
        Can I bring this?
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-secondary">
        Ask me anything about what you can pack — I&rsquo;ll check the TSA
        list. Try one of these:
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {STARTER_CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChipClick(c)}
            className="rounded-full border border-border-soft bg-bg-paper px-3 py-1 text-xs text-ink-secondary transition-colors hover:border-border-strong hover:bg-bg-elevated hover:text-ink-primary"
          >
            {c}
          </button>
        ))}
      </div>
      <p className="mt-6 font-mono text-[0.6rem] uppercase tracking-widest text-ink-tertiary">
        local search · 494 items
      </p>
    </div>
  );
}
