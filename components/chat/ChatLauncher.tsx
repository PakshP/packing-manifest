"use client";

import { Compass } from "lucide-react";

type Props = {
  onClick: () => void;
  open: boolean;
};

export default function ChatLauncher({ onClick, open }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open packing assistant"
      aria-hidden={open ? "true" : undefined}
      tabIndex={open ? -1 : 0}
      className={`fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-moss text-white shadow-lg ring-1 ring-accent-moss/30 transition-all hover:scale-105 active:scale-95 ${
        open ? "pointer-events-none scale-90 opacity-0" : "opacity-100"
      }`}
    >
      <Compass className="h-5 w-5" strokeWidth={1.8} />
    </button>
  );
}
