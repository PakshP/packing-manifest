"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    confirmBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClasses =
    variant === "danger"
      ? "bg-accent-rust text-white hover:bg-accent-rust/90 focus-visible:outline-accent-rust"
      : "bg-accent-moss text-white hover:bg-accent-moss/90 focus-visible:outline-accent-moss";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 animate-fade-in"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-ink-primary/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="relative w-full sm:max-w-md bg-bg-elevated border border-border-soft rounded-t-xl sm:rounded-lg shadow-2xl animate-scale-in grain-overlay"
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                variant === "danger"
                  ? "bg-accent-rust/10 text-accent-rust"
                  : "bg-accent-moss/10 text-accent-moss"
              }`}
            >
              <AlertTriangle className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div className="flex-1 pt-0.5">
              <h2
                id="confirm-dialog-title"
                className="font-display text-xl font-bold leading-tight text-ink-primary"
              >
                {title}
              </h2>
              <p
                id="confirm-dialog-desc"
                className="mt-2 text-sm leading-relaxed text-ink-secondary"
              >
                {description}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-md border border-border-strong bg-bg-paper px-4 py-2 text-sm font-medium text-ink-primary transition-colors hover:bg-bg-base"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              ref={confirmBtnRef}
              onClick={onConfirm}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors ${confirmClasses}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
