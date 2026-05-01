import type { AccentKey } from "@/types";

export const ACCENT_TEXT: Record<AccentKey, string> = {
  moss: "text-accent-moss",
  rust: "text-accent-rust",
  river: "text-accent-river",
  summit: "text-accent-summit",
};

export const ACCENT_BG: Record<AccentKey, string> = {
  moss: "bg-accent-moss",
  rust: "bg-accent-rust",
  river: "bg-accent-river",
  summit: "bg-accent-summit",
};

export const ACCENT_BG_SOFT: Record<AccentKey, string> = {
  moss: "bg-accent-moss/10",
  rust: "bg-accent-rust/10",
  river: "bg-accent-river/10",
  summit: "bg-accent-summit/10",
};

export const ACCENT_BORDER: Record<AccentKey, string> = {
  moss: "border-accent-moss",
  rust: "border-accent-rust",
  river: "border-accent-river",
  summit: "border-accent-summit",
};

export const ACCENT_RING: Record<AccentKey, string> = {
  moss: "ring-accent-moss/30",
  rust: "ring-accent-rust/30",
  river: "ring-accent-river/30",
  summit: "ring-accent-summit/30",
};

export const ACCENT_HEX_VAR: Record<AccentKey, string> = {
  moss: "rgb(var(--accent-moss))",
  rust: "rgb(var(--accent-rust))",
  river: "rgb(var(--accent-river))",
  summit: "rgb(var(--accent-summit))",
};
