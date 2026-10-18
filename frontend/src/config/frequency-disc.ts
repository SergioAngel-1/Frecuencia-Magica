import type { Ring } from '@/components/world/orbital-rings';
import type { EqualizerScale } from '@/components/ui/equalizer';

/** Escalas del disco de frecuencia: de la sugerencia mínima al destacado. */
export type DiscSize = 'xs' | 'sm' | 'md' | 'lg';

export type SizeSpec = {
  width: number;
  /** Distancia del borde del disco al borde del contenedor, en px. */
  inset: number;
  hz: string;
  unit: string;
  title: string;
  /** `null`: la escala no tiene sitio para la línea de meta. */
  meta: string | null;
  spin: number;
  play: number | null;
  eq: EqualizerScale | null;
  /** Halo dorado: resplandor amplio y tenue alrededor del disco. */
  halo: { inset: string; blur: number; alpha: number } | null;
  /**
   * Aura: la propia banda del audio, difuminada y respirando detrás de la
   * esfera. Cada frecuencia irradia su color en vez de recortarse contra una
   * sombra oscura. En el destacado se suma al halo dorado: el color cerca,
   * el oro lejos.
   */
  aura: { inset: string; blur: number; rest: number; active: number } | null;
  restGlow: string;
  activeGlow: string;
};

export const SIZES: Record<DiscSize, SizeSpec> = {
  xs: {
    width: 92,
    inset: 6,
    hz: 'text-serif-md',
    unit: 'text-label tracking-label',
    title: 'text-body',
    meta: null,
    spin: 70,
    play: null,
    eq: null,
    halo: null,
    aura: { inset: '-10%', blur: 12, rest: 0.6, active: 0.9 },
    restGlow: '0 0 18px rgb(var(--halo) / 0.14), inset 0 0 14px rgb(var(--scrim) / 0.35)',
    activeGlow: '0 0 30px rgb(var(--halo) / 0.42), inset 0 0 14px rgb(var(--scrim) / 0.35)',
  },
  sm: {
    width: 150,
    inset: 9,
    hz: 'text-serif-xl',
    unit: 'text-label tracking-kicker',
    title: 'text-serif-sm',
    meta: 'text-label',
    spin: 70,
    play: null,
    eq: null,
    halo: null,
    aura: { inset: '-12%', blur: 14, rest: 0.6, active: 0.9 },
    restGlow: '0 0 26px rgb(var(--halo) / 0.16), inset 0 0 20px rgb(var(--scrim) / 0.35)',
    activeGlow: '0 0 44px rgb(var(--halo) / 0.45), inset 0 0 20px rgb(var(--scrim) / 0.35)',
  },
  md: {
    width: 190,
    inset: 12,
    hz: 'text-serif-2xl',
    unit: 'text-label tracking-kicker',
    title: 'text-serif-lg',
    meta: 'text-meta',
    spin: 60,
    play: 46,
    // El ecualizador no cabe entre la cifra y el play a esta escala: el play
    // lo tapaba y sólo asomaba una barra. Sólo el disco `lg` lo lleva.
    eq: null,
    halo: { inset: '-10%', blur: 14, alpha: 0.22 },
    aura: null,
    restGlow: '0 0 22px rgb(var(--scrim) / 0.5)',
    activeGlow: '0 0 44px rgb(var(--halo) / 0.4)',
  },
  lg: {
    width: 380,
    inset: 22,
    hz: 'text-[clamp(44px,9vw,70px)]',
    unit: 'text-meta tracking-eyebrow',
    title: 'text-[clamp(24px,4vw,32px)]',
    meta: 'text-meta',
    spin: 110,
    play: 62,
    eq: 'lg',
    halo: { inset: '-26%', blur: 34, alpha: 0.2 },
    aura: { inset: '-9%', blur: 34, rest: 0.75, active: 1 },
    restGlow: '0 0 46px rgb(var(--halo) / 0.26), inset 0 0 44px rgb(var(--scrim) / 0.42)',
    activeGlow: '0 0 64px rgb(var(--halo) / 0.44), inset 0 0 44px rgb(var(--scrim) / 0.42)',
  },
};

/** Aros exteriores por escala. El destacado lleva dos capas contrarrotadas. */
export function ringsFor(size: DiscSize, active: boolean): readonly Ring[] {
  const dim = active ? 0.6 : 0.22;

  if (size === 'lg') {
    return [
      { r: 98, stroke: `rgb(var(--halo) / ${active ? 0.75 : 0.55})`, width: 0.7 },
      {
        r: 86,
        stroke: 'color-mix(in srgb, var(--color-accent-3) 35%, transparent)',
        width: 0.6,
        dash: '1 7',
      },
    ];
  }

  return [
    {
      r: 97,
      stroke: active
        ? `rgb(var(--halo) / ${dim})`
        : 'color-mix(in srgb, var(--color-fg) 22%, transparent)',
      width: size === 'md' ? 1 : 1.2,
      dash: size === 'md' ? '1 7' : '1 8',
    },
  ];
}
