"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { searchTsa } from "@/lib/tsa-search";
import type { ChatMessage } from "@/types/tsa";

const STORAGE_KEY = "packing-manifest:chat-history-v1";
const MAX_MESSAGES = 50;
const THINK_DELAY_MS = 150;

function makeId(): string {
  return `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadFromStorage(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Light validation — drop entries that don't look like ChatMessage.
    return parsed.filter(
      (m): m is ChatMessage =>
        m && typeof m.id === "string" && (m.role === "user" || m.role === "bot")
    );
  } catch {
    return [];
  }
}

function trim(messages: ChatMessage[]): ChatMessage[] {
  if (messages.length <= MAX_MESSAGES) return messages;
  return messages.slice(messages.length - MAX_MESSAGES);
}

export function useChatStore() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const hydrated = useRef(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    setMessages(loadFromStorage());
    hydrated.current = true;
  }, []);

  // Persist on change (after hydration so we don't blow away storage with []).
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: makeId(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => trim([...prev, userMsg]));
    setThinking(true);

    // Tiny delay so the "thinking" state is perceptible and the UI doesn't
    // feel like it's racing the user.
    window.setTimeout(() => {
      const result = searchTsa(trimmed);

      if (process.env.NODE_ENV === "development") {
        // Telemetry hook: query + matched strategy. Useful for finding gaps
        // in synonyms / category patterns. No external service.
        // eslint-disable-next-line no-console
        console.log("[chat]", { query: trimmed, type: result.type });
      }

      const botContent =
        result.type === "exact" || result.type === "synonym" || result.type === "fuzzy"
          ? result.item.name
          : result.type === "category"
            ? result.rule.label
            : result.type === "none"
              ? "No match found"
              : "Try a specific item";

      const botMsg: ChatMessage = {
        id: makeId(),
        role: "bot",
        content: botContent,
        result,
        timestamp: Date.now(),
      };

      setMessages((prev) => trim([...prev, botMsg]));
      setThinking(false);
    }, THINK_DELAY_MS);
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  return { messages, send, clear, thinking };
}
