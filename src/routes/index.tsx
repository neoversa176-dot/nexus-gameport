import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
  Wallet,
} from "lucide-react";
import heroBg from "@/assets/hero-abstract.jpg";
import { SearchBox } from "@/components/search-box";
import { GameArt } from "@/components/brand";
import { CategoryIcon } from "@/components/category-icon";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, GAMES, LISTINGS } from "@/lib/marketplace-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GameVault — Everything You Need to Level Up" },
      {
        name: "description",
        content:
          "GameVault is the escrow-protected marketplace for game accounts, currency, items, boosting, top-ups and gift cards across 400+ titles.",
      },
      { property: "og:title", content: "GameVault — Everything You Need to Level Up" },
      {
        property: "og:description",
        content: "Buy and sell accounts, currency, items and boosts with escrow protection and instant delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => railRef.current?.scrollBy({ left: dir * 480, behavior: "smooth" });
  const featured = [...LISTINGS].sort((a, b) => b.sold - a.sold).slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1088}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--background)_55%,transparent),var(--background))]" />
        <div className="relative mx-auto max-w-[1400px] px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-glass bg-card/70 px-3.5 py-1.5 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-cyan" />
            2.4M trades settled in escrow
          </span>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
            Everything You Need to <span className="gradient-text">Level Up</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            The player-run marketplace for accounts, currency, items, boosting and top-ups across 400+ titles. Every
            order is held in escrow until you confirm delivery — no handshakes with strangers, no vanished payments.
          </p>

          <div className="mt-8 max-w-3xl">
            <SearchBox size="lg" placeholder="Try “Valorant account”, “OSRS gold”, “CS2 knife”…" />
          </div>

          <dl className="mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: Users, label: "Active sellers", value: "38,400" },
              { icon: Timer, label: "Median delivery", value: "4 min" },
              { icon: ShieldCheck, label: "Escrow coverage", value: "100%" },
              { icon: Wallet, label: "Paid out weekly", value: "$6.2M" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-glass bg-card/70 p-4 backdrop-blur">
                <s.icon className="h-4 w-4 text-primary-glow" />
                <dd className="mt-2 font-display text-xl font-bold">{s.value}</dd>
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Popular games</h2>
            <p className="mt-1 text-sm text-muted-foreground">Live listing counts, updated every few minutes.</p>
          </div>
          <div className="hidden shrink-0 gap-2 sm:flex">
            <RailButton label="Scroll left" onClick={() => scrollBy(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </RailButton>
            <RailButton label="Scroll right" onClick={() => scrollBy(1)}>
              <ChevronRight className="h-4 w-4" />
            </RailButton>
          </div>
        </div>

        <div ref={railRef} className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
          {GAMES.map((g) => (
            <Link
              key={g.slug}
              to="/browse"
              search={{ game: g.slug }}
              className="group w-40 shrink-0 snap-start overflow-hidden rounded-2xl border border-glass bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)] sm:w-48"
            >
              <GameArt game={g} className="aspect-square w-full" />
              <div className="p-3">
                <p className="truncate font-display text-sm font-semibold">{g.name}</p>
                <p className="text-xs text-muted-foreground">{g.listings.toLocaleString()} listings</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Shop by marketplace</h2>
        <p className="mt-1 text-sm text-muted-foreground">Six ways to trade — each one escrow-protected end to end.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/browse"
              search={{ category: c.slug }}
              className="group relative overflow-hidden rounded-3xl border border-glass bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[image:var(--gradient-primary)] opacity-15 blur-2xl transition-opacity group-hover:opacity-30" />
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl border border-glass bg-elevated text-primary-glow">
                <CategoryIcon icon={c.icon} className="h-6 w-6" />
              </span>
              <h3 className="relative mt-4 font-display text-lg font-bold">{c.name}</h3>
              <p className="relative text-xs font-medium uppercase tracking-wider text-cyan">{c.tagline}</p>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
              <span className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                {c.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-14 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Trending listings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Most-bought offers from top-rated sellers this week.</p>
          </div>
          <Link
            to="/browse"
            search={{}}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-glass bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-elevated"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {featured.map((l) => (
            <ProductCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-glass bg-[radial-gradient(120%_140%_at_10%_0%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_60%)] p-8 sm:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-bold sm:text-4xl">Sell what you've already earned</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                List in under two minutes, keep 92% of every sale, and get paid out weekly. Seller levels unlock lower
                fees, priority placement and faster escrow releases.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/sell"
                  className="rounded-xl bg-[image:var(--gradient-primary)] px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
                >
                  Start selling
                </Link>
                <Link
                  to="/how-it-works"
                  className="rounded-xl border border-glass bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-elevated"
                >
                  How escrow works
                </Link>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { t: "92% payout", d: "Flat, transparent fee — no listing charges." },
                { t: "Weekly payouts", d: "Bank, card or crypto rails, your pick." },
                { t: "Fraud shield", d: "Chargeback cover on verified deliveries." },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-glass bg-card p-4">
                  <p className="font-display text-sm font-bold">{b.t}</p>
                  <p className="text-xs text-muted-foreground">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function RailButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-xl border border-glass bg-card text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
    >
      {children}
    </button>
  );
}
