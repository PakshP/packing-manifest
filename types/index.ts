export type BagId = "checked" | "duffel" | "carryon" | "backpack";

export type AccentKey = "moss" | "rust" | "river" | "summit";

export type Bag = {
  id: BagId;
  name: string;
  shortName: string;
  iconKey: string;
  accent: AccentKey;
};

export type PackingItem = {
  id: string;
  name: string;
  bag: BagId | null;
};

export type Category = {
  id: string;
  name: string;
  subtitle: string;
  iconKey: string;
  accent: AccentKey;
  items: PackingItem[];
};

export type CheckedMap = Record<string, boolean>;

export type PackingListRow = {
  id: string;
  user_id: string;
  categories: Category[];
  checked_items: CheckedMap;
  created_at: string;
  updated_at: string;
};

export type SaveStatus = "" | "saving" | "saved";

export type ViewMode = "category" | "bag";
