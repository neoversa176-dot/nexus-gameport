import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, TrendingUp, Flame, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { GAMES, POPULAR_SEARCHES, TRENDING_SEARCHES } from "@/lib/marketplace-data";

type Props = { size?: "sm" | "lg"; className?: string; placeholder?: string };

export function SearchBox({ size = "sm", className, placeholder = "Search games, items, currency, boosts…" }: Props) {
  const navigate = useNavigate();
  const { recentSearches, pushSearch } = useStore();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const matches = query.trim()
    ? GAMES.filter((g) => g.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 5)
    : [];

  const submit = (value: string) => {
    const v = value.trim();
    pushSearch(v);
    setQuery(v);
    setOpen(false);
    navigate({ to: "/browse", search: { q: v || undefined } });
  };

  const big = size === "lg";

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        role="search"
      >
        <div
          className={cn(
            "flex items-center gap-2 rounded-2xl border border-glass bg-card/80 backdrop-blur transition-shadow focus-within:border-primary/60 focus-within:glow-ring",
            big ? "px-4 py-2.5 sm:px-5 sm:py-3.5" : "px-3 py-2",
          )}
        >
          <Search className={cn("shrink-0 text-muted-foreground", big ? "h-5 w-5" : "h-4 w-4")} />
          <input
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            placeholder={placeholder}
            aria-label="Search the marketplace"
            className={cn(
              "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
              big ? "text-base sm:text-lg" : "text-sm",
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className={cn(
              "shrink-0 rounded-xl bg-[image:var(--gradient-primary)] font-semibold text-primary-foreground transition-transform hover:scale-[1.03]",
              big ? "px-5 py-2.5 text-sm" : "px-3 py-1.5 text-xs",
            )}
          >
            Search
          </button>
        </div>
      </form>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-glass bg-popover/95 p-2 text-left shadow-[var(--shadow-card)] backdrop-blur-xl">
          {matches.length > 0 && (
            <Group title="Games" icon={<Search className="h-3.5 w-3.5" />}>
              {matches.map((g) => (
                <Suggestion key={g.slug} label={g.name} hint={`${g.listings.toLocaleString()} listings`} onSelect={() => submit(g.name)} />
              ))}
            </Group>
          )}
          <Group title="Popular searches" icon={<Flame className="h-3.5 w-3.5 text-warning" />}>
            {POPULAR_SEARCHES.map((s) => (
              <Suggestion key={s} label={s} onSelect={() => submit(s)} />
            ))}
          </Group>
          <Group title="Trending now" icon={<TrendingUp className="h-3.5 w-3.5 text-cyan" />}>
            {TRENDING_SEARCHES.map((s) => (
              <Suggestion key={s} label={s} onSelect={() => submit(s)} />
            ))}
          </Group>
          {recentSearches.length > 0 && (
            <Group title="Recent" icon={<Clock className="h-3.5 w-3.5 text-muted-foreground" />}>
              {recentSearches.map((s) => (
                <Suggestion key={s} label={s} onSelect={() => submit(s)} />
              ))}
            </Group>
          )}
        </div>
      )}
    </div>
  );
}

function Group({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <p className="flex items-center gap-1.5 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {title}
      </p>
      <div className="grid">{children}</div>
    </div>
  );
}

function Suggestion({ label, hint, onSelect }: { label: string; hint?: string; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-elevated"
    >
      <span className="truncate">{label}</span>
      {hint && <span className="shrink-0 text-xs text-muted-foreground">{hint}</span>}
    </button>
  );
}
