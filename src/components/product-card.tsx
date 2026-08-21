import { Link } from "@tanstack/react-router";
import { Heart, ShieldCheck, Star, Zap, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ListingArt, SellerAvatar } from "./brand";
import { categoryBySlug, gameBySlug, type Listing } from "@/lib/marketplace-data";
import { formatPrice, useStore } from "@/lib/store";

export function ProductCard({ listing, view = "grid" }: { listing: Listing; view?: "grid" | "list" }) {
  const { isFavorite, toggleFavorite, currency } = useStore();
  const game = gameBySlug(listing.game);
  const category = categoryBySlug(listing.category);
  const fav = isFavorite(listing.id);
  const discount = listing.oldPrice ? Math.round((1 - listing.price / listing.oldPrice) * 100) : 0;

  const art = (
    <div className={cn("relative overflow-hidden bg-surface", view === "grid" ? "aspect-[16/9]" : "h-full min-h-32")}>
      <ListingArt seed={listing.id} hue={game?.hue ?? 280} className="h-full w-full object-cover" />
      <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
        {listing.delivery === "Instant" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan/15 px-2 py-0.5 text-[0.65rem] font-semibold text-cyan ring-1 ring-cyan/30">
            <Zap className="h-3 w-3" /> Instant
          </span>
        )}
        {discount > 0 && (
          <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-[0.65rem] font-semibold text-destructive ring-1 ring-destructive/40">
            -{discount}%
          </span>
        )}
      </div>
      <button
        type="button"
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={fav}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(listing.id);
        }}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-glass bg-background/70 backdrop-blur transition-colors hover:bg-elevated"
      >
        <Heart className={cn("h-4 w-4 transition-colors", fav ? "fill-destructive text-destructive" : "text-muted-foreground")} />
      </button>
    </div>
  );

  const body = (
    <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground">
          <span className="truncate">{game?.name}</span>
          <span className="h-1 w-1 shrink-0 rounded-full bg-border" />
          <span className="shrink-0 text-primary-glow">{category?.name}</span>
        </p>
        <h3 className="mt-1 line-clamp-2 font-display text-sm font-semibold leading-snug text-foreground">
          {listing.title}
        </h3>
      </div>

      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2">
        <SellerAvatar name={listing.seller.name} className="h-7 w-7" />
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-xs font-medium text-foreground">
            <span className="truncate">{listing.seller.name}</span>
            {listing.seller.verified && <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-cyan" />}
          </p>
          <p className="flex items-center gap-1 text-[0.7rem] text-muted-foreground">
            <Star className="h-3 w-3 fill-warning text-warning" />
            {listing.seller.rating.toFixed(1)}
            <span>({listing.seller.reviews.toLocaleString()})</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 border-t border-border/60 pt-3">
        <p className="flex min-w-0 items-center gap-1.5 truncate text-[0.72rem] text-muted-foreground">
          <Truck className="h-3.5 w-3.5 shrink-0" /> {listing.delivery} delivery
        </p>
        <div className="shrink-0 text-right">
          {listing.oldPrice && (
            <span className="mr-1.5 text-xs text-muted-foreground line-through">
              {formatPrice(listing.oldPrice, currency)}
            </span>
          )}
          <span className="font-display text-base font-bold text-foreground">{formatPrice(listing.price, currency)}</span>
          {listing.unit && <span className="ml-1 text-[0.7rem] text-muted-foreground">{listing.unit}</span>}
        </div>
      </div>
    </div>
  );

  return (
    <Link
      to="/product/$productId"
      params={{ productId: listing.id }}
      className={cn(
        "group flex overflow-hidden rounded-2xl border border-glass bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]",
        view === "grid" ? "flex-col" : "flex-col sm:flex-row",
      )}
    >
      <div className={cn(view === "list" && "sm:w-56 sm:shrink-0")}>{art}</div>
      {body}
    </Link>
  );
}
