"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
  showSuggestions: boolean;
  autoFocus?: boolean;
};

const SUGGESTIONS = [
  "razor",
  "lithium battery",
  "lighter",
  "alcohol",
  "peanut butter",
  "pepper spray",
];

export default function ChatInput({
  onSend,
  disabled,
  showSuggestions,
  autoFocus,
}: Props) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const showChips = showSuggestions && value.length === 0;

  return (
    <div className="border-t border-border-soft bg-bg-base/95 backdrop-blur-sm">
      {showChips && (
        <div className="flex flex-wrap gap-1.5 px-4 pt-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSend(s)}
              className="rounded-full border border-border-soft bg-bg-paper px-3 py-1 text-xs text-ink-secondary transition-colors hover:border-border-strong hover:text-ink-primary"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex items-end gap-2 px-4 py-3">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="Can I bring..."
          aria-label="Ask the packing assistant"
          className="flex-1 rounded-md border border-border-soft bg-bg-paper px-3 py-2 text-sm text-ink-primary placeholder:text-ink-tertiary transition-colors focus:border-border-strong focus:outline-none focus:ring-0 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || value.trim().length === 0}
          aria-label="Send"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-moss text-white transition-colors hover:bg-accent-moss/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
