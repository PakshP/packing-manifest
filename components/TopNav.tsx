"use client";

import { ChevronDown, Compass, Loader2, Check } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { SaveStatus } from "@/types";
import { APP_NAME } from "@/lib/config";

type Props = {
  user: User;
  saveStatus: SaveStatus;
  onAvatarClick: () => void;
};

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "") return null;
  if (status === "saving") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-ink-tertiary">
        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={2} />
        <span className="hidden sm:inline">Saving…</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-widest text-accent-moss">
      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
      <span className="hidden sm:inline">Saved</span>
    </span>
  );
}

export default function TopNav({ user, saveStatus, onAvatarClick }: Props) {
  const emailDisplay = user.email ?? "Account";

  return (
    <header className="sticky top-0 z-30 border-b border-border-soft bg-bg-base/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong bg-bg-paper text-accent-moss">
            <Compass className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <span className="font-display text-base sm:text-lg font-bold tracking-tight text-ink-primary">
            {APP_NAME}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <SaveIndicator status={saveStatus} />
          <button
            type="button"
            onClick={onAvatarClick}
            aria-label="Account menu"
            className="inline-flex max-w-[12rem] items-center gap-2 rounded-full border border-border-soft bg-bg-paper py-1 pl-1 pr-3 text-sm transition-colors hover:border-border-strong"
          >
            <span
              aria-hidden="true"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-moss/15 font-mono text-xs font-semibold uppercase text-accent-moss"
            >
              {emailDisplay.slice(0, 1)}
            </span>
            <span className="hidden sm:block max-w-[7rem] truncate text-xs font-medium text-ink-secondary">
              {emailDisplay}
            </span>
            <ChevronDown
              className="h-3.5 w-3.5 text-ink-tertiary"
              strokeWidth={2}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
