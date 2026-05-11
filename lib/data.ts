import type { ComponentType, SVGProps } from "react";
import {
  Backpack,
  Book,
  Box,
  Briefcase,
  Camera,
  Coffee,
  Compass,
  FileText,
  Gift,
  HeartPulse,
  Key,
  ListChecks,
  Lock,
  Luggage,
  Map as MapIcon,
  Mountain,
  Music,
  Package,
  Palette,
  Plug,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Tent,
  Utensils,
  Wallet,
} from "lucide-react";

import type { AccentKey, Bag, BagId, Category, PackingItem } from "@/types";

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const ICON_MAP: Record<string, LucideIcon> = {
  // Categories (defaults)
  documents: FileText,
  electronics: Plug,
  clothing: Shirt,
  health: HeartPulse,
  bagsSecurity: Lock,
  comfort: Coffee,
  extras: Sparkles,
  predeparture: ListChecks,

  // Bags (defaults)
  bagChecked: Luggage,
  bagDuffel: Package,
  bagCarryon: Briefcase,
  bagBackpack: Backpack,

  // Picker extras — usable by custom bags and categories.
  package: Package,
  backpack: Backpack,
  briefcase: Briefcase,
  luggage: Luggage,
  shoppingBag: ShoppingBag,
  shirt: Shirt,
  heart: HeartPulse,
  sparkles: Sparkles,
  list: ListChecks,
  coffee: Coffee,
  plug: Plug,
  lock: Lock,
  camera: Camera,
  book: Book,
  music: Music,
  map: MapIcon,
  gift: Gift,
  key: Key,
  wallet: Wallet,
  tent: Tent,
  mountain: Mountain,
  compass: Compass,
  star: Star,
  box: Box,
  sun: Sun,
  utensils: Utensils,
  palette: Palette,
};

// Icons offered in the customizer. Keys here must exist in ICON_MAP.
export const PICKER_ICON_KEYS: readonly string[] = [
  "package",
  "backpack",
  "briefcase",
  "luggage",
  "shoppingBag",
  "shirt",
  "heart",
  "sparkles",
  "list",
  "coffee",
  "plug",
  "lock",
  "camera",
  "book",
  "music",
  "map",
  "gift",
  "key",
  "wallet",
  "tent",
  "mountain",
  "compass",
  "star",
  "box",
  "sun",
  "utensils",
  "palette",
];

export const ACCENT_OPTIONS: readonly AccentKey[] = [
  "moss",
  "rust",
  "river",
  "summit",
];

export const INITIAL_BAGS: readonly Bag[] = [
  {
    id: "checked",
    name: "Checked Bag",
    shortName: "Checked",
    iconKey: "bagChecked",
    accent: "rust",
  },
  {
    id: "duffel",
    name: "Duffel",
    shortName: "Duffel",
    iconKey: "bagDuffel",
    accent: "moss",
  },
  {
    id: "carryon",
    name: "Carry-On",
    shortName: "Carry-On",
    iconKey: "bagCarryon",
    accent: "river",
  },
  {
    id: "backpack",
    name: "Daypack",
    shortName: "Daypack",
    iconKey: "bagBackpack",
    accent: "summit",
  },
];

export function bagsById(bags: readonly Bag[]): Record<BagId, Bag> {
  const map: Record<BagId, Bag> = {};
  for (const bag of bags) map[bag.id] = bag;
  return map;
}

export const DEFAULT_BAG_IDS: ReadonlySet<BagId> = new Set(
  INITIAL_BAGS.map((b) => b.id)
);

// ---------------------------------------------------------------------
// Default items — one month of travel, packed for serious adventures.
// ---------------------------------------------------------------------

