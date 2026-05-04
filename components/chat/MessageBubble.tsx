"use client";

import type { ChatMessage } from "@/types/tsa";
import ResultCard from "./ResultCard";

type Props = {
  message: ChatMessage;
  onSuggestionClick?: (term: string) => void;
};

export default function MessageBubble({ message, onSuggestionClick }: Props) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-md rounded-tr-sm bg-accent-moss/15 px-3 py-2 text-sm text-ink-primary">
          {message.content}
        </div>
      </div>
    );
  }

  // bot
  if (message.result) {
    return (
      <div className="max-w-full">
        <ResultCard
          result={message.result}
          onSuggestionClick={onSuggestionClick}
        />
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] rounded-md rounded-tl-sm border border-border-soft bg-bg-paper px-3 py-2 text-sm leading-relaxed text-ink-secondary">
        {message.content}
      </div>
    </div>
  );
}
