import type { EditorialMedia } from '@/types/editorial-media';

import { resolveEditorialMedia } from './asset-registry';

type AudioCoverInput = {
  /** Texto alternativo ya traducido; vacío cuando la esfera es decorativa. */
  alt: string;
  sizes: string;
};

/**
 * La portada de un audio: una sola por frecuencia, la misma en el resonario,
 * la home, Mi Santuario y el reproductor. Sin foto publicada, el slot cae a
 * la banda del audio, que es lo que la esfera ya pinta por sí misma.
 */
export function resolveAudioCover(
  audio: { id: string; band: string },
  { alt, sizes }: AudioCoverInput,
): EditorialMedia {
  return resolveEditorialMedia('resonario.audio-cover.*', {
    instance: audio.id,
    alt,
    sizes,
    band: audio.band,
  });
}
