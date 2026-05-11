"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Plus, RotateCcw, Trash2, X } from "lucide-react";
import type { AccentKey, Bag, Category } from "@/types";
import {
  ACCENT_OPTIONS,
  ICON_MAP,
  PICKER_ICON_KEYS,
} from "@/lib/data";
import { ACCENT_BG, ACCENT_BG_SOFT, ACCENT_TEXT } from "@/lib/styles";

type Tab = "categories" | "bags";

type Props = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  bags: readonly Bag[];
  itemCountByBag: Record<string, number>;
  onAddCategory: (input: { name: string; accent: AccentKey; iconKey: string }) => void;
  onDeleteCategory: (categoryId: string) => void;
  onResetCategories: () => void;
  onAddBag: (input: {
    name: string;
    shortName: string;
    accent: AccentKey;
    iconKey: string;
  }) => void;
  onDeleteBag: (bagId: string) => void;
  onResetBags: () => void;
};

const DEFAULT_ICON = "package";

export default function EditModal({
  open,
  onClose,
  categories,
  bags,
  itemCountByBag,
  onAddCategory,
  onDeleteCategory,
  onResetCategories,
  onAddBag,
  onDeleteBag,
  onResetBags,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("categories");

  // Category draft
  const [catName, setCatName] = useState("");
  const [catAccent, setCatAccent] = useState<AccentKey>("moss");
  const [catIcon, setCatIcon] = useState<string>(DEFAULT_ICON);

  // Bag draft
  const [bagName, setBagName] = useState("");
  const [bagShort, setBagShort] = useState("");
  const [bagAccent, setBagAccent] = useState<AccentKey>("river");
  const [bagIcon, setBagIcon] = useState<string>(DEFAULT_ICON);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  function handleAddCategory(e: FormEvent) {
    e.preventDefault();
    const name = catName.trim();
    if (!name) return;
    onAddCategory({ name, accent: catAccent, iconKey: catIcon });
    setCatName("");
    setCatAccent("moss");
    setCatIcon(DEFAULT_ICON);
  }

  function handleAddBag(e: FormEvent) {
    e.preventDefault();
    const name = bagName.trim();
    if (!name) return;
    const short = bagShort.trim() || name;
    onAddBag({ name, shortName: short, accent: bagAccent, iconKey: bagIcon });
    setBagName("");
    setBagShort("");
    setBagAccent("river");
    setBagIcon(DEFAULT_ICON);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-ink-primary/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
        tabIndex={-1}
        className="relative w-full sm:max-w-xl bg-bg-elevated border border-border-soft rounded-t-xl sm:rounded-lg shadow-2xl animate-scale-in grain-overlay max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-3">
          <h2
            id="edit-title"
            className="font-display text-lg font-bold text-ink-primary"
          >
            Edit categories &amp; bags
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit menu"
            className="rounded-full p-1 text-ink-tertiary transition-colors hover:bg-bg-paper hover:text-ink-primary"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div
          role="tablist"
          aria-label="Edit sections"
          className="flex border-b border-border-soft px-5"
        >
          {(["categories", "bags"] as Tab[]).map((id) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(id)}
                className={`relative px-3 py-2.5 font-mono text-[0.7rem] uppercase tracking-widest transition-colors ${
                  active
                    ? "text-ink-primary"
                    : "text-ink-tertiary hover:text-ink-secondary"
                }`}
              >
                {id === "categories" ? "Categories" : "Bags"}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent-moss" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {tab === "categories" ? (
            <CategoriesTab
              categories={categories}
              onDelete={onDeleteCategory}
              onReset={onResetCategories}
              draftName={catName}
              setDraftName={setCatName}
              draftAccent={catAccent}
              setDraftAccent={setCatAccent}
              draftIcon={catIcon}
              setDraftIcon={setCatIcon}
              onSubmit={handleAddCategory}
            />
          ) : (
            <BagsTab
              bags={bags}
              itemCountByBag={itemCountByBag}
              onDelete={onDeleteBag}
              onReset={onResetBags}
              draftName={bagName}
              setDraftName={setBagName}
              draftShort={bagShort}
              setDraftShort={setBagShort}
              draftAccent={bagAccent}
              setDraftAccent={setBagAccent}
              draftIcon={bagIcon}
              setDraftIcon={setBagIcon}
              onSubmit={handleAddBag}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Categories tab
// =====================================================================

type CategoriesTabProps = {
  categories: Category[];
  onDelete: (id: string) => void;
  onReset: () => void;
  draftName: string;
  setDraftName: (v: string) => void;
  draftAccent: AccentKey;
  setDraftAccent: (v: AccentKey) => void;
  draftIcon: string;
  setDraftIcon: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
};

function CategoriesTab({
  categories,
  onDelete,
  onReset,
  draftName,
  setDraftName,
  draftAccent,
  setDraftAccent,
  draftIcon,
  setDraftIcon,
  onSubmit,
}: CategoriesTabProps) {
  return (
    <>
      <ul className="divide-y divide-border-soft rounded-md border border-border-soft bg-bg-paper">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.iconKey];
          const itemCount = cat.items.length;
          const canDelete = itemCount === 0;
          return (
            <li
              key={cat.id}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              {Icon && (
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ACCENT_BG_SOFT[cat.accent]} ${ACCENT_TEXT[cat.accent]}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-primary">
                  {cat.name}
                </p>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-tertiary tabular-nums">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                  {cat.isCustom && <span className="ml-2">· Custom</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(cat.id)}
                disabled={!canDelete}
                aria-label={`Delete ${cat.name}`}
                title={
                  canDelete
                    ? `Delete ${cat.name}`
                    : "Remove all items before deleting"
                }
                className="rounded-md p-1.5 text-ink-tertiary transition-colors hover:bg-accent-rust/10 hover:text-accent-rust disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-tertiary disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onReset}
        className="flex w-full items-center gap-2 rounded-md border border-border-soft bg-bg-paper px-3 py-2 text-left text-sm transition-colors hover:border-border-strong"
      >
        <RotateCcw
          className="h-4 w-4 shrink-0 text-ink-tertiary"
          strokeWidth={1.8}
        />
        <div className="min-w-0">
          <p className="font-medium text-ink-primary">
            Reset categories to default
          </p>
          <p className="text-xs text-ink-tertiary">
            Restores deleted defaults and removes custom categories. Items in
            kept categories stay.
          </p>
        </div>
      </button>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-md border border-border-soft bg-bg-paper p-3"
      >
        <p className="field-label">Add a category</p>
        <input
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Category name"
          maxLength={40}
          className="w-full bg-transparent border border-border-soft rounded-md px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-border-strong"
        />
        <AccentPicker value={draftAccent} onChange={setDraftAccent} />
        <IconPicker value={draftIcon} onChange={setDraftIcon} />
        <button
          type="submit"
          disabled={!draftName.trim()}
          className={`flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40 ${ACCENT_BG[draftAccent]}`}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add category
        </button>
      </form>
    </>
  );
}

// =====================================================================
// Bags tab
// =====================================================================

type BagsTabProps = {
  bags: readonly Bag[];
  itemCountByBag: Record<string, number>;
  onDelete: (id: string) => void;
  onReset: () => void;
  draftName: string;
  setDraftName: (v: string) => void;
  draftShort: string;
  setDraftShort: (v: string) => void;
  draftAccent: AccentKey;
  setDraftAccent: (v: AccentKey) => void;
  draftIcon: string;
  setDraftIcon: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
};

function BagsTab({
  bags,
  itemCountByBag,
  onDelete,
  onReset,
  draftName,
  setDraftName,
  draftShort,
  setDraftShort,
  draftAccent,
  setDraftAccent,
  draftIcon,
  setDraftIcon,
  onSubmit,
}: BagsTabProps) {
  return (
    <>
      <ul className="divide-y divide-border-soft rounded-md border border-border-soft bg-bg-paper">
        {bags.map((bag) => {
          const Icon = ICON_MAP[bag.iconKey];
          const itemCount = itemCountByBag[bag.id] ?? 0;
          const canDelete = itemCount === 0;
          return (
            <li
              key={bag.id}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              {Icon && (
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ACCENT_BG_SOFT[bag.accent]} ${ACCENT_TEXT[bag.accent]}`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-primary">
                  {bag.name}
                </p>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-tertiary tabular-nums">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                  {bag.isCustom && <span className="ml-2">· Custom</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onDelete(bag.id)}
                disabled={!canDelete}
                aria-label={`Delete ${bag.name}`}
                title={
                  canDelete
                    ? `Delete ${bag.name}`
                    : "Unassign all items from this bag before deleting"
                }
                className="rounded-md p-1.5 text-ink-tertiary transition-colors hover:bg-accent-rust/10 hover:text-accent-rust disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-tertiary disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={onReset}
        className="flex w-full items-center gap-2 rounded-md border border-border-soft bg-bg-paper px-3 py-2 text-left text-sm transition-colors hover:border-border-strong"
      >
        <RotateCcw
          className="h-4 w-4 shrink-0 text-ink-tertiary"
          strokeWidth={1.8}
        />
        <div className="min-w-0">
          <p className="font-medium text-ink-primary">
            Reset bags to default
          </p>
          <p className="text-xs text-ink-tertiary">
            Restores deleted defaults and removes custom bags. Items assigned
            to removed bags become unassigned.
          </p>
        </div>
      </button>

      <form
        onSubmit={onSubmit}
        className="space-y-3 rounded-md border border-border-soft bg-bg-paper p-3"
      >
        <p className="field-label">Add a bag</p>
        <input
          type="text"
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          placeholder="Bag name (e.g. Camera bag)"
          maxLength={40}
          className="w-full bg-transparent border border-border-soft rounded-md px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-border-strong"
        />
        <input
          type="text"
          value={draftShort}
          onChange={(e) => setDraftShort(e.target.value)}
          placeholder="Short label (optional)"
          maxLength={16}
          className="w-full bg-transparent border border-border-soft rounded-md px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary outline-none focus:border-border-strong"
        />
        <AccentPicker value={draftAccent} onChange={setDraftAccent} />
        <IconPicker value={draftIcon} onChange={setDraftIcon} />
        <button
          type="submit"
          disabled={!draftName.trim()}
          className={`flex w-full items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40 ${ACCENT_BG[draftAccent]}`}
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add bag
        </button>
      </form>
    </>
  );
}

// =====================================================================
// Pickers
// =====================================================================

function AccentPicker({
  value,
  onChange,
}: {
  value: AccentKey;
  onChange: (a: AccentKey) => void;
}) {
  return (
    <div>
      <p className="field-label mb-1.5">Color</p>
      <div className="flex gap-2">
        {ACCENT_OPTIONS.map((a) => {
          const selected = a === value;
          return (
            <button
              key={a}
              type="button"
              aria-label={`Choose ${a}`}
              aria-pressed={selected}
              onClick={() => onChange(a)}
              className={`h-8 w-8 rounded-full transition-transform ${ACCENT_BG[a]} ${
                selected
                  ? "ring-2 ring-offset-2 ring-offset-bg-paper ring-ink-primary scale-110"
                  : "opacity-80 hover:opacity-100"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <div>
      <p className="field-label mb-1.5">Icon</p>
      <div className="grid grid-cols-9 gap-1.5">
        {PICKER_ICON_KEYS.map((key) => {
          const Icon = ICON_MAP[key];
          if (!Icon) return null;
          const selected = key === value;
          return (
            <button
              key={key}
              type="button"
              aria-label={`Choose ${key} icon`}
              aria-pressed={selected}
              onClick={() => onChange(key)}
              className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors ${
                selected
                  ? "border-ink-primary bg-bg-elevated text-ink-primary"
                  : "border-border-soft text-ink-tertiary hover:border-border-strong hover:text-ink-secondary"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
