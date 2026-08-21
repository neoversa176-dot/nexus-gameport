import type { Category } from "@/lib/marketplace-data";

export function CategoryIcon({ icon, className }: { icon: Category["icon"]; className?: string }) {
  const stroke = "currentColor";
  const shapes: Record<Category["icon"], React.ReactNode> = {
    accounts: (
      <>
        <circle cx="24" cy="18" r="7" fill="none" stroke={stroke} strokeWidth="2.5" />
        <path d="M11 38c2.5-7 7.5-10 13-10s10.5 3 13 10" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M33 9l3 3 6-6" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    currency: (
      <>
        <ellipse cx="24" cy="14" rx="14" ry="6" fill="none" stroke={stroke} strokeWidth="2.5" />
        <path d="M10 14v10c0 3.3 6.3 6 14 6s14-2.7 14-6V14" fill="none" stroke={stroke} strokeWidth="2.5" />
        <path d="M10 24v10c0 3.3 6.3 6 14 6s14-2.7 14-6V24" fill="none" stroke={stroke} strokeWidth="2.5" />
      </>
    ),
    items: (
      <>
        <path d="M24 6 40 15v18L24 42 8 33V15z" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M8 15l16 9 16-9M24 24v18" fill="none" stroke={stroke} strokeWidth="2" opacity="0.7" />
      </>
    ),
    boosting: (
      <>
        <path d="M24 5c8 6 11 13 11 20 0 6-4 11-11 17-7-6-11-11-11-17 0-7 3-14 11-20z" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="24" cy="21" r="4" fill="none" stroke={stroke} strokeWidth="2.5" />
        <path d="M15 40l-4 4M33 40l4 4" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
    topups: (
      <>
        <rect x="14" y="6" width="20" height="36" rx="5" fill="none" stroke={stroke} strokeWidth="2.5" />
        <path d="M26 15l-6 10h8l-6 10" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    giftcards: (
      <>
        <rect x="6" y="12" width="36" height="26" rx="5" fill="none" stroke={stroke} strokeWidth="2.5" />
        <path d="M6 22h36M24 12v26" stroke={stroke} strokeWidth="2.5" />
        <path d="M24 12c-4-6-11-3-8 2M24 12c4-6 11-3 8 2" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      {shapes[icon]}
    </svg>
  );
}
