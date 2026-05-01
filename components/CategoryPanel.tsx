"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import type { BagId, Category, CheckedMap } from "@/types";
import { ICON_MAP } from "@/lib/data";
import { ACCENT_BG, ACCENT_TEXT, ACCENT_BG_SOFT } from "@/lib/styles";
import ListItem from "@/components/ListItem";
import KebabMenu from "@/components/ui/KebabMenu";

type Props = {
  category: Category;
  checked: CheckedMap;
  onToggleItem: (itemId: string) => void;
  onSetItemBag: (itemId: string, bag: BagId | null) => void;
  onAddItem: (categoryId: string, name: string) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckAll: () => void;
  onUncheckAll: () => void;
  onDeleteAll: () => void;
};

export default function CategoryPanel({
  category,
  checked,
  onToggleItem,
  onSetItemBag,
  onAddItem,
  onRemoveItem,
  onCheckAll,
  onUncheckAll,
  onDeleteAll,
}: Props) {
  const [draft, setDraft] = useState("");
  const Icon = ICON_MAP[category.iconKey];
  const showBagSelector = category.id !== "predeparture";

  const packed = category.items.filter((i) => checked[i.id]).length;
  const total = category.items.length;

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    onAddItem(category.id, draft);
    setDraft("");
  }

  return (
    <section
      id={`panel-${category.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${category.id}`}
      className="rounded-xl border border-border-soft bg-bg-elevated grain-overlay shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 px-5 py-5 sm:px-6 sm:py-6 border-b border-border-soft">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          {Icon && (
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ACCENT_BG_SOFT[category.accent]} ${ACCENT_TEXT[category.accent]}`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight text-ink-primary">
              {category.name}
            </h2>
            <p className="mt-0.5 text-sm text-ink-secondary">
              {category.subtitle}
            </p>
            <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest text-ink-tertiary tabular-nums">
              {packed}/{total} packed
            </p>
          </div>
        </div>

        <KebabMenu
          label={`${category.name} actions`}
          items={[
            { label: "Check all in this category", onSelect: onCheckAll },
            { label: "Uncheck all in this category", onSelect: onUncheckAll },
            {
              label: "Delete all items in this category",
              onSelect: onDeleteAll,
              danger: true,
            },
          ]}
        />
      </div>

      <ul className="px-5 py-3 sm:px-6 sm:py-4 divide-y divide-border-soft">
        {category.items.length === 0 ? (
          <li className="py-6 text-center font-mono text-[0.7rem] uppercase tracking-widest text-ink-tertiary">
            No items — add one below.
          </li>
        ) : (
          category.items.map((item) => (
            <ListItem
              key={item.id}
              item={item}
              accent={category.accent}
              isChecked={!!checked[item.id]}
              showBagSelector={showBagSelector}
              onToggle={() => onToggleItem(item.id)}
              onSetBag={(bag) => onSetItemBag(item.id, bag)}
              onRemove={() => onRemoveItem(item.id)}
            />
          ))
        )}
      </ul>

      <form
        onSubmit={handleAdd}
        className="flex items-center gap-2 border-t border-border-soft px-5 py-3 sm:px-6 sm:py-4"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="ADD AN ITEM…"
          className="flex-1 bg-transparent font-mono text-[0.7rem] uppercase tracking-widest placeholder:text-ink-tertiary text-ink-primary outline-none py-1"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          aria-label="Add item"
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-white transition-colors disabled:opacity-40 ${ACCENT_BG[category.accent]}`}
        >
          <Plus className="h-3 w-3" strokeWidth={2.5} />
          Add
        </button>
      </form>
    </section>
  );
}
