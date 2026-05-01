"use client";

import type { Bag, BagId, Category, CheckedMap, PackingItem } from "@/types";
import { ICON_MAP } from "@/lib/data";
import { ACCENT_BG_SOFT, ACCENT_TEXT } from "@/lib/styles";
import ListItem from "@/components/ListItem";
import KebabMenu from "@/components/ui/KebabMenu";

type Props = {
  bag: Bag;
  categories: Category[];
  checked: CheckedMap;
  onToggleItem: (itemId: string) => void;
  onSetItemBag: (itemId: string, bag: BagId | null) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckAll: () => void;
  onUncheckAll: () => void;
  onRemoveAll: () => void;
};

type ItemWithCategory = {
  item: PackingItem;
  category: Category;
};

export default function BagPanel({
  bag,
  categories,
  checked,
  onToggleItem,
  onSetItemBag,
  onRemoveItem,
  onCheckAll,
  onUncheckAll,
  onRemoveAll,
}: Props) {
  const Icon = ICON_MAP[bag.iconKey];

  const itemsInBag: ItemWithCategory[] = categories.flatMap((cat) =>
    cat.items
      .filter((it) => it.bag === bag.id)
      .map((item) => ({ item, category: cat }))
  );

  const packed = itemsInBag.filter(({ item }) => checked[item.id]).length;
  const total = itemsInBag.length;

  return (
    <section
      id={`panel-${bag.id}`}
      role="tabpanel"
      aria-labelledby={`tab-${bag.id}`}
      className="rounded-xl border border-border-soft bg-bg-elevated grain-overlay shadow-sm"
    >
      <div className="flex items-start justify-between gap-3 px-5 py-5 sm:px-6 sm:py-6 border-b border-border-soft">
        <div className="flex items-start gap-3 sm:gap-4 min-w-0">
          {Icon && (
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${ACCENT_BG_SOFT[bag.accent]} ${ACCENT_TEXT[bag.accent]}`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="font-display text-xl sm:text-2xl font-bold leading-tight text-ink-primary">
              {bag.name}
            </h2>
            <p className="mt-0.5 text-sm text-ink-secondary">
              Everything packed in this bag.
            </p>
            <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest text-ink-tertiary tabular-nums">
              {packed}/{total} packed
            </p>
          </div>
        </div>

        <KebabMenu
          label={`${bag.name} actions`}
          items={[
            { label: "Check all in this bag", onSelect: onCheckAll },
            { label: "Uncheck all in this bag", onSelect: onUncheckAll },
            {
              label: "Remove all items from this bag",
              onSelect: onRemoveAll,
              danger: true,
            },
          ]}
        />
      </div>

      <ul className="px-5 py-3 sm:px-6 sm:py-4 divide-y divide-border-soft">
        {itemsInBag.length === 0 ? (
          <li className="py-8 text-center font-mono text-[0.7rem] uppercase tracking-widest text-ink-tertiary">
            Nothing assigned to this bag yet.
          </li>
        ) : (
          itemsInBag.map(({ item, category }) => (
            <div key={item.id} className="relative">
              <ListItem
                item={item}
                accent={category.accent}
                isChecked={!!checked[item.id]}
                showBagSelector
                onToggle={() => onToggleItem(item.id)}
                onSetBag={(b) => onSetItemBag(item.id, b)}
                onRemove={() => onRemoveItem(item.id)}
              />
              <p className="pointer-events-none -mt-1 ml-10 mb-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-ink-tertiary">
                {category.name}
              </p>
            </div>
          ))
        )}
      </ul>
    </section>
  );
}
