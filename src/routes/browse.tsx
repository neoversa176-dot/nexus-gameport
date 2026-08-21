import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronDown,
  Filter,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Star,
  X,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES, GAMES, LISTINGS, type Listing } from "@/lib/marketplace-data";
import { ProductCard } from "@/components/product-card";
import { formatPrice, useStore } from "@/lib/store";

type BrowseSearch = { q?: string; game?: string; category?: string; view?: "games" };

export const Route = createFileRoute("/browse")({
  validateSearch: (search: Record<string, unknown>): BrowseSearch => ({
    ...(typeof search["q"] === "string" && search["q"] ? { q: search["q"] } : {}),
    ...(typeof search["game"] === "string" && search["game"] ? { game: search["game"] } : {}),
    ...(typeof search["category"] === "string" && search["category"] ? { category: search["category"] } : {}),
    ...(search["view"] === "games" ? { view: "games" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Browse the GameVault marketplace — accounts, currency, items & boosts" },
      {
        name: "description",
        content:
          "Filter thousands of escrow-protected gaming listings by game, category, price, seller rating, delivery speed and platform on GameVault.",
      },
      { property: "og:title", content: "Browse the GameVault marketplace" },
      {
        property: "og:description",
        content: "Escrow-protected accounts, currency, items, boosts and top-ups from rated sellers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrowsePage,
});

const SORTS = [
  { id: "relevance", label: "Best match" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Seller rating" },
  { id: "sold", label: "Most sold" },
] as const;

const DELIVERY_OPTIONS: Listing["delivery"][] = ["Instant", "15 min", "1 hour", "24 hours"];
const REGIONS = ["Global", "North America", "Europe", "Asia", "Oceania"];
const PLATFORMS = ["PC", "PlayStation", "Xbox", "Mobile", "Cross-platform"];
const SERVERS = ["NA-East", "EU-West", "SEA", "Ladder", "Any"];
const RANKS = ["Unranked", "Gold", "Platinum", "Diamond", "Immortal"];
const RARITIES = ["Common", "Rare", "Epic", "Legendary"];

function BrowsePage() {
  const search = Route.useSearch();
  const { currency } = useStore();

  const [games, setGames] = useState<string[]>(search.game ? [search.game] : []);
  const [categories, setCategories] = useState<string[]>(search.category ? [search.category] : []);
  const [maxPrice, setMaxPrice] = useState(400);
  const [minRating, setMinRating] = useState(0);
  const [delivery, setDelivery] = useState<string[]>([]);
  const [region, setRegion] = useState("Any");
  const [platform, setPlatform] = useState("Any");
  const [server, setServer] = useState("Any");
  const [rank, setRank] = useState("Any");
  const [rarity, setRarity] = useState<string[]>([]);
  const [instantOnly, setInstantOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("relevance");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = (search.q ?? "").toLowerCase().trim();

  const results = useMemo(() => {
    let out = LISTINGS.filter((l) => {
      if (q) {
        const gameName = GAMES.find((g) => g.slug === l.game)?.name.toLowerCase() ?? "";
        const hay = `${l.title} ${gameName} ${l.category} ${l.rarity} ${l.rank}`.toLowerCase();
        if (!q.split(/\s+/).some((token) => hay.includes(token))) return false;
      }
      if (games.length && !games.includes(l.game)) return false;
      if (categories.length && !categories.includes(l.category)) return false;
      if (l.price > maxPrice) return false;
      if (l.seller.rating < minRating) return false;
      if (delivery.length && !delivery.includes(l.delivery)) return false;
      if (region !== "Any" && l.region !== region) return false;
      if (platform !== "Any" && l.platform !== platform) return false;
      if (server !== "Any" && l.server !== server) return false;
      if (rank !== "Any" && l.rank !== rank) return false;
      if (rarity.length && !rarity.includes(l.rarity)) return false;
      if (instantOnly && l.delivery !== "Instant") return false;
      if (verifiedOnly && !l.seller.verified) return false;
      return true;
    });
    out = [...out].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.seller.rating - a.seller.rating;
      if (sort === "sold") return b.sold - a.sold;
      return b.sold * b.seller.rating - a.sold * a.seller.rating;
    });
    return out;
  }, [q, games, categories, maxPrice, minRating, delivery, region, platform, server, rank, rarity, instantOnly, verifiedOnly, sort]);

  const activeCount =
    games.length +
    categories.length +
    delivery.length +
    rarity.length +
    (maxPrice < 400 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    [region, platform, server, rank].filter((v) => v !== "Any").length +
    (instantOnly ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  const reset = () => {
    setGames([]);
    setCategories([]);
    setMaxPrice(400);
    setMinRating(0);
    setDelivery([]);
    setRegion("Any");
    setPlatform("Any");
    setServer("Any");
    setRank("Any");
    setRarity([]);
    setInstantOnly(false);
    setVerifiedOnly(false);
  };

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const filters = (
    <div className="grid gap-5">
      <FilterGroup title="Game">
        <div className="grid max-h-56 gap-1 overflow-y-auto pr-1">
          {GAMES.map((g) => (
            <CheckRow
              key={g.slug}
              label={g.name}
              hint={g.listings.toLocaleString()}
              checked={games.includes(g.slug)}
              onChange={() => toggle(games, setGames, g.slug)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Category">
        <div className="grid gap-1">
          {CATEGORIES.map((c) => (
            <CheckRow
              key={c.slug}
              label={c.name}
              checked={categories.includes(c.slug)}
              onChange={() => toggle(categories, setCategories, c.slug)}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Max price">
        <input
          type="range"
          min={5}
          max={400}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="w-full accent-[oklch(0.606_0.219_292.7)]"
        />
        <p className="text-xs text-muted-foreground">
          Up to <span className="font-semibold text-foreground">{formatPrice(maxPrice, currency)}</span>
        </p>
      </FilterGroup>

      <FilterGroup title="Seller rating">
        <div className="flex flex-wrap gap-1.5">
          {[0, 4, 4.5, 4.8].map((r) => (
            <Chip key={r} active={minRating === r} onClick={() => setMinRating(r)}>
              {r === 0 ? "Any" : (
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3 w-3 fill-warning text-warning" /> {r}+
                </span>
              )}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Delivery time">
        <div className="flex flex-wrap gap-1.5">
          {DELIVERY_OPTIONS.map((d) => (
            <Chip key={d} active={delivery.includes(d)} onClick={() => toggle(delivery, setDelivery, d)}>
              {d}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Region">
        <Select value={region} onChange={setRegion} options={["Any", ...REGIONS]} label="Region" />
      </FilterGroup>
      <FilterGroup title="Platform">
        <Select value={platform} onChange={setPlatform} options={["Any", ...PLATFORMS]} label="Platform" />
      </FilterGroup>
      <FilterGroup title="Server">
        <Select value={server} onChange={setServer} options={["Any", ...SERVERS]} label="Server" />
      </FilterGroup>
      <FilterGroup title="Level / Rank">
        <Select value={rank} onChange={setRank} options={["Any", ...RANKS]} label="Rank" />
      </FilterGroup>

      <FilterGroup title="Rarity">
        <div className="flex flex-wrap gap-1.5">
          {RARITIES.map((r) => (
            <Chip key={r} active={rarity.includes(r)} onClick={() => toggle(rarity, setRarity, r)}>
              {r}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Trust">
        <ToggleRow
          label="Instant delivery only"
          icon={<Zap className="h-4 w-4 text-cyan" />}
          checked={instantOnly}
          onChange={() => setInstantOnly((v) => !v)}
        />
        <ToggleRow
          label="Verified sellers only"
          icon={<ShieldCheck className="h-4 w-4 text-primary-glow" />}
          checked={verifiedOnly}
          onChange={() => setVerifiedOnly((v) => !v)}
        />
      </FilterGroup>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">
            {search.view === "games" ? "All games" : q ? `Results for “${search.q}”` : "Browse the marketplace"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{results.length.toLocaleString()}</span> listings ·{" "}
            {activeCount} filters active
          </p>
        </div>
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-glass bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-elevated lg:hidden"
        >
          <Filter className="h-4 w-4" /> Filters{activeCount ? ` (${activeCount})` : ""}
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className={cn("lg:block", filtersOpen ? "block" : "hidden")}>
          <div className="rounded-2xl border border-glass bg-card p-4 lg:sticky lg:top-24">
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
              <h2 className="flex min-w-0 items-center gap-2 font-display text-sm font-semibold">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-primary-glow" /> Refine
              </h2>
              <button
                onClick={reset}
                className="shrink-0 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
              >
                Reset
              </button>
            </div>
            {filters}
          </div>
        </aside>

        <section>
          <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-glass bg-card px-3 py-2.5">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              {[...games, ...categories].length === 0 && !instantOnly && !verifiedOnly ? (
                <span className="truncate text-xs text-muted-foreground">Showing everything · adjust filters to narrow down</span>
              ) : (
                <>
                  {games.map((g) => (
                    <ActiveTag key={g} label={GAMES.find((x) => x.slug === g)?.name ?? g} onRemove={() => toggle(games, setGames, g)} />
                  ))}
                  {categories.map((c) => (
                    <ActiveTag key={c} label={CATEGORIES.find((x) => x.slug === c)?.name ?? c} onRemove={() => toggle(categories, setCategories, c)} />
                  ))}
                  {instantOnly && <ActiveTag label="Instant" onRemove={() => setInstantOnly(false)} />}
                  {verifiedOnly && <ActiveTag label="Verified" onRemove={() => setVerifiedOnly(false)} />}
                </>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="relative">
                <select
                  aria-label="Sort results"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as (typeof SORTS)[number]["id"])}
                  className="appearance-none rounded-lg border border-glass bg-elevated py-1.5 pl-3 pr-8 text-xs font-medium text-foreground outline-none focus:border-primary/60"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
              <div className="flex overflow-hidden rounded-lg border border-glass">
                <ViewButton active={view === "grid"} onClick={() => setView("grid")} label="Grid view">
                  <LayoutGrid className="h-4 w-4" />
                </ViewButton>
                <ViewButton active={view === "list"} onClick={() => setView("list")} label="List view">
                  <List className="h-4 w-4" />
                </ViewButton>
              </div>
            </div>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
              <h3 className="font-display text-lg font-semibold">No listings match those filters</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Try widening your price range or clearing a couple of filters — there are {LISTINGS.length.toLocaleString()} live
                listings waiting.
              </p>
              <button
                onClick={reset}
                className="mt-5 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={cn(view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-3")}>
              {results.slice(0, 36).map((l) => (
                <ProductCard key={l.id} listing={l} view={view} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-t border-border/50 pt-4 first:border-0 first:pt-0">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function CheckRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-elevated">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-3.5 w-3.5 shrink-0 accent-[oklch(0.606_0.219_292.7)]" />
      <span className="truncate text-foreground">{label}</span>
      {hint && <span className="shrink-0 text-[0.68rem] text-muted-foreground">{hint}</span>}
    </label>
  );
}

function ToggleRow({
  label,
  icon,
  checked,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-elevated"
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate text-left text-foreground">{label}</span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-elevated ring-1 ring-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-foreground transition-transform",
            checked ? "translate-x-4.5" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary/20 text-foreground"
          : "border-border bg-elevated text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-glass bg-elevated py-2 pl-3 pr-8 text-sm text-foreground outline-none focus:border-primary/60"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function ActiveTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-xs font-medium text-foreground">
      {label}
      <button type="button" onClick={onRemove} aria-label={`Remove ${label} filter`} className="text-muted-foreground hover:text-foreground">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function ViewButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn("grid h-8 w-8 place-items-center transition-colors", active ? "bg-primary text-primary-foreground" : "bg-elevated text-muted-foreground hover:text-foreground")}
    >
      {children}
    </button>
  );
}
