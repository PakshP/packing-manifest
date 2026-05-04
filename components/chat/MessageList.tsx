"use client";

import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/tsa";
import MessageBubble from "./MessageBubble";

type Props = {
  messages: ChatMessage[];
  thinking: boolean;
  onSuggestionClick?: (term: string) => void;
};

function ThinkingDots() {
  return (
    <div className="flex justify-start">
      <div
        role="status"
        aria-label="Searching"
        className="inline-flex items-center gap-1 rounded-md rounded-tl-sm border border-border-soft bg-bg-paper px-3 py-2.5"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-tertiary [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-tertiary [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-tertiary" />
      </div>
    </div>
  );
}

export default function MessageList({
  messages,
  thinking,
  onSuggestionClick,
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, thinking]);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Conversation"
      className="flex flex-col gap-3 px-4 py-4"
    >
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          message={m}
          onSuggestionClick={onSuggestionClick}
        />
      ))}
      {thinking && <ThinkingDots />}
      <div ref={endRef} />
    </div>
  );
}
