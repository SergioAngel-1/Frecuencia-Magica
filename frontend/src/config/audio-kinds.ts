import type { AudioKind } from '@/types/content';

export type AudioKindEntry = {
  kind: AudioKind;
  /** Clave del nombre del tipo (`resonario.kinds.<kind>.title`). */
  titleKey: string;
  /** Clave de su explicación: qué es, para qué momento y cómo escucharlo. */
  explanationKey: string;
  /** Slug del banner: `resonario.kind-banner.<slug>`. Es el mismo del tipo. */
  bannerSlug: AudioKind;
};

/**
 * Los cinco tipos de escucha en el orden en que el Resonario los presenta.
 * Cada tipo tiene su banner (slot `resonario.kind-banner.*`) y su explicación.
 */
export const AUDIO_KINDS: readonly AudioKindEntry[] = [
  {
    kind: 'melody',
    titleKey: 'resonario.kinds.melody.title',
    explanationKey: 'resonario.kinds.melody.explanation',
    bannerSlug: 'melody',
  },
  {
    kind: 'nature',
    titleKey: 'resonario.kinds.nature.title',
    explanationKey: 'resonario.kinds.nature.explanation',
    bannerSlug: 'nature',
  },
  {
    kind: 'frequency',
    titleKey: 'resonario.kinds.frequency.title',
    explanationKey: 'resonario.kinds.frequency.explanation',
    bannerSlug: 'frequency',
  },
  {
    kind: 'binaural',
    titleKey: 'resonario.kinds.binaural.title',
    explanationKey: 'resonario.kinds.binaural.explanation',
    bannerSlug: 'binaural',
  },
  {
    kind: 'guided',
    titleKey: 'resonario.kinds.guided.title',
    explanationKey: 'resonario.kinds.guided.explanation',
    bannerSlug: 'guided',
  },
];
