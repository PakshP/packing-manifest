"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, X } from "lucide-react";
import TopoPattern from "@/components/patterns/TopoPattern";
import type { ChatMessage, SearchResult } from "@/types/tsa";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";

type Props = {
  open: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  thinking: boolean;
};

export default function ChatPanel({
  open,
  onClose,
  messages,
  onSend,
  thinking,
}: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [touchDeltaY, setTouchDeltaY] = useState(0);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab") {
        // Simple focus trap: keep focus inside the dialog.
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
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
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  const isEmpty = messages.length === 0;

  // Mobile swipe-down to close — only tracks gesture from the header area.
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
    setTouchDeltaY(0);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current == null) return;
    const dy = (e.touches[0]?.clientY ?? 0) - touchStartY.current;
    if (dy > 0) setTouchDeltaY(dy);
  };
  const onTouchEnd = () => {
    if (touchDeltaY > 90) onClose();
    setTouchDeltaY(0);
    touchStartY.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      {/* Backdrop — click closes (mobile only via media-query: hidden on sm+) */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close packing assistant"
        className="absolute inset-0 bg-ink-primary/30 backdrop-blur-sm sm:hidden"
        tabIndex={-1}
      />
      {/* Spacer that pushes the panel to the right on desktop */}
      <div className="hidden flex-1 sm:block" aria-hidden="true" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Packing assistant"
        tabIndex={-1}
        style={{
          transform: `translateY(${touchDeltaY}px)`,
          transition: touchDeltaY === 0 ? "transform 200ms ease-out" : "none",
        }}
        className="relative ml-auto flex h-full w-full flex-col overflow-hidden border-l border-border-soft bg-bg-base shadow-xl sm:w-[400px] grain-overlay"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <TopoPattern
            opacity={0.06}
            color="rgb(var(--accent-moss))"
            density="sparse"
            className="h-full w-full"
          />
        </div>

        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative flex items-center justify-between border-b border-border-soft bg-bg-base/85 px-4 py-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border-strong bg-bg-paper text-accent-moss">
              <Compass className="h-3.5 w-3.5" strokeWidth={1.8} />
            </span>
            <h2 className="font-display text-base font-bold text-ink-primary">
              Packing Assistant
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close packing assistant"
            className="rounded-full p-1 text-ink-tertiary transition-colors hover:bg-bg-paper hover:text-ink-primary"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="relative flex-1 overflow-y-auto">
          {isEmpty && !thinking ? (
            <EmptyState onChipClick={onSend} />
          ) : (
            <MessageList
              messages={messages}
              thinking={thinking}
              onSuggestionClick={(t) => onSend(t)}
            />
          )}
        </div>

        <div className="relative">
          <ChatInput
            onSend={onSend}
            disabled={thinking}
            showSuggestions={false}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

export type { SearchResult };
