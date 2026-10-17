import type { AudioKindEntry } from '@/config/audio-kinds';
import { AUDIO_KINDS } from '@/config/audio-kinds';
import type { Audio } from '@/types/content';

/** Un tipo de escucha del Resonario y sus pistas, en el orden del catálogo. */
export type KindSection = {
  entry: AudioKindEntry;
  tracks: Audio[];
};

/**
 * Filtro por tipo. `null` o `all` son todo; cualquier otra clave filtra por el
 * campo `kind`, nunca por el texto traducido. Una clave desconocida no devuelve nada.
 */
export function filterAudios(audios: readonly Audio[], filterKey: string | null): Audio[] {
  if (!filterKey || filterKey === 'all') return [...audios];

  return audios.filter((audio) => audio.kind === filterKey);
}

/**
 * La frecuencia destacada del archivo: la primera de tono que puede sonar. Es
 * la pieza grande de la vista «Todo»; no se repite en su sección.
 */
export function featuredAudio(audios: readonly Audio[]): Audio | undefined {
  return audios.find((audio) => audio.kind === 'frequency' && audio.availability === 'ready');
}

/**
 * Las secciones por tipo, en el orden de `AUDIO_KINDS`. Con filtro, sólo la de
 * ese tipo; `exclude` quita un audio (la destacada). Sin pistas, no hay sección.
 */
export function kindSections(
  audios: readonly Audio[],
  filterKey: string | null,
  exclude?: string,
): KindSection[] {
  const kinds = AUDIO_KINDS.filter(
    (entry) => !filterKey || filterKey === 'all' || entry.kind === filterKey,
  );

  return kinds
    .map((entry) => ({
      entry,
      tracks: audios.filter((audio) => audio.kind === entry.kind && audio.id !== exclude),
    }))
    .filter((section) => section.tracks.length > 0);
}
