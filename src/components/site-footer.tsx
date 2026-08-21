import { Link } from "@tanstack/react-router";
import { Wordmark } from "./brand";
import { ShieldCheck, Headphones, Timer } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-glass bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div className="min-w-0">
            <Wordmark />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A player-first marketplace for accounts, currency, items, boosts and top-ups — every trade held in escrow
              until you confirm delivery.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-glass bg-card px-3 py-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan" /> Escrow protected
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-glass bg-card px-3 py-1.5">
                <Headphones className="h-3.5 w-3.5 text-primary-glow" /> 24/7 humans
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-glass bg-card px-3 py-1.5">
                <Timer className="h-3.5 w-3.5 text-warning" /> 4 min median delivery
              </span>
            </div>
          </div>

          <FooterCol
            title="Marketplace"
            links={[
              { label: "Browse all", to: "/browse" },
              { label: "Accounts", to: "/browse" },
              { label: "Currency", to: "/browse" },
              { label: "Boosting", to: "/browse" },
            ]}
          />
          <FooterCol
            title="Sellers"
            links={[
              { label: "Start selling", to: "/sell" },
              { label: "Seller levels", to: "/sell" },
              { label: "Payout schedule", to: "/sell" },
              { label: "Fees", to: "/sell" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "How it works", to: "/how-it-works" },
              { label: "Support center", to: "/support" },
              { label: "Trust & safety", to: "/how-it-works" },
              { label: "Contact", to: "/support" },
            ]}
          />
        </div>

        <div className="mt-10 grid gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:grid-cols-[minmax(0,1fr)_auto]">
          <p>© {new Date().getFullYear()} GameVault. Independent marketplace, not affiliated with any game publisher.</p>
          <p className="sm:text-right">Terms · Privacy · Refunds</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div className="min-w-0">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 grid gap-2">
        {links.map((l, i) => (
          <li key={`${l.label}-${i}`}>
            <Link
              to={l.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
