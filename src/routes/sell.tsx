import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Coins, LineChart, Upload } from "lucide-react";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell on GameVault — keep 92% of every sale" },
      {
        name: "description",
        content: "List accounts, currency, items and boosting services on GameVault. Flat fees, weekly payouts and fraud protection for sellers.",
      },
      { property: "og:title", content: "Sell on GameVault" },
      { property: "og:description", content: "Flat 8% fee, weekly payouts, escrow-backed orders and seller levels that unlock priority placement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SellPage,
});

const STEPS = [
  { icon: Upload, t: "Create your listing", d: "Pick a game and category, add screenshots, set your price and delivery window." },
  { icon: BadgeCheck, t: "Get verified", d: "One-time ID and payout verification unlocks the verified badge buyers filter for." },
  { icon: Coins, t: "Deliver and get paid", d: "Escrow releases when the buyer confirms. Payouts run every Tuesday." },
  { icon: LineChart, t: "Grow your level", d: "Consistent ratings raise your seller level, lowering fees to 5% at Elite." },
];

const TIERS = [
  { name: "Rising", fee: "8%", perks: ["Standard placement", "Weekly payouts", "Basic analytics"] },
  { name: "Trusted", fee: "6.5%", perks: ["Boosted search rank", "48h escrow release", "Bulk listing tools"] },
  { name: "Elite", fee: "5%", perks: ["Homepage rotation", "24h escrow release", "Dedicated account manager"] },
];

function SellPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <h1 className="max-w-3xl font-display text-3xl font-bold sm:text-5xl">
        Turn your grind into <span className="gradient-text">payouts</span>
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        38,400 sellers move accounts, currency, items and services through GameVault every week. Listing is free, fees
        are flat, and escrow protects both sides of the trade.
      </p>
      <Link
        to="/browse"
        search={{}}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
      >
        See what's selling <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.t} className="rounded-3xl border border-glass bg-card p-5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-glass bg-elevated text-primary-glow">
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-cyan">Step {i + 1}</p>
            <h2 className="font-display text-base font-bold">{s.t}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-display text-2xl font-bold">Seller levels</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-3xl border border-glass bg-card p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h3 className="truncate font-display text-lg font-bold">{t.name}</h3>
              <span className="shrink-0 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-foreground ring-1 ring-primary/40">
                {t.fee} fee
              </span>
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {t.perks.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                  <span className="min-w-0">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
