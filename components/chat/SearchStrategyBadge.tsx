import type { MatchType } from "@/types/tsa";

type Props = {
  type: MatchType;
  score?: number;
};

const LABEL: Record<MatchType, string> = {
  exact: "exact match",
  synonym: "synonym match",
  fuzzy: "fuzzy match",
  category: "category rule",
  none: "no match",
  empty: "empty",
};

const DOT_COLOR: Record<MatchType, string> = {
  exact: "bg-accent-moss",
  synonym: "bg-accent-moss",
  fuzzy: "bg-accent-summit",
  category: "bg-accent-river",
  none: "bg-ink-tertiary",
  empty: "bg-ink-tertiary",
};

export default function SearchStrategyBadge({ type, score }: Props) {
  const label = LABEL[type];
  const text =
    type === "fuzzy" && typeof score === "number"
      ? `${label} · ${score.toFixed(2)}`
      : label;

  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-widest text-ink-tertiary"
      aria-label={`Match strategy: ${text}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${DOT_COLOR[type]}`}
      />
      {text}
    </span>
  );
}
