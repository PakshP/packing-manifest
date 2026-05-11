"use client";

import { Trash2 } from "lucide-react";
import type { AccentKey, Bag, BagId, PackingItem } from "@/types";
import { ACCENT_HEX_VAR } from "@/lib/styles";

type Props = {
  item: PackingItem;
  accent: AccentKey;
  bags: readonly Bag[];
  isChecked: boolean;
  showBagSelector: boolean;
  onToggle: () => void;
  onSetBag: (bag: BagId | null) => void;
  onRemove: () => void;
};

function HexCheckbox({
  checked,
  accent,
  onClick,
}: {
  checked: boolean;
  accent: AccentKey;
  onClick: () => void;
}) {
  const color = ACCENT_HEX_VAR[accent];
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      className="group/check relative inline-flex h-7 w-7 shrink-0 items-center justify-center transition-transform active:scale-95"
    >
      <svg
        viewBox="0 0 22 22"
        className="h-7 w-7"
        aria-hidden="true"
      >
        <path
          d="M 11 1 L 20.526 6.5 L 20.526 17.5 L 11 23 L 1.474 17.5 L 1.474 6.5 Z"
          fill={checked ? color : "rgb(var(--bg-paper))"}
          stroke={checked ? color : "rgb(var(--border-strong))"}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {checked && (
          <path
            d="M 6 11.5 L 9.5 15 L 16 8.5"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

function BagPill({
  bag,
  bags,
  onChange,
}: {
  bag: BagId | null;
  bags: readonly Bag[];
  onChange: (bag: BagId | null) => void;
}) {
  const current = bag ? bags.find((b) => b.id === bag) ?? null : null;
  const color = current ? ACCENT_HEX_VAR[current.accent] : null;

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <span className="sr-only">Assign bag</span>
      <select
        value={bag ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : v);
        }}
        className="font-mono text-[0.65rem] uppercase tracking-widest rounded-full px-3 py-1 pr-7 appearance-none cursor-pointer border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={
          current
            ? {
                backgroundColor: color ?? undefined,
                color: "white",
                borderColor: color ?? undefined,
              }
            : {
                backgroundColor: "rgb(var(--bg-paper))",
                color: "rgb(var(--ink-tertiary))",
                borderColor: "rgb(var(--border-soft))",
              }
        }
      >
        <option value="">— Unassigned</option>
        {bags.map((b) => (
          <option key={b.id} value={b.id}>
            {b.shortName}
          </option>
        ))}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[0.55rem]"
        style={{ color: current ? "white" : "rgb(var(--ink-tertiary))" }}
      >
        ▾
      </span>
    </label>
  );
}

export default function ListItem({
  item,
  accent,
  bags,
  isChecked,
  showBagSelector,
  onToggle,
  onSetBag,
  onRemove,
}: Props) {
  return (
    <li className="group flex items-center gap-2 sm:gap-3 px-2 py-2.5 -mx-2 rounded-md transition-colors hover:bg-bg-paper">
      <HexCheckbox checked={isChecked} accent={accent} onClick={onToggle} />

      <button
        type="button"
        onClick={onToggle}
        className="min-w-0 flex-1 text-left py-0.5"
      >
        <span
          className={`block break-words text-sm sm:text-base leading-snug ${
            isChecked
              ? "text-ink-tertiary line-through decoration-1"
              : "text-ink-primary"
          }`}
        >
          {item.name}
        </span>
      </button>

      {showBagSelector && (
        <BagPill bag={item.bag} bags={bags} onChange={onSetBag} />
      )}

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Delete ${item.name}`}
        className="rounded-md p-1.5 text-ink-tertiary transition-opacity hover:bg-accent-rust/10 hover:text-accent-rust opacity-60 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.8} />
      </button>
    </li>
  );
}
