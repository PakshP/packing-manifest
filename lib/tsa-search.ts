import Fuse from "fuse.js";
import tsaDataRaw from "@/lib/tsa-data.json";
import { TSA_SYNONYMS } from "@/lib/tsa-synonyms";
import { findCategoryRule } from "@/lib/tsa-categories";
import type { SearchResult, TsaItem } from "@/types/tsa";

const TSA_DATA = tsaDataRaw as TsaItem[];

// Phrases stripped before searching. Order matters slightly: longer phrases
// first so we don't leave dangling fragments.
const FILLER_PATTERNS: RegExp[] = [
  /\bcan\s+i\s+(bring|pack|take|carry|fly\s+with|put)\b/gi,
  /\bis\s+it\s+(ok|okay|fine|safe|allowed|legal)\s+to\s+(bring|pack|take|carry)\b/gi,
  /\bare\s+\w+\s+(allowed|permitted)\b/gi,
  /\b(in|on|for|to)\s+(my|the|a|an)\s+(carry[- ]?on|carryon|checked\s*bag|checked\s*luggage|hand\s*luggage|hand\s*bag|suitcase|backpack|luggage|plane|flight|airplane)\b/gi,
  /\b(carry[- ]?on|carryon|checked\s*bag|checked\s*luggage|hand\s*luggage|hand\s*bag)\b/gi,
  /\b(through|past|at)\s+(security|tsa|the\s+airport)\b/gi,
  /\bon\s+(a|the)\s+(plane|flight|airplane)\b/gi,
  /\b(tsa|airport|airline|airplane|plane|flight)\b/gi,
  /\b(allowed|permitted|prohibited)\b/gi,
  /\b(my|the|a|an|some|any|this|that|these|those)\b/gi,
  /\b(please|thanks|thank\s+you|hi|hello|hey)\b/gi,
  /[?!.,;:]+/g,
];

export function stripFiller(query: string): string {
  let cleaned = query.toLowerCase();
  for (const re of FILLER_PATTERNS) cleaned = cleaned.replace(re, " ");
  return cleaned.replace(/\s+/g, " ").trim();
}

// Lightweight singularization: razors → razor, knives → knife, batteries → battery.
// Only applied for synonym lookup; we don't mutate the user's query for display.
function singularize(word: string): string {
  if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
  if (word.endsWith("ves") && word.length > 4) return word.slice(0, -3) + "fe";
  if (word.endsWith("ses") || word.endsWith("xes") || word.endsWith("zes"))
    return word.slice(0, -2);
  if (word.endsWith("s") && !word.endsWith("ss") && word.length > 3)
    return word.slice(0, -1);
  return word;
}

function normalizeForLookup(text: string): string {
  return text
    .split(/\s+/)
    .map((w) => singularize(w))
    .join(" ")
    .trim();
}

// Build name index once.
const NAME_INDEX = new Map<string, TsaItem>();
for (const item of TSA_DATA) {
  NAME_INDEX.set(item.name.toLowerCase(), item);
}

// Module-level Fuse instance — built once.
const fuse = new Fuse(TSA_DATA, {
  keys: [
    { name: "name", weight: 0.7 },
    { name: "description", weight: 0.3 },
  ],
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

const FUZZY_CONFIDENCE = 0.45;

function tryExact(query: string): TsaItem | null {
  const direct = NAME_INDEX.get(query);
  if (direct) return direct;
  const normalized = normalizeForLookup(query);
  if (normalized !== query) {
    const norm = NAME_INDEX.get(normalized);
    if (norm) return norm;
  }
  return null;
}

function trySynonym(query: string): { item: TsaItem; matchedTerm: string } | null {
  const normalized = normalizeForLookup(query);
  // Try the full string first.
  const candidates = [query, normalized];
  for (const c of candidates) {
    const target = TSA_SYNONYMS[c];
    if (target) {
      const item = NAME_INDEX.get(target.toLowerCase());
      if (item) return { item, matchedTerm: c };
    }
  }
  // Try individual tokens (e.g. "lithium" inside a longer phrase).
  const tokens = normalized.split(/\s+/).filter(Boolean);
  for (let len = tokens.length; len >= 1; len--) {
    for (let start = 0; start + len <= tokens.length; start++) {
      const phrase = tokens.slice(start, start + len).join(" ");
      const target = TSA_SYNONYMS[phrase];
      if (target) {
        const item = NAME_INDEX.get(target.toLowerCase());
        if (item) return { item, matchedTerm: phrase };
      }
    }
  }
  return null;
}

export function searchTsa(rawQuery: string): SearchResult {
  const trimmedRaw = rawQuery.trim();
  if (!trimmedRaw) return { type: "empty", query: rawQuery };

  const cleaned = stripFiller(trimmedRaw);
  if (!cleaned) return { type: "empty", query: rawQuery };

  // 1. Exact name match
  const exact = tryExact(cleaned);
  if (exact) return { type: "exact", query: rawQuery, item: exact };

  // 2. Synonym map
  const syn = trySynonym(cleaned);
  if (syn)
    return {
      type: "synonym",
      query: rawQuery,
      item: syn.item,
      matchedTerm: syn.matchedTerm,
    };

  // 3. Fuzzy (Fuse.js)
  const fuseResults = fuse.search(cleaned).slice(0, 5);
  const top = fuseResults[0];
  if (top && (top.score ?? 1) <= FUZZY_CONFIDENCE) {
    const score = 1 - (top.score ?? 0); // surface as confidence (higher = better)
    const suggestions = fuseResults
      .slice(1, 3)
      .map((r) => r.item)
      .filter((it) => it.name !== top.item.name);
    return {
      type: "fuzzy",
      query: rawQuery,
      item: top.item,
      score,
      suggestions,
    };
  }

  // 4. Category fallback
  const category = findCategoryRule(cleaned);
  if (category) return { type: "category", query: rawQuery, rule: category };

  // 5. None — surface the closest fuzzy hits as suggestions even if below threshold
  const suggestions = fuseResults.slice(0, 3).map((r) => r.item);
  return { type: "none", query: rawQuery, suggestions };
}
