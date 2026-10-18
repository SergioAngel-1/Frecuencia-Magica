import type { Audio } from '@/types/content';
import type { Translator } from '@/lib/home/translator';

export type ResonarioSample = {
  id: string;
  hz: number | null;
  band: string;
  title: string;
  meta: string;
};

/**
 * Las frecuencias que la Home enseña bajo la del día: título y meta (etiqueta
 * y duración) ya traducidos. Recibe las pistas ya elegidas por la página.
 */
export function buildResonarioSamples(
  audios: readonly Pick<Audio, 'id' | 'hz' | 'band' | 'tagId' | 'duration'>[],
  t: Translator,
): ResonarioSample[] {
  return audios.map((a) => ({
    id: a.id,
    hz: a.hz,
    band: a.band,
    title: t(`audios.${a.id}.title`),
    meta: `${t(`tags.${a.tagId}`)} · ${a.duration ?? ''}`,
  }));
}
