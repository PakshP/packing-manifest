import type { CategoryRule } from "@/types/tsa";

// Each rule has a regex (specific enough to avoid false matches) and a
// human-readable summary of TSA's general policy. These fire only when no
// exact / synonym / fuzzy match landed.
export type CategoryPattern = {
  pattern: RegExp;
  rule: CategoryRule;
};

export const TSA_CATEGORIES: CategoryPattern[] = [
  {
    pattern:
      /\b(liquid|gel|cream|paste|toiletr(y|ies)|shampoo|conditioner|toothpaste|lotion|sunscreen|moisturiz|serum)\b/i,
    rule: {
      id: "liquids-3-1-1",
      label: "Liquids, gels & creams",
      body:
        "Carry-on follows the 3-1-1 rule: containers must be 3.4oz (100ml) or smaller, all fitting in one quart-sized clear bag, one bag per passenger. Larger sizes must go in checked baggage.",
      carryOnRaw: "Yes (Less than or equal to 3.4oz/100 ml allowed)",
      checkedRaw: "Yes",
    },
  },
  {
    pattern:
      /\b(lithium|power\s*bank|portable\s*charger|external\s*battery)\b/i,
    rule: {
      id: "lithium-batteries",
      label: "Lithium batteries & power banks",
      body:
        "Spare lithium batteries and power banks must travel in carry-on bags only — they are prohibited in checked baggage due to fire risk. Devices with installed batteries can go in either, but carry-on is preferred.",
      carryOnRaw: "Yes",
      checkedRaw: "No",
    },
  },
  {
    pattern: /\b(knife|knives|blade|sword|machete|dagger|sharp)\b/i,
    rule: {
      id: "sharps",
      label: "Knives & sharp blades",
      body:
        "Most knives and sharp blades are prohibited in carry-on baggage. They must be packed in checked bags, securely sheathed or wrapped to protect baggage handlers.",
      carryOnRaw: "No",
      checkedRaw: "Yes (Special Instructions)",
    },
  },
  {
    pattern:
      /\b(firework|firecracker|explosive|dynamite|tnt|grenade|c4|gunpowder)\b/i,
    rule: {
      id: "explosives",
      label: "Fireworks & explosives",
      body:
        "Fireworks, explosives, and similar items are prohibited in both carry-on and checked baggage — no exceptions.",
      carryOnRaw: "No",
      checkedRaw: "No",
    },
  },
  {
    pattern: /\b(aerosol|spray)\b/i,
    rule: {
      id: "aerosols",
      label: "Aerosols & sprays",
      body:
        "Personal-care aerosols (deodorant, hairspray) are allowed under the 3-1-1 rule in carry-on, and up to 70oz total in checked bags with each container ≤18oz. Hazardous aerosols (insecticides, flammable paint, self-defense sprays except small pepper spray) are prohibited.",
      carryOnRaw: "Yes (Special Instructions)",
      checkedRaw: "Yes (Special Instructions)",
    },
  },
  {
    pattern: /\b(firearm|gun|pistol|rifle|ammo|ammunition|bullet)\b/i,
    rule: {
      id: "firearms",
      label: "Firearms & ammunition",
      body:
        "Firearms must be unloaded, in a locked hard-sided case, and declared at the airline check-in counter. They are never permitted in carry-on. Ammunition must be securely boxed; check airline limits.",
      carryOnRaw: "No",
      checkedRaw: "Yes (Special Instructions)",
    },
  },
  {
    pattern:
      /\b(food|meal|snack|meat|cheese|fruit|vegetable|bread|sandwich|cookie|cake|pie)\b/i,
    rule: {
      id: "food",
      label: "Food",
      body:
        "Solid foods are generally allowed in both carry-on and checked bags. Liquid or gel-like foods (yogurt, soup, sauces, peanut butter, creamy cheese) follow the 3-1-1 rule in carry-on.",
      carryOnRaw: "Yes (Special Instructions)",
      checkedRaw: "Yes",
    },
  },
  {
    pattern: /\b(powder|protein\s*powder|baby\s*powder|spice)\b/i,
    rule: {
      id: "powders",
      label: "Powders",
      body:
        "Powder-like substances over 12oz / 350ml in carry-on may require additional screening and could be prohibited if they cannot be resolved at the checkpoint. They are unrestricted in checked baggage.",
      carryOnRaw: "Yes (Special Instructions)",
      checkedRaw: "Yes",
    },
  },
];

export function findCategoryRule(query: string): CategoryRule | null {
  const lower = query.toLowerCase();
  for (const { pattern, rule } of TSA_CATEGORIES) {
    if (pattern.test(lower)) return rule;
  }
  return null;
}
