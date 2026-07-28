import type { Audio, AudioTag } from '@/types/content';

export type DiscSlot = {
  top: string;
  left: string;
  size: string;
  duration: string;
  delay: string;
};

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
