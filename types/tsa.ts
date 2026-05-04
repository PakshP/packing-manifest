export type TsaItem = {
  name: string;
  description: string;
  carryOn: boolean;
  carryOnRaw: string;
  checked: boolean;
  checkedRaw: string;
  hasSpecialInstructions: boolean;
};

export type MatchType =
  | "exact"
  | "synonym"
  | "fuzzy"
  | "category"
  | "none"
  | "empty";

export type CategoryRule = {
  id: string;
  label: string;
  body: string;
  carryOnRaw?: string;
  checkedRaw?: string;
};

export type SearchResult =
  | { type: "exact"; query: string; item: TsaItem }
  | {
      type: "synonym";
      query: string;
      item: TsaItem;
      matchedTerm: string;
    }
  | {
      type: "fuzzy";
      query: string;
      item: TsaItem;
      score: number;
      suggestions: TsaItem[];
    }
  | {
      type: "category";
      query: string;
      rule: CategoryRule;
    }
  | {
      type: "none";
      query: string;
      suggestions: TsaItem[];
    }
  | { type: "empty"; query: string };

export type ChatRole = "user" | "bot";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  result?: SearchResult;
  timestamp: number;
};
