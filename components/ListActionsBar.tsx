"use client";

import { CheckSquare, Square, Trash2 } from "lucide-react";

type Props = {
  totalItems: number;
  packedItems: number;
  onCheckAll: () => void;
  onUncheckAll: () => void;
  onResetList: () => void;
};

export default function ListActionsBar({
  totalItems,
  packedItems,
  onCheckAll,
  onUncheckAll,
  onResetList,
}: Props) {
  const remaining = Math.max(0, totalItems - packedItems);
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border-soft bg-bg-paper px-4 py-3">
      <p className="font-mono text-[0.7rem] uppercase tracking-widest text-ink-secondary tabular-nums">
        <span className="text-ink-primary font-semibold">{remaining}</span> items remaining
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onCheckAll}
          className="inline-flex items-center gap-1.5 rounded-md border border-border-soft bg-bg-elevated px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-ink-primary transition-colors hover:border-border-strong"
        >
          <CheckSquare className="h-3.5 w-3.5" strokeWidth={1.8} />
          Check all
        </button>
        <button
          type="button"
          onClick={onUncheckAll}
          className="inline-flex items-center gap-1.5 rounded-md border border-border-soft bg-bg-elevated px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-ink-primary transition-colors hover:border-border-strong"
        >
          <Square className="h-3.5 w-3.5" strokeWidth={1.8} />
          Uncheck all
        </button>
        <button
          type="button"
          onClick={onResetList}
          className="inline-flex items-center gap-1.5 rounded-md border border-accent-rust/30 bg-accent-rust/5 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-accent-rust transition-colors hover:bg-accent-rust/10"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
          Reset list
        </button>
      </div>
    </div>
  );
}
