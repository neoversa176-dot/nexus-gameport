import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { LISTINGS, type Listing } from "./marketplace-data";

type CartItem = { id: string; qty: number };

type StoreValue = {
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  wallet: number;
  currency: string;
  setCurrency: (c: string) => void;
  language: string;
  setLanguage: (l: string) => void;
  recentSearches: string[];
  pushSearch: (q: string) => void;
  notifications: number;
  messages: number;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState("USD");
  const [language, setLanguage] = useState("EN");
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Minecraft account",
    "Rocket League credits",
    "Pokémon shiny trade",
  ]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [id, ...f]));
  }, []);

  const addToCart = useCallback((id: string, qty = 1) => {
    setCart((c) => {
      const found = c.find((i) => i.id === id);
      if (found) return c.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      return [...c, { id, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => setCart((c) => c.filter((i) => i.id !== id)), []);

  const pushSearch = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecentSearches((r) => [trimmed, ...r.filter((x) => x !== trimmed)].slice(0, 5));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const byId = new Map<string, Listing>(LISTINGS.map((l) => [l.id, l]));
    const cartTotal = cart.reduce((sum, i) => sum + (byId.get(i.id)?.price ?? 0) * i.qty, 0);
    return {
      signedIn,
      signIn: () => setSignedIn(true),
      signOut: () => setSignedIn(false),
      favorites,
      toggleFavorite,
      isFavorite: (id: string) => favorites.includes(id),
      cart,
      cartCount: cart.reduce((s, i) => s + i.qty, 0),
      cartTotal,
      addToCart,
      removeFromCart,
      clearCart: () => setCart([]),
      wallet: 248.5,
      currency,
      setCurrency,
      language,
      setLanguage,
      recentSearches,
      pushSearch,
      notifications: 3,
      messages: 2,
    };
  }, [signedIn, favorites, cart, currency, language, recentSearches, toggleFavorite, addToCart, removeFromCart, pushSearch]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function formatPrice(value: number, currency = "USD") {
  const symbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", BRL: "R$" };
  const rates: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79, BRL: 5.4 };
  const symbol = symbols[currency] ?? "$";
  const rate = rates[currency] ?? 1;
  return `${symbol}${(value * rate).toFixed(2)}`;
}
