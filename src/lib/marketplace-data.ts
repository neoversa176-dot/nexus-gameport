export type Game = {
  slug: string;
  name: string;
  listings: number;
  hue: number;
  glyph: "orbit" | "shard" | "hex" | "bolt" | "cube" | "ring" | "star" | "wave";
};

export const GAMES: Game[] = [
  { slug: "roblox", name: "Roblox", listings: 48210, hue: 268, glyph: "cube" },
  { slug: "fortnite", name: "Fortnite", listings: 31984, hue: 285, glyph: "shard" },
  { slug: "valorant", name: "Valorant", listings: 27455, hue: 350, glyph: "bolt" },
  { slug: "league-of-legends", name: "League of Legends", listings: 25610, hue: 205, glyph: "ring" },
  { slug: "minecraft", name: "Minecraft", listings: 19870, hue: 140, glyph: "cube" },
  { slug: "old-school-runescape", name: "Old School RuneScape", listings: 18432, hue: 45, glyph: "hex" },
  { slug: "counter-strike-2", name: "Counter-Strike 2", listings: 16920, hue: 30, glyph: "star" },
  { slug: "call-of-duty", name: "Call of Duty", listings: 15211, hue: 90, glyph: "bolt" },
  { slug: "grand-theft-auto-v", name: "Grand Theft Auto V", listings: 13877, hue: 320, glyph: "wave" },
  { slug: "world-of-warcraft", name: "World of Warcraft", listings: 12440, hue: 220, glyph: "orbit" },
  { slug: "path-of-exile", name: "Path of Exile", listings: 9310, hue: 15, glyph: "shard" },
  { slug: "rocket-league", name: "Rocket League", listings: 8720, hue: 195, glyph: "ring" },
  { slug: "rainbow-six-siege", name: "Rainbow Six Siege", listings: 7640, hue: 240, glyph: "hex" },
  { slug: "pokemon", name: "Pokémon", listings: 6980, hue: 55, glyph: "orbit" },
  { slug: "brawl-stars", name: "Brawl Stars", listings: 5410, hue: 300, glyph: "star" },
];

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  cta: string;
  icon: "accounts" | "currency" | "items" | "boosting" | "topups" | "giftcards";
};

export const CATEGORIES: Category[] = [
  {
    slug: "accounts",
    name: "Accounts",
    tagline: "Ranked, stacked, ready",
    description: "Verified profiles with full inventories and transfer support.",
    cta: "Browse accounts",
    icon: "accounts",
  },
  {
    slug: "currency",
    name: "Currency",
    tagline: "Gold, coins, credits",
    description: "In-game funds delivered in minutes by rated sellers.",
    cta: "Buy currency",
    icon: "currency",
  },
  {
    slug: "items",
    name: "Items",
    tagline: "Skins, gear, loot",
    description: "Rare cosmetics and endgame gear across 400+ titles.",
    cta: "Find items",
    icon: "items",
  },
  {
    slug: "boosting",
    name: "Boosting",
    tagline: "Climb without the grind",
    description: "Pro players push your rank with progress tracking.",
    cta: "Get boosted",
    icon: "boosting",
  },
  {
    slug: "top-ups",
    name: "Top Ups",
    tagline: "Direct to your ID",
    description: "Instant recharges — no codes, no queues, no hassle.",
    cta: "Top up now",
    icon: "topups",
  },
  {
    slug: "gift-cards",
    name: "Gift Cards",
    tagline: "Stored value, instantly",
    description: "Platform balance and store credit at competitive rates.",
    cta: "Shop gift cards",
    icon: "giftcards",
  },
];

export type Listing = {
  id: string;
  title: string;
  game: string;
  category: string;
  price: number;
  oldPrice?: number;
  seller: { name: string; rating: number; reviews: number; verified: boolean; level: string };
  delivery: "Instant" | "15 min" | "1 hour" | "24 hours";
  stock: number;
  region: string;
  platform: string;
  server: string;
  rank: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  unit?: string;
  sold: number;
  description: string;
  included: string[];
};

const SELLERS = [
  { name: "NovaForge", rating: 4.9, reviews: 2841, verified: true, level: "Elite Seller" },
  { name: "PixelBarter", rating: 4.7, reviews: 1163, verified: true, level: "Trusted" },
  { name: "ArcLoot", rating: 4.8, reviews: 3920, verified: true, level: "Elite Seller" },
  { name: "QuietDagger", rating: 4.5, reviews: 431, verified: false, level: "Rising" },
  { name: "OrbitTrade", rating: 5.0, reviews: 764, verified: true, level: "Trusted" },
  { name: "HexMerchant", rating: 4.3, reviews: 208, verified: false, level: "Rising" },
];

