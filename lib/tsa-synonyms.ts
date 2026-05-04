// Maps common phrasings to canonical TSA item names.
// Keys are lowercase, normalized (no plural endings handled here -- the
// search engine strips trailing 's' before lookup).
export const TSA_SYNONYMS: Record<string, string> = {
  // Razors / shaving
  "razor": "Disposable Razor",
  "razor blade": "Razor-Type Blades",
  "safety razor": "Safety Razor With Blades (allowed without blade)",
  "electric razor": "Electric Razors",
  "shaver": "Electric Razors",
  "shaving cream": "Shaving Cream (aerosol)",

  // Knives
  "knife": "Knives",
  "pocketknife": "Pocket Knife",
  "pocket knife": "Pocket Knife",
  "swiss army": "Swiss Army Knife",
  "utility knife": "Utility Knives/Knife",
  "box cutter": "Utility Knives/Knife",

  // Batteries / power
  "battery": "Dry batteries (AA, AAA, C, and D)",
  "aa battery": "Dry batteries (AA, AAA, C, and D)",
  "aaa battery": "Dry batteries (AA, AAA, C, and D)",
  "lithium battery": "Lithium batteries with 100 watt hours or less in a device",
  "lithium": "Lithium batteries with 100 watt hours or less in a device",
  "power bank": "Power Banks",
  "powerbank": "Power Banks",
  "portable charger": "Power Banks",
  "phone charger": "Phone Chargers",
  "charger": "Power Charger",

  // Drinks
  "alcohol": "Alcoholic beverages",
  "beer": "Alcoholic beverages",
  "wine": "Alcoholic beverages",
  "liquor": "Alcoholic beverages",
  "spirits": "Alcoholic beverages",
  "everclear": "Alcoholic beverages over 140 proof",
  "bourbon": "Alcoholic beverages",
  "whiskey": "Alcoholic beverages",
  "whisky": "Alcoholic beverages",
  "vodka": "Alcoholic beverages",
  "gin": "Alcoholic beverages",
  "rum": "Alcoholic beverages",
  "tequila": "Alcoholic beverages",
  "champagne": "Alcoholic beverages",

  // Fire / lighters
  "lighter": "Lighters (Disposable and Zippo)",
  "zippo": "Lighters (Disposable and Zippo)",
  "torch lighter": "Lighters (Torch)",
  "lighter fluid": "Lighter (Fluid)",
  "matches": "Lighters (Disposable and Zippo)",

  // Sharps / personal care
  "scissors": "Scissors",
  "tweezers": "Tweezers",
  "nail clipper": "Nail Clippers",
  "nail file": "Nail File (metal)",
  "nail polish": "Nail Polish",

  // Toiletries
  "lotion": "Lotion",
  "sunscreen": "Sunscreen",
  "shampoo": "Shampoo",
  "conditioner": "Conditioner",
  "toothpaste": "Toothpaste",
  "deodorant": "Deodorant (Solid)",
  "perfume": "Perfume",
  "cologne": "Cologne",
  "hairspray": "Hair Spray",
  "hair spray": "Hair Spray",
  "hair gel": "Hair Gel",
  "dry shampoo": "Dry Shampoo (aerosol)",

  // Vape / smoking
  "vape": "Electronic Cigarettes and Vaping Devices",
  "e-cig": "Electronic Cigarettes and Vaping Devices",
  "e cigarette": "Electronic Cigarettes and Vaping Devices",
  "vape pen": "Electronic Cigarettes and Vaping Devices",
  "e-liquid": "E-liquids",
  "vape juice": "E-liquids",

  // Self defense
  "pepper spray": "Pepper Spray",
  "mace": "Self-Defense Sprays",
  "self defense": "Self-Defense Sprays",
  "bear spray": "Bear spray",
  "stun gun": "Stun Guns/Shocking Devices",
  "taser": "Stun Guns/Shocking Devices",

  // Medical
  "epipen": "EpiPens",
  "insulin": "Insulin",
  "inhaler": "Inhalers",
  "syringe": "Unused Syringes",
  "needle": "Unused Syringes",
  "pill": "Medications (Pills)",
  "medication": "Medications (Pills)",
  "medicine": "Medications (Pills)",
  "weed": "Medical Marijuana",
  "marijuana": "Medical Marijuana",
  "cannabis": "Medical Marijuana",

  // Food
  "peanut butter": "Peanut Butter",
  "baby formula": "Baby Formula",
  "baby food": "Baby Food",
  "sandwich": "Sandwiches",
  "cake": "Pies and Cakes",
  "pie": "Pies and Cakes",
  "cookie": "Cookies",
  "ice cream": "Ice cream",

  // Tech
  "laptop": "Laptops",
  "tablet": "Tablets",
  "ipad": "Tablets",
  "phone": "Cell Phones",
  "cellphone": "Cell Phones",
  "headphone": "Headphones",
  "earbud": "Headphones",
  "drone": "Drones, Unmanned Aircraft Systems (UAS)",
  "camera": "Digital Cameras",

  // Sports / outdoor
  "fishing pole": "Fishing pole",
  "fishing rod": "Fishing pole",
  "ski pole": "Ski Poles",
  "skateboard": "Skateboards",
  "bike": "Bicycles",
  "bicycle": "Bicycles",
  "golf club": "Golf Clubs",
  "baseball bat": "Baseball Bats",
  "hockey stick": "Hockey Sticks",
  "umbrella": "Umbrellas",

  // Tools
  "drill": "Drills and Drill Bits",
  "hammer": "Hammers",
  "screwdriver": "Screwdrivers (shorter than 7 inches)",
  "wrench": "Wrenches/Pliers",
  "pliers": "Wrenches/Pliers",
  "multitool": "Multi-tools",
  "leatherman": "Multi-tools",

  // Firearms
  "gun": "Firearms, Firearm Silencers/Suppressors",
  "firearm": "Firearms, Firearm Silencers/Suppressors",
  "pistol": "Firearms, Firearm Silencers/Suppressors",
  "rifle": "Rifles",
  "ammo": "Ammunition",
  "ammunition": "Ammunition",
  "bb gun": "BB Guns",
  "bullet": "Ammunition",

  // Misc
  "firework": "Fireworks",
  "firecracker": "Firecracker",
  "flare": "Flares",
  "flower": "Flowers",
  "seed": "Planting seeds",
  "plant": "Plants",
  "christmas lights": "Christmas Lights",
};
