"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

export type KebabMenuItem = {
  label: string;
  onSelect: () => void;
  danger?: boolean;
};

type Props = {
  label: string;
  items: KebabMenuItem[];
};

export default function KebabMenu({ label, items }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-1.5 text-ink-tertiary transition-colors hover:bg-bg-paper hover:text-ink-primary"
      >
        <MoreHorizontal className="h-4 w-4" strokeWidth={2} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-md border border-border-soft bg-bg-elevated shadow-lg animate-fade-in"
        >
          {items.map((item, idx) => (
            <button
              key={idx}
              role="menuitem"
              type="button"
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-sm transition-colors ${
                item.danger
                  ? "text-accent-rust hover:bg-accent-rust/10"
                  : "text-ink-primary hover:bg-bg-paper"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
