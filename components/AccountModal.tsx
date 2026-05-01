"use client";

import { useEffect, useRef } from "react";
import { LogOut, RotateCcw, Trash2, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type Props = {
  open: boolean;
  user: User;
  createdAt: string | null;
  deleteError: string | null;
  onClose: () => void;
  onSignOut: () => void;
  onResetChecks: () => void;
  onResetList: () => void;
  onDeleteAccount: () => void;
};

function formatCoords(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}

export default function AccountModal({
  open,
  user,
  createdAt,
  deleteError,
  onClose,
  onSignOut,
  onResetChecks,
  onResetList,
  onDeleteAccount,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

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

  const joined = createdAt ? formatCoords(new Date(createdAt)) : "—";

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
        aria-labelledby="account-title"
        tabIndex={-1}
        className="relative w-full sm:max-w-md bg-bg-elevated border border-border-soft rounded-t-xl sm:rounded-lg shadow-2xl animate-scale-in grain-overlay"
      >
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-3">
          <h2
            id="account-title"
            className="font-display text-lg font-bold text-ink-primary"
          >
            Account
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close account menu"
            className="rounded-full p-1 text-ink-tertiary transition-colors hover:bg-bg-paper hover:text-ink-primary"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          <div>
            <p className="field-label">Signed in as</p>
            <p className="mt-1 break-all font-mono text-sm text-ink-primary">
              {user.email ?? "(no email on file)"}
            </p>
            <p className="mt-3 field-label">Joined</p>
            <p className="mt-1 font-mono text-sm text-ink-secondary">
              N 47°&nbsp;·&nbsp;{joined}
            </p>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-accent-moss py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-moss/90"
          >
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Sign out
          </button>

          <div className="border-t border-border-soft pt-5">
            <p className="field-label text-accent-rust">Danger zone</p>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={onResetChecks}
                className="flex w-full items-center gap-3 rounded-md border border-border-soft bg-bg-paper px-3 py-2.5 text-left text-sm transition-colors hover:border-border-strong"
              >
                <RotateCcw
                  className="h-4 w-4 shrink-0 text-ink-tertiary"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="font-medium text-ink-primary">
                    Reset all checks
                  </p>
                  <p className="text-xs text-ink-tertiary">
                    Mark everything unpacked. Custom items remain.
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={onResetList}
                className="flex w-full items-center gap-3 rounded-md border border-border-soft bg-bg-paper px-3 py-2.5 text-left text-sm transition-colors hover:border-border-strong"
              >
                <RotateCcw
                  className="h-4 w-4 shrink-0 text-ink-tertiary"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="font-medium text-ink-primary">
                    Reset entire list to default
                  </p>
                  <p className="text-xs text-ink-tertiary">
                    Restore the original categories and items.
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={onDeleteAccount}
                className="flex w-full items-center gap-3 rounded-md border border-accent-rust/40 bg-accent-rust/5 px-3 py-2.5 text-left text-sm text-accent-rust transition-colors hover:bg-accent-rust/10"
              >
                <Trash2 className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                <div>
                  <p className="font-semibold">Delete account</p>
                  <p className="text-xs text-accent-rust/80">
                    Permanently removes your account and your manifest.
                  </p>
                </div>
              </button>
              {deleteError && (
                <p
                  role="alert"
                  className="rounded-md border border-accent-rust/40 bg-accent-rust/10 px-3 py-2 text-xs text-accent-rust"
                >
                  {deleteError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
