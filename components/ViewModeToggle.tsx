"use client";

import type { ViewMode } from "@/types";

type Props = {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

const OPTIONS: Array<{ id: ViewMode; label: string }> = [
  { id: "category", label: "By Category" },
  { id: "bag", label: "By Bag" },
];

export default function ViewModeToggle({ viewMode, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="View mode"
      className="inline-flex items-center rounded-full border border-border-soft bg-bg-paper p-1 shadow-sm"
    >
      {OPTIONS.map((opt) => {
        const active = opt.id === viewMode;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.id)}
            className={`font-mono text-[0.7rem] uppercase tracking-widest px-4 py-2 rounded-full transition-colors ${
              active
                ? "bg-accent-moss text-white shadow-sm"
                : "text-ink-secondary hover:text-ink-primary"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
