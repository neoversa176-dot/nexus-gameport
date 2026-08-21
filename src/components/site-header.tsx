import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingCart,
  Wallet,
  X,
} from "lucide-react";
import { Wordmark, SellerAvatar } from "./brand";
import { SearchBox } from "./search-box";
import { formatPrice, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { label: "Browse", to: "/browse" as const, search: {} },
  { label: "Games", to: "/browse" as const, search: { view: "games" as const } },
  { label: "Sell", to: "/sell" as const, search: {} },
  { label: "How It Works", to: "/how-it-works" as const, search: {} },
  { label: "Support", to: "/support" as const, search: {} },
];

const LANGUAGES = ["EN", "DE", "ES", "PT"];
const CURRENCIES = ["USD", "EUR", "GBP", "BRL"];

export function SiteHeader() {
  const store = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-glass bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="shrink-0" aria-label="GameVault home">
          <Wordmark />
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              search={item.search}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden min-w-0 flex-1 justify-end xl:flex xl:max-w-md">
          <SearchBox />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 xl:ml-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden items-center gap-1 rounded-lg px-2.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground md:flex">
              <Globe className="h-4 w-4" />
              {store.language} / {store.currency}
              <ChevronDown className="h-3.5 w-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              {LANGUAGES.map((l) => (
                <DropdownMenuItem key={l} onSelect={() => store.setLanguage(l)}>
                  <span className={cn(store.language === l && "font-semibold text-primary-glow")}>{l}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Currency</DropdownMenuLabel>
              {CURRENCIES.map((c) => (
                <DropdownMenuItem key={c} onSelect={() => store.setCurrency(c)}>
                  <span className={cn(store.currency === c && "font-semibold text-primary-glow")}>{c}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {store.signedIn ? (
            <>
              <IconButton label="Notifications" badge={store.notifications}>
                <Bell className="h-4.5 w-4.5" />
              </IconButton>
              <IconButton label="Messages" badge={store.messages}>
                <MessageSquare className="h-4.5 w-4.5" />
              </IconButton>
              <IconButton label="Cart" badge={store.cartCount || undefined}>
                <ShoppingCart className="h-4.5 w-4.5" />
              </IconButton>
              <span className="hidden items-center gap-1.5 rounded-lg border border-glass bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground sm:flex">
                <Wallet className="h-4 w-4 text-cyan" />
                {formatPrice(store.wallet, store.currency)}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="ml-1 flex items-center gap-1 rounded-full ring-offset-background transition-opacity hover:opacity-85"
                  aria-label="Account menu"
                >
                  <SellerAvatar name="Vex" className="h-9 w-9 ring-2 ring-primary/40" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold">Vex_Harlow</p>
                    <p className="text-xs font-normal text-muted-foreground">Buyer · Level 3</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Package className="mr-2 h-4 w-4" /> My orders
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Wallet className="mr-2 h-4 w-4" /> Wallet · {formatPrice(store.wallet, store.currency)}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={store.signOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={store.signIn}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
              >
                Sign in
              </button>
              <button
                onClick={store.signIn}
                className="rounded-lg bg-[image:var(--gradient-primary)] px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Create account
              </button>
            </div>
          )}

          <button
            className="ml-1 grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="border-t border-glass px-4 py-2.5 xl:hidden">
        <SearchBox />
      </div>

      {mobileOpen && (
        <nav className="border-t border-glass bg-surface px-4 py-3 lg:hidden" aria-label="Mobile">
          <div className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                search={item.search}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function IconButton({
  label,
  badge,
  children,
}: {
  label: string;
  badge?: number | undefined;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={badge ? `${label} (${badge})` : label}
      className="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-elevated hover:text-foreground"
    >
      {children}
      {badge ? (
        <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
