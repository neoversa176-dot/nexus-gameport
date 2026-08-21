import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Heart,
  Minus,
  Play,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ListingArt, SellerAvatar } from "@/components/brand";
import { ProductCard } from "@/components/product-card";
import {
  LISTINGS,
  RATING_DISTRIBUTION,
  REVIEWS,
  categoryBySlug,
  gameBySlug,
  listingById,
} from "@/lib/marketplace-data";
import { formatPrice, useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const listing = listingById(params.productId);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => {
    const listing = loaderData?.listing;
    if (!listing) {
      return {
        meta: [
          { title: "Listing unavailable — GameVault" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const description = `${listing.title} from ${listing.seller.name} — ${listing.delivery} delivery, escrow protected on GameVault.`;
    return {
      meta: [
        { title: `${listing.title} — GameVault` },
        { name: "description", content: description },
        { property: "og:title", content: listing.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { listing } = Route.useLoaderData();
  const { currency, addToCart, isFavorite, toggleFavorite } = useStore();
  const [qty, setQty] = useState(1);
  const [frame, setFrame] = useState(0);
  const [tab, setTab] = useState<"description" | "delivery" | "reviews">("description");

  const game = gameBySlug(listing.game);
  const category = categoryBySlug(listing.category);
  const fav = isFavorite(listing.id);
  const frames = [0, 1, 2, 3];
  const totalReviews = RATING_DISTRIBUTION.reduce((s, r) => s + r.count, 0);
  const similar = LISTINGS.filter((l) => l.game === listing.game && l.id !== listing.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/browse" search={{}} className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Marketplace
        </Link>
        <span>/</span>
        <Link to="/browse" search={{ game: listing.game }} className="transition-colors hover:text-foreground">
          {game?.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{category?.name}</span>
      </nav>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-3xl border border-glass bg-card">
            <ListingArt seed={`${listing.id}-${frame}`} hue={((game?.hue ?? 280) + frame * 25) % 360} className="aspect-[16/9] w-full" />
            {frame === 3 && (
              <div className="absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-[2px]">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-[image:var(--gradient-primary)] glow-ring">
                  <Play className="h-6 w-6 fill-primary-foreground text-primary-foreground" />
                </span>
              </div>
            )}
            <span className="absolute left-3 top-3 rounded-full border border-glass bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur">
              {frame === 3 ? "Seller walkthrough clip" : `Preview ${frame + 1} of 3`}
            </span>
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto no-scrollbar">
            {frames.map((f) => (
              <button
                key={f}
                onClick={() => setFrame(f)}
                aria-label={f === 3 ? "Play walkthrough clip" : `View preview ${f + 1}`}
                aria-pressed={frame === f}
                className={cn(
                  "relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border transition-all",
                  frame === f ? "border-primary glow-ring" : "border-glass opacity-70 hover:opacity-100",
                )}
              >
                <ListingArt seed={`${listing.id}-${f}`} hue={((game?.hue ?? 280) + f * 25) % 360} className="h-full w-full" />
                {f === 3 && (
                  <span className="absolute inset-0 grid place-items-center bg-background/50">
                    <Play className="h-4 w-4 fill-foreground text-foreground" />
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 flex gap-2 border-b border-border">
            {(["description", "delivery", "reviews"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "-mb-px border-b-2 px-3 py-2 text-sm font-medium capitalize transition-colors",
                  tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "reviews" ? `Reviews (${totalReviews.toLocaleString()})` : t}
              </button>
            ))}
          </div>

          <div className="pt-5">
            {tab === "description" && (
              <div className="grid gap-5">
                <p className="text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
                <div>
                  <h3 className="font-display text-sm font-semibold">What's included</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {listing.included.map((item) => (
                      <li key={item} className="flex items-start gap-2 rounded-xl border border-glass bg-card p-3 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  <Attr label="Platform" value={listing.platform} />
                  <Attr label="Region" value={listing.region} />
                  <Attr label="Server" value={listing.server} />
                  <Attr label="Level / Rank" value={listing.rank} />
                  <Attr label="Rarity" value={listing.rarity} />
                  <Attr label="Units sold" value={listing.sold.toLocaleString()} />
                </div>
              </div>
            )}

            {tab === "delivery" && (
              <div className="grid gap-3">
                {[
                  { t: "1. Checkout in escrow", d: "Your payment is held by GameVault — the seller never touches it until you confirm." },
                  { t: `2. Seller responds (${listing.delivery})`, d: "You get a private order chat with delivery instructions and timestamps." },
                  { t: "3. Confirm and release", d: "Check the goods, hit confirm, and funds release. Dispute instead and our team steps in." },
                ].map((s) => (
                  <div key={s.t} className="rounded-2xl border border-glass bg-card p-4">
                    <h4 className="font-display text-sm font-semibold">{s.t}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === "reviews" && (
              <div className="grid gap-6 md:grid-cols-[auto_minmax(0,1fr)]">
                <div className="rounded-2xl border border-glass bg-card p-5 text-center md:w-52">
                  <p className="font-display text-4xl font-bold">{listing.seller.rating.toFixed(1)}</p>
                  <div className="mt-1 flex justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={cn("h-4 w-4", i <= Math.round(listing.seller.rating) ? "fill-warning text-warning" : "text-border")} />
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{totalReviews.toLocaleString()} verified orders</p>
                  <div className="mt-4 grid gap-1.5">
                    {RATING_DISTRIBUTION.map((r) => (
                      <div key={r.stars} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 text-[0.7rem] text-muted-foreground">
                        <span>{r.stars}★</span>
                        <span className="h-1.5 overflow-hidden rounded-full bg-elevated">
                          <span
                            className="block h-full rounded-full bg-[image:var(--gradient-neon)]"
                            style={{ width: `${(r.count / totalReviews) * 100}%` }}
                          />
                        </span>
                        <span>{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid min-w-0 gap-3">
                  {REVIEWS.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-glass bg-card p-4">
                      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                        <SellerAvatar name={r.author} className="h-8 w-8" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{r.author}</p>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star key={i} className={cn("h-3 w-3", i <= r.rating ? "fill-warning text-warning" : "text-border")} />
                            ))}
                          </div>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="min-w-0">
          <div className="grid gap-4 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-glass bg-card p-5">
              <p className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span className="text-primary-glow">{game?.name}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{category?.name}</span>
                {listing.delivery === "Instant" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan/15 px-2 py-0.5 text-[0.65rem] text-cyan ring-1 ring-cyan/30">
                    <Zap className="h-3 w-3" /> Instant
                  </span>
                )}
              </p>
              <h1 className="mt-2 font-display text-xl font-bold leading-snug sm:text-2xl">{listing.title}</h1>

              <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl border border-glass bg-elevated p-3">
                <SellerAvatar name={listing.seller.name} className="h-10 w-10" />
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    <span className="truncate">{listing.seller.name}</span>
                    {listing.seller.verified && <ShieldCheck className="h-4 w-4 shrink-0 text-cyan" />}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-warning text-warning" /> {listing.seller.rating.toFixed(1)} ·{" "}
                    {listing.seller.reviews.toLocaleString()} reviews · {listing.seller.level}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-3xl font-bold">{formatPrice(listing.price, currency)}</span>
                {listing.unit && <span className="pb-1 text-sm text-muted-foreground">{listing.unit}</span>}
                {listing.oldPrice && (
                  <span className="pb-1.5 text-sm text-muted-foreground line-through">{formatPrice(listing.oldPrice, currency)}</span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Truck className="h-3.5 w-3.5" /> {listing.delivery} delivery · {listing.stock} in stock
              </p>

              <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <div className="flex items-center rounded-xl border border-glass bg-elevated">
                  <QtyButton label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <Minus className="h-4 w-4" />
                  </QtyButton>
                  <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
                    {qty}
                  </span>
                  <QtyButton label="Increase quantity" onClick={() => setQty((q) => Math.min(listing.stock, q + 1))}>
                    <Plus className="h-4 w-4" />
                  </QtyButton>
                </div>
                <p className="min-w-0 truncate text-right text-sm text-muted-foreground">
                  Total <span className="font-semibold text-foreground">{formatPrice(listing.price * qty, currency)}</span>
                </p>
              </div>

              <div className="mt-4 grid gap-2">
                <button
                  onClick={() => {
                    addToCart(listing.id, qty);
                    toast.success("Order reserved in escrow", { description: `${qty} × ${listing.title}` });
                  }}
                  className="w-full rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  Buy now · {formatPrice(listing.price * qty, currency)}
                </button>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                  <button
                    onClick={() => {
                      addToCart(listing.id, qty);
                      toast("Added to cart", { description: listing.title });
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-glass bg-elevated px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    <ShoppingCart className="h-4 w-4" /> Add to cart
                  </button>
                  <button
                    onClick={() => toggleFavorite(listing.id)}
                    aria-pressed={fav}
                    aria-label={fav ? "Remove from favorites" : "Add to favorites"}
                    className="grid h-full w-11 place-items-center rounded-xl border border-glass bg-elevated transition-colors hover:bg-secondary"
                  >
                    <Heart className={cn("h-4 w-4", fav ? "fill-destructive text-destructive" : "text-muted-foreground")} />
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-cyan/25 bg-[radial-gradient(120%_120%_at_0%_0%,color-mix(in_oklab,var(--cyan)_14%,transparent),transparent_60%)] p-5">
              <h2 className="flex items-center gap-2 font-display text-sm font-bold">
                <ShieldCheck className="h-5 w-5 text-cyan" /> GameVault Buyer Protection
              </h2>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {[
                  "Payment held in escrow until you confirm delivery",
                  "Full refund if the listing doesn't match its description",
                  "72-hour replacement window on accounts and items",
                  "Human dispute resolution, median response 11 minutes",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                    <span className="min-w-0">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-xl font-bold">Similar {game?.name} listings</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {similar.map((l) => (
            <ProductCard key={l.id} listing={l} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Attr({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-glass bg-card px-3 py-2">
      <p className="text-[0.68rem] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="truncate text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function QtyButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-10 w-10 place-items-center text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </button>
  );
}
