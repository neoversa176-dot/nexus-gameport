import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Lock, MessagesSquare, PackageCheck, Scale } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How GameVault escrow works" },
      {
        name: "description",
        content: "Every GameVault order is held in escrow: pay securely, chat with the seller, confirm delivery, and release funds — or open a dispute.",
      },
      { property: "og:title", content: "How GameVault escrow works" },
      { property: "og:description", content: "Pay, chat, confirm, release. Buyer protection on every trade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorksPage,
});

const STEPS = [
  { icon: Lock, t: "Pay into escrow", d: "Your money sits with GameVault, not the seller. Card, wallet balance or crypto." },
  { icon: MessagesSquare, t: "Coordinate in order chat", d: "Timestamped messages and delivery proof, visible to our resolution team." },
  { icon: PackageCheck, t: "Confirm what you got", d: "Inspect the account, currency or item. Confirm only when it matches the listing." },
  { icon: Scale, t: "Or open a dispute", d: "Median first human response is 11 minutes. Refunds issued when a seller falls short." },
];

const FAQ = [
  { q: "What happens if a seller never delivers?", a: "The escrow hold auto-expires and your payment returns in full — you never chase anyone for a refund." },
  { q: "Are account purchases safe long term?", a: "Verified account listings ship with original email and recovery access, plus a 72-hour replacement window." },
  { q: "How fast are payouts for sellers?", a: "Escrow releases on buyer confirmation, and payouts batch weekly. Elite sellers release within 24 hours." },
  { q: "Does GameVault take a cut from buyers?", a: "No. Buyers pay the listed price. Sellers pay a flat 5–8% fee based on their level." },
];

function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
      <h1 className="max-w-3xl font-display text-3xl font-bold sm:text-5xl">
        Trades that <span className="gradient-text">can't ghost you</span>
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        GameVault sits between buyer and seller on every order. Nobody sends first, nobody gets stranded.
      </p>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.t} className="rounded-3xl border border-glass bg-card p-5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-glass bg-elevated text-cyan">
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary-glow">0{i + 1}</p>
            <h2 className="font-display text-base font-bold">{s.t}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-16 font-display text-2xl font-bold">Common questions</h2>
      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        {FAQ.map((f) => (
          <div key={f.q} className="rounded-2xl border border-glass bg-card p-5">
            <h3 className="font-display text-sm font-semibold">{f.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>

      <Link
        to="/browse"
        search={{}}
        className="mt-10 inline-flex items-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
      >
        Browse protected listings <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