const docs = (id: string, name: string, bag: BagId | null): PackingItem => ({
  id: `docs_${id}`,
  name,
  bag,
});
const elec = (id: string, name: string, bag: BagId | null): PackingItem => ({
  id: `elec_${id}`,
  name,
  bag,
});
const cloth = (id: string, name: string, bag: BagId | null): PackingItem => ({
  id: `cloth_${id}`,
  name,
  bag,
});
const health = (id: string, name: string, bag: BagId | null): PackingItem => ({
  id: `health_${id}`,
  name,
  bag,
});
const bags = (id: string, name: string, bag: BagId | null): PackingItem => ({
  id: `bags_${id}`,
  name,
  bag,
});
const comfort = (id: string, name: string, bag: BagId | null): PackingItem => ({
  id: `comfort_${id}`,
  name,
  bag,
});
const extras = (id: string, name: string, bag: BagId | null): PackingItem => ({
  id: `extras_${id}`,
  name,
  bag,
});
const pre = (id: string, name: string): PackingItem => ({
  id: `pre_${id}`,
  name,
  bag: null,
});

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "documents",
    name: "Documents & Money",
    subtitle: "The papers that get you across borders.",
    iconKey: "documents",
    accent: "river",
    items: [
      docs("passport", "Passport", "carryon"),
      docs("passport_copies", "Passport copies × 2", "checked"),
      docs("visa", "Visa documents", "carryon"),
      docs("drivers_license", "Driver's license / national ID", "carryon"),
      docs("intl_drivers", "International driving permit", "carryon"),
      docs("credit_primary", "Credit card — primary", "carryon"),
      docs("credit_backup", "Credit card — backup", "carryon"),
      docs("debit", "Debit card", "carryon"),
      docs("cash_local", "Cash — local currency", "carryon"),
      docs("cash_usd", "Cash — USD backup", "carryon"),
      docs("insurance", "Travel insurance card + policy #", "carryon"),
      docs("vaccinations", "Vaccination & health records", "carryon"),
      docs("emergency_contacts", "Emergency contact list", "carryon"),
      docs("itinerary", "Trip itinerary printout", "carryon"),
      docs("reservations", "Hotel & lodging confirmations", "carryon"),
    ],
  },
  {
    id: "electronics",
    name: "Electronics & Chargers",
    subtitle: "Power, signal, and a way to remember it all.",
    iconKey: "electronics",
    accent: "river",
    items: [
      elec("phone", "Phone", "carryon"),
      elec("phone_charger", "Phone charger + cable", "carryon"),
      elec("laptop", "Laptop", "carryon"),
      elec("laptop_charger", "Laptop charger", "carryon"),
      elec("tablet", "Tablet or e-reader", "carryon"),
      elec("adapter", "Universal travel adapter", "carryon"),
      elec("power_bank", "Power bank — 10,000 mAh", "carryon"),
      elec("usbc_cable", "USB-C cable — spare", "carryon"),
      elec("lightning_cable", "Lightning cable — spare", "carryon"),
      elec("wired_headphones", "Wired headphones (plane jack)", "carryon"),
      elec("wireless_buds", "Wireless earbuds / AirPods", "carryon"),
      elec("camera", "Camera", "carryon"),
      elec("camera_battery", "Camera charger + spare battery", "carryon"),
      elec("sd_cards", "SD cards / storage", "carryon"),
      elec("airtag_checked", "AirTag — checked bag", "checked"),
      elec("airtag_daypack", "AirTag — daypack", "backpack"),
    ],
  },
  {
    id: "clothing",
    name: "Clothing",
    subtitle: "One month, mixed and matched.",
    iconKey: "clothing",
    accent: "moss",
    items: [
      cloth("tee", "T-shirts × 7", "duffel"),
      cloth("long_sleeve", "Long-sleeve shirts × 3", "duffel"),
      cloth("button_up", "Button-up shirts × 2", "duffel"),
      cloth("travel_pants", "Lightweight travel pants × 2", "duffel"),
      cloth("jeans", "Jeans", "duffel"),
      cloth("shorts", "Shorts × 2", "duffel"),
      cloth("underwear", "Underwear × 10", "duffel"),
      cloth("socks", "Socks × 10", "duffel"),
      cloth("wool_socks", "Wool / hiking socks × 3", "duffel"),
      cloth("sleep", "Sleep clothes / pajamas", "duffel"),
      cloth("swim", "Swimsuit", "duffel"),
      cloth("hiking_boots", "Hiking / trail shoes", "checked"),
      cloth("sneakers", "Casual sneakers", "duffel"),
      cloth("sandals", "Sandals / flip-flops", "duffel"),
      cloth("fleece", "Fleece / mid-layer", "carryon"),
      cloth("rain_shell", "Rain shell / packable jacket", "carryon"),
      cloth("warm_hat", "Warm beanie", "duffel"),
      cloth("sun_hat", "Sun hat / cap", "duffel"),
      cloth("sunglasses", "Sunglasses", "carryon"),
      cloth("belt", "Belt", "duffel"),
      cloth("buff", "Buff / neck gaiter", "duffel"),
      cloth("gloves", "Light gloves", "duffel"),
      cloth("travel_towel", "Quick-dry travel towel", "duffel"),
    ],
  },
  {
    id: "health",
    name: "Toiletries & Health",
    subtitle: "Hygiene, healing, and high-altitude defense.",
    iconKey: "health",
    accent: "rust",
    items: [
      health("toothbrush", "Toothbrush + cover", "duffel"),
      health("toothpaste", "Toothpaste", "duffel"),
      health("floss", "Floss", "duffel"),
      health("deodorant", "Deodorant", "duffel"),
      health("shampoo", "Shampoo / body wash", "duffel"),
      health("conditioner", "Conditioner", "duffel"),
      health("razor", "Razor + spare blades", "duffel"),
      health("sunscreen_face", "Sunscreen — face, SPF 50", "carryon"),
      health("sunscreen_body", "Sunscreen — body", "duffel"),
      health("lip_balm", "Lip balm with SPF", "carryon"),
      health("insect_repel", "Insect repellent (DEET / picaridin)", "duffel"),
      health("hairbrush", "Hairbrush / comb", "duffel"),
      health("nail_clippers", "Nail clippers", "duffel"),
      health("tweezers", "Tweezers", "duffel"),
      health("contacts", "Contact lenses + solution", "carryon"),
      health("glasses", "Glasses + spare pair", "carryon"),
      health("meds_rx", "Prescription medications", "carryon"),
      health("first_aid", "Mini first-aid kit", "duffel"),
      health("pain_relief", "Pain relief / ibuprofen", "carryon"),
      health("anti_diarrheal", "Anti-diarrheal meds", "duffel"),
      health("rehydration", "Rehydration salts / electrolytes", "duffel"),
      health("hand_sanitizer", "Hand sanitizer", "carryon"),
      health("wet_wipes", "Wet wipes", "carryon"),
      health("tissues", "Pocket tissues", "carryon"),
      health("earplugs", "Earplugs", "carryon"),
    ],
  },
  {
    id: "bagsSecurity",
    name: "Bags & Security",
    subtitle: "What carries the gear and keeps it yours.",
    iconKey: "bagsSecurity",
    accent: "summit",
    items: [
      bags("checked", "Checked bag / large duffel", "checked"),
      bags("carryon", "Carry-on bag", "carryon"),
      bags("daypack", "Daypack / packable backpack", "backpack"),
      bags("packing_cubes", "Packing cubes — set of 4", "duffel"),
      bags("compression", "Compression sacks", "duffel"),
      bags("laundry_bag", "Laundry bag", "duffel"),
      bags("locks", "TSA luggage locks × 2", "carryon"),
      bags("cable_lock", "Cable lock for hostels / trains", "backpack"),
      bags("money_belt", "Money belt / hidden pouch", "carryon"),
      bags("rfid_sleeves", "RFID-blocking sleeves", "carryon"),
      bags("luggage_tags", "Luggage tags", "checked"),
      bags("shopping_bag", "Packable shopping bag", "backpack"),
    ],
  },
  {
    id: "comfort",
    name: "Travel Comfort",
    subtitle: "For long flights and longer days.",
    iconKey: "comfort",
    accent: "river",
    items: [
      comfort("neck_pillow", "Neck pillow", "carryon"),
      comfort("eye_mask", "Eye mask", "carryon"),
      comfort("compression_socks", "Compression socks for flights", "carryon"),
      comfort("water_bottle", "Reusable water bottle", "backpack"),
      comfort("collapsible_cup", "Collapsible cup", "backpack"),
      comfort("snacks", "Snacks / protein bars", "carryon"),
      comfort("travel_mug", "Travel mug", "backpack"),
      comfort("umbrella", "Compact umbrella", "backpack"),
      comfort("rain_poncho", "Packable rain poncho", "backpack"),
      comfort("blanket", "Travel blanket / sarong", "carryon"),
      comfort("fan", "Hand-held fan", "carryon"),
    ],
  },
  {
    id: "extras",
    name: "Nice-to-Haves",
    subtitle: "Small luxuries that change a trip.",
    iconKey: "extras",
    accent: "summit",
    items: [
      extras("translation", "Translation app — downloaded offline", null),
      extras("offline_maps", "Offline maps downloaded", null),
      extras("journal", "Travel journal + pen", "backpack"),
      extras("book", "Book or downloaded e-book", "backpack"),
      extras("playing_cards", "Playing cards", "backpack"),
      extras("gifts", "Small gifts for hosts", "duffel"),
      extras("sewing_kit", "Mini sewing kit", "duffel"),
      extras("duct_tape", "Duct tape — pocket roll", "duffel"),
      extras("carabiner", "Carabiner", "backpack"),
      extras("headlamp", "Headlamp / mini flashlight", "backpack"),
      extras("multi_tool", "Multi-tool / Swiss Army knife", "checked"),
      extras("ziplocs", "Ziploc bags — assorted sizes", "duffel"),
      extras("safety_pins", "Safety pins + binder clips", "duffel"),
      extras("pocket_notebook", "Pocket notebook + pen", "carryon"),
    ],
  },
  {
    id: "predeparture",
    name: "Before You Leave",
    subtitle: "House and home, squared away.",
    iconKey: "predeparture",
    accent: "rust",
    items: [
      pre("hold_mail", "Pause mail / set up hold"),
      pre("autopay", "Set up auto-pay for bills"),
      pre("bank_notice", "Notify bank of travel dates"),
      pre("card_notice", "Set credit card travel notice"),
      pre("charge_devices", "Charge all electronics"),
      pre("offline_maps", "Download offline maps for destinations"),
      pre("offline_media", "Download movies / podcasts / music"),
      pre("boarding_passes", "Save & print boarding passes"),
      pre("checkin", "Check in 24 hr before flight"),
      pre("confirm_hotels", "Reconfirm first-night lodging"),
      pre("perishables", "Empty fridge of perishables"),
      pre("trash", "Take out trash"),
      pre("thermostat", "Set thermostat / unplug appliances"),
      pre("plants", "Arrange plant care"),
      pre("pets", "Arrange pet care"),
      pre("lock_up", "Lock all doors and windows"),
      pre("share_itinerary", "Share itinerary with family"),
      pre("passport_carryon", "Pack passport in carry-on, never checked"),
    ],
  },
];

export const DEFAULT_CATEGORY_IDS: ReadonlySet<string> = new Set(
  INITIAL_CATEGORIES.map((c) => c.id)
);
