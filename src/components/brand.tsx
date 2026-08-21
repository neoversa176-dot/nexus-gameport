import { cn } from "@/lib/utils";
import type { Game } from "@/lib/marketplace-data";

export function VaultMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="gv-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.585 0.204 277.1)" />
          <stop offset="55%" stopColor="oklch(0.606 0.219 292.7)" />
          <stop offset="100%" stopColor="oklch(0.797 0.134 211.5)" />
        </linearGradient>
      </defs>
      <path d="M24 3 43 13.5v21L24 45 5 34.5v-21z" fill="url(#gv-mark)" opacity="0.18" />
      <path
        d="M24 3 43 13.5v21L24 45 5 34.5v-21z"
        fill="none"
        stroke="url(#gv-mark)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path d="M16 18l8 15 8-15" fill="none" stroke="url(#gv-mark)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="13" r="2.6" fill="oklch(0.865 0.115 207.1)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <VaultMark className="h-8 w-8 shrink-0" />
      <span className="font-display text-lg font-bold tracking-tight">
        Game<span className="gradient-text">Vault</span>
      </span>
    </span>
  );
}

const GLYPHS: Record<Game["glyph"], (c: string) => React.ReactNode> = {
  orbit: (c) => (
    <>
      <circle cx="50" cy="50" r="14" fill={c} opacity="0.85" />
      <ellipse cx="50" cy="50" rx="34" ry="14" fill="none" stroke={c} strokeWidth="3" opacity="0.7" />
      <ellipse cx="50" cy="50" rx="14" ry="34" fill="none" stroke={c} strokeWidth="3" opacity="0.4" />
    </>
  ),
  shard: (c) => (
    <>
      <path d="M50 12 76 50 50 88 24 50z" fill={c} opacity="0.75" />
      <path d="M50 12 76 50 50 88 24 50z" fill="none" stroke={c} strokeWidth="3" />
      <path d="M50 12v76M24 50h52" stroke={c} strokeWidth="2" opacity="0.5" />
    </>
  ),
  hex: (c) => (
    <>
      <path d="M50 14 82 32v36L50 86 18 68V32z" fill={c} opacity="0.28" />
      <path d="M50 14 82 32v36L50 86 18 68V32z" fill="none" stroke={c} strokeWidth="3.5" />
      <circle cx="50" cy="50" r="10" fill={c} />
    </>
  ),
  bolt: (c) => (
    <>
      <path d="M56 12 28 56h18l-6 32 30-46H52z" fill={c} opacity="0.85" />
      <path d="M56 12 28 56h18l-6 32 30-46H52z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round" />
    </>
  ),
  cube: (c) => (
    <>
      <path d="M50 14 82 32 50 50 18 32z" fill={c} opacity="0.85" />
      <path d="M18 32v36l32 18V50z" fill={c} opacity="0.45" />
      <path d="M82 32v36L50 86V50z" fill={c} opacity="0.65" />
    </>
  ),
  ring: (c) => (
    <>
      <circle cx="50" cy="50" r="32" fill="none" stroke={c} strokeWidth="6" opacity="0.5" />
      <circle cx="50" cy="50" r="32" fill="none" stroke={c} strokeWidth="6" strokeDasharray="60 140" strokeLinecap="round" />
      <circle cx="50" cy="50" r="12" fill={c} opacity="0.8" />
    </>
  ),
  star: (c) => (
    <>
      <path d="M50 10 61 39l31 2-24 20 8 30-26-17-26 17 8-30-24-20 31-2z" fill={c} opacity="0.75" />
      <path d="M50 10 61 39l31 2-24 20 8 30-26-17-26 17 8-30-24-20 31-2z" fill="none" stroke={c} strokeWidth="2.5" strokeLinejoin="round" />
    </>
  ),
  wave: (c) => (
    <>
      <path d="M12 62c12-30 24 30 38 0s24-30 38 0" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round" />
      <path d="M12 78c12-24 24 24 38 0s24-24 38 0" fill="none" stroke={c} strokeWidth="3" opacity="0.5" strokeLinecap="round" />
      <circle cx="50" cy="28" r="8" fill={c} />
    </>
  ),
};

export function GameArt({ game, className }: { game: Game; className?: string }) {
  const c = `oklch(0.78 0.16 ${game.hue})`;
  const bg = `oklch(0.30 0.09 ${game.hue})`;
  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`${game.name} artwork`}>
      <defs>
        <linearGradient id={`bg-${game.slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor="oklch(0.187 0.015 266.8)" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#bg-${game.slug})`} />
      <path d="M0 78 25 60 48 74 72 52 100 68v32H0z" fill={c} opacity="0.12" />
      <g transform="translate(0,-4)">{GLYPHS[game.glyph](c)}</g>
    </svg>
  );
}

export function ListingArt({ seed, hue, className }: { seed: string; hue: number; className?: string }) {
  const n = Array.from(seed).reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const c1 = `oklch(0.72 0.18 ${hue})`;
  const c2 = `oklch(0.80 0.13 ${(hue + 120) % 360})`;
  const shapes = [
    <circle key="a" cx={30 + (n % 40)} cy={40 + (n % 25)} r={18 + (n % 12)} fill={c1} opacity="0.45" />,
    <rect key="b" x={100 + (n % 60)} y={20 + (n % 40)} width={70} height={70} rx="14" fill={c2} opacity="0.35" transform={`rotate(${n % 40} 135 55)`} />,
    <path key="c" d={`M${20 + (n % 30)} 120 L${90 + (n % 40)} ${60 + (n % 30)} L${170 - (n % 30)} 120 Z`} fill={c1} opacity="0.3" />,
  ];
  return (
    <svg viewBox="0 0 220 130" className={className} role="img" aria-label="Listing artwork">
      <defs>
        <linearGradient id={`li-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.246 0.031 270.6)" />
          <stop offset="100%" stopColor={`oklch(0.26 0.07 ${hue})`} />
        </linearGradient>
      </defs>
      <rect width="220" height="130" fill={`url(#li-${seed})`} />
      {shapes}
      <g stroke={c2} strokeWidth="0.6" opacity="0.35">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1="0" y1={110 - i * 6} x2="220" y2={110 - i * 6} />
        ))}
      </g>
    </svg>
  );
}

export function SellerAvatar({ name, className }: { name: string; className?: string }) {
  const n = Array.from(name).reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const hue = n % 360;
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full text-[0.65rem] font-bold text-foreground",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, oklch(0.45 0.16 ${hue}), oklch(0.62 0.18 ${(hue + 60) % 360}))`,
      }}
      aria-hidden="true"
    >
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}