const DELIVERIES: Listing["delivery"][] = ["Instant", "15 min", "1 hour", "24 hours"];
const REGIONS = ["Global", "North America", "Europe", "Asia", "Oceania"];
const PLATFORMS = ["PC", "PlayStation", "Xbox", "Mobile", "Cross-platform"];
const SERVERS = ["NA-East", "EU-West", "SEA", "Ladder", "Any"];
const RANKS = ["Unranked", "Gold", "Platinum", "Diamond", "Immortal"];
const RARITIES: Listing["rarity"][] = ["Common", "Rare", "Epic", "Legendary"];

const TITLE_PATTERNS: Record<string, string[]> = {
  accounts: ["{g} Full Access Account — {r} Tier", "{g} Veteran Account, Rare Cosmetics", "{g} Smurf Account, Fresh MMR"],
  currency: ["{g} Currency Bundle — Fast Payout", "{g} 10K Coin Package", "{g} Premium Gold Pack"],
  items: ["{g} {rar} Skin Bundle", "{g} Endgame Gear Set", "{g} Collector Item Crate"],
  "boosting": ["{g} Rank Boost to {r}", "{g} Placement Match Package", "{g} Season Grind Service"],
  "top-ups": ["{g} Direct ID Top Up", "{g} Season Pass Recharge", "{g} Premium Credits Top Up"],
  "gift-cards": ["{g} Store Gift Card", "{g} Balance Voucher", "{g} Digital Credit Card"],
};

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function build(): Listing[] {
  const out: Listing[] = [];
  let n = 0;
  for (const game of GAMES) {
    for (const cat of CATEGORIES) {
      const count = cat.slug === "accounts" || cat.slug === "currency" ? 3 : 2;
      for (let k = 0; k < count; k++) {
        n++;
        const seller = pick(SELLERS, n + k);
        const rarity = pick(RARITIES, n * 3 + k);
        const rank = pick(RANKS, n + k * 2);
        const base = 4 + ((n * 37 + k * 13) % 340) + (cat.slug === "accounts" ? 60 : 0);
        const price = Math.round(base * 100) / 100;
        const discounted = (n + k) % 4 === 0;
        const patterns = TITLE_PATTERNS[cat.slug];
        const title = pick(patterns, n + k)
          .replace("{g}", game.name)
          .replace("{r}", rank)
          .replace("{rar}", rarity);
        out.push({
          id: `${game.slug}-${cat.slug}-${k + 1}`,
          title,
          game: game.slug,
          category: cat.slug,
          price,
          oldPrice: discounted ? Math.round(price * 1.32 * 100) / 100 : undefined,
          seller,
          delivery: pick(DELIVERIES, n + k),
          stock: 1 + ((n * 7 + k) % 42),
          region: pick(REGIONS, n + k),
          platform: pick(PLATFORMS, n * 2 + k),
          server: pick(SERVERS, n + k * 3),
          rank,
          rarity,
          unit: cat.slug === "currency" ? "per 1K" : undefined,
          sold: 12 + ((n * 19 + k * 5) % 900),
          description: `${title} listed by ${seller.name}. Every order runs through GameVault escrow: funds are held until you confirm the goods landed exactly as described. Transfers are logged, timestamped and covered by our resolution team.`,
          included: [
            cat.slug === "accounts" ? "Original email + full recovery access" : "Verified source, no shared credentials",
            "Step-by-step delivery instructions in chat",
            `${game.name} region: ${pick(REGIONS, n + k)}`,
            "Free replacement window for 72 hours",
          ],
        });
      }
    }
  }
  return out;
}

export const LISTINGS: Listing[] = build();

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);
export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
export const listingById = (id: string) => LISTINGS.find((l) => l.id === id);

export const POPULAR_SEARCHES = [
  "Valorant Immortal account",
  "OSRS gold 100M",
  "Fortnite rare skins",
  "CS2 knife skins",
];
export const TRENDING_SEARCHES = [
  "Roblox limiteds",
  "WoW mythic boost",
  "Brawl Stars top up",
  "GTA V modded account",
];
export const RECENT_SEARCHES = ["Minecraft account", "Rocket League credits", "Pokémon shiny trade"];

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
};

export const REVIEWS: Review[] = [
  { id: "r1", author: "veilrunner", rating: 5, date: "3 days ago", body: "Delivered in under four minutes and the seller walked me through the transfer. Escrow released once I confirmed — smooth." },
  { id: "r2", author: "kilo_nine", rating: 5, date: "1 week ago", body: "Exactly as described. Inventory matched the screenshots down to the last item." },
  { id: "r3", author: "mossbyte", rating: 4, date: "2 weeks ago", body: "Small delay on delivery but support pinged the seller and it resolved fast. Would buy again." },
  { id: "r4", author: "harborlight", rating: 5, date: "3 weeks ago", body: "Third purchase from this seller. Consistent, communicative, no surprises." },
  { id: "r5", author: "tenpin", rating: 3, date: "1 month ago", body: "Fine overall, though the listing could have been clearer about region restrictions." },
];

export const RATING_DISTRIBUTION = [
  { stars: 5, count: 2140 },
  { stars: 4, count: 486 },
  { stars: 3, count: 122 },
  { stars: 2, count: 41 },
  { stars: 1, count: 52 },
];
