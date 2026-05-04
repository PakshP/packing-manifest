"use client";

import type { SearchResult, TsaItem } from "@/types/tsa";
import SearchStrategyBadge from "./SearchStrategyBadge";

type Props = {
  result: SearchResult;
  onSuggestionClick?: (term: string) => void;
};

function pillTone(raw: string): "allowed" | "conditional" | "prohibited" {
  if (/^no$/i.test(raw.trim())) return "prohibited";
  if (/special instructions|less than or equal/i.test(raw)) return "conditional";
  if (/^yes/i.test(raw.trim())) return "allowed";
  return "conditional";
}

const TONE_CLASS: Record<"allowed" | "conditional" | "prohibited", string> = {
  allowed: "bg-accent-moss/10 text-accent-moss border-accent-moss/30",
  conditional: "bg-accent-summit/10 text-accent-summit border-accent-summit/40",
  prohibited: "bg-accent-rust/10 text-accent-rust border-accent-rust/40",
};

function StatusPill({ label, raw }: { label: string; raw: string }) {
  const tone = pillTone(raw);
  return (
    <div
      className={`flex flex-col gap-0.5 rounded-md border px-3 py-2 ${TONE_CLASS[tone]}`}
    >
      <span className="font-mono text-[0.55rem] uppercase tracking-widest opacity-80">
        {label}
      </span>
      <span className="text-sm font-semibold leading-tight">{raw}</span>
    </div>
  );
}

function ItemView({ item }: { item: TsaItem }) {
  return (
    <>
      <h3 className="font-display text-base font-bold text-ink-primary">
        {item.name}
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <StatusPill label="Carry-on" raw={item.carryOnRaw} />
        <StatusPill label="Checked" raw={item.checkedRaw} />
      </div>
      {item.description && (
        <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
          {item.description}
        </p>
      )}
    </>
  );
}

function SuggestionChip({
  item,
  onClick,
}: {
  item: TsaItem;
  onClick?: (term: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(item.name)}
      className="inline-flex items-center rounded-full border border-border-soft bg-bg-paper px-3 py-1 text-xs font-medium text-ink-secondary transition-colors hover:border-border-strong hover:bg-bg-elevated hover:text-ink-primary"
    >
      {item.name}
    </button>
  );
}

export default function ResultCard({ result, onSuggestionClick }: Props) {
  if (result.type === "empty") {
    return (
      <div className="rounded-md border border-border-soft bg-bg-paper p-4">
        <p className="text-sm text-ink-secondary">
          Try a specific item — like &ldquo;razor&rdquo;, &ldquo;lithium battery&rdquo;,
          or &ldquo;peanut butter&rdquo;.
        </p>
      </div>
    );
  }

  if (result.type === "category") {
    return (
      <div className="rounded-md border border-l-4 border-border-soft border-l-accent-rust bg-bg-paper p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-bold text-ink-primary">
            {result.rule.label}
          </h3>
          <SearchStrategyBadge type={result.type} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          {result.rule.body}
        </p>
        {(result.rule.carryOnRaw || result.rule.checkedRaw) && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {result.rule.carryOnRaw && (
              <StatusPill label="Carry-on" raw={result.rule.carryOnRaw} />
            )}
            {result.rule.checkedRaw && (
              <StatusPill label="Checked" raw={result.rule.checkedRaw} />
            )}
          </div>
        )}
        <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-widest text-ink-tertiary">
          general rule — for a specific item, ask by name
        </p>
      </div>
    );
  }

  if (result.type === "none") {
    return (
      <div className="rounded-md border border-border-soft bg-bg-paper p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-bold text-ink-primary">
            No match found
          </h3>
          <SearchStrategyBadge type={result.type} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
          I couldn&rsquo;t find &ldquo;{result.query}&rdquo; in the TSA list. For
          authoritative answers, check{" "}
          <a
            href="https://www.tsa.gov/travel/security-screening/whatcanibring/all"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-river underline-offset-2 hover:underline"
          >
            tsa.gov/whatcanibring
          </a>
          .
        </p>
        {result.suggestions.length > 0 && (
          <div className="mt-3">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-tertiary">
              did you mean?
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {result.suggestions.map((s) => (
                <SuggestionChip
                  key={s.name}
                  item={s}
                  onClick={onSuggestionClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // exact / synonym / fuzzy
  return (
    <div className="rounded-md border border-border-soft bg-bg-paper p-4">
      <ItemView item={result.item} />
      {result.type === "fuzzy" && result.suggestions.length > 0 && (
        <div className="mt-3">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-tertiary">
            also see
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {result.suggestions.map((s) => (
              <SuggestionChip
                key={s.name}
                item={s}
                onClick={onSuggestionClick}
              />
            ))}
          </div>
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <SearchStrategyBadge
          type={result.type}
          score={result.type === "fuzzy" ? result.score : undefined}
        />
      </div>
    </div>
  );
}
