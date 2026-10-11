import type { Audio, AudioTag } from '@/types/content';

export type DiscSlot = {
  top: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
};

export type FeaturedAudioSplit = {
  featured: Audio | undefined;
  others: Audio[];
};

/** Separa el primer audio destacado de los discos secundarios. */
export function splitFeaturedAudio(audios: readonly Audio[]): FeaturedAudioSplit {
  return {
    featured: audios[0],
    others: audios.slice(1),
  };
}

export type OrbitalLayout = {
  /** El sol del sistema: el audio activo o, sin él, el destacado del filtro. */
  center: Audio | undefined;
  /** `true` si el centro es el destacado (el primero del filtro). */
  centerIsFeatured: boolean;
  /** Los discos que orbitan, cada uno con su posición estable (`discSlot`). */
  orbit: { audio: Audio; slot: number }[];
};

/**
 * Reparto del sistema orbital alrededor del audio que suena.
 *
 * Sin audio activo (o si el activo no está en el filtro) el centro es el
 * destacado y cada secundario ocupa su posición por orden. Si el activo es un
 * secundario, toma el centro y el destacado ocupa la posición que ha dejado
 * libre: el resto de discos no se mueve.
 */
export function orbitalLayout(audios: readonly Audio[], activeId: string | null): OrbitalLayout {
  const { featured, others } = splitFeaturedAudio(audios);
  const activeIndex = activeId === null ? -1 : others.findIndex((audio) => audio.id === activeId);

  if (!featured || activeIndex === -1) {
    return {
      center: featured,
      centerIsFeatured: featured !== undefined,
      orbit: others.map((audio, slot) => ({ audio, slot })),
    };
  }

  return {
    center: others[activeIndex],
    centerIsFeatured: false,
    orbit: others.map((audio, slot) => ({
      audio: slot === activeIndex ? featured : audio,
      slot,
    })),
  };
}

const SLOTS: readonly DiscSlot[] = [
  { top: '3%', left: '9%', size: '150px', duration: '7s', delay: '0s' },
  { top: '3%', left: '73%', size: '138px', duration: '8.5s', delay: '.6s' },
  { top: '40%', left: '-2%', size: '128px', duration: '6.5s', delay: '1.1s' },
  { top: '40%', left: '83%', size: '150px', duration: '9s', delay: '.3s' },
  { top: '75%', left: '13%', size: '140px', duration: '7.5s', delay: '.9s' },
  { top: '75%', left: '69%', size: '130px', duration: '8s', delay: '1.4s' },
] as const;

export function discSlot(index: number): DiscSlot {
  return SLOTS[index % SLOTS.length]!;
}

const FILTER_MAP: Record<string, AudioTag | undefined> = {
  meditation: 'meditation',
  frequency: 'frequency',
  rest: 'rest',
  ritual: 'ritual',
};

export function filterAudios(audios: readonly Audio[], filterKey: string | null): Audio[] {
  if (!filterKey || filterKey === 'all') return [...audios];

  const tag = FILTER_MAP[filterKey];
  if (!tag) return [];

  return audios.filter((a) => a.tagId === tag);
}
