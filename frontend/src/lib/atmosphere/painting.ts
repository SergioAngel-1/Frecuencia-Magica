import { ATMOSPHERES } from '@/config/atmospheres';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import type { AtmosphereId, AtmosphereScheme } from '@/types/atmosphere';
import type { EditorialMedia, EditorialScrimTone } from '@/types/editorial-media';

/**
 * Paisaje de una atmósfera (su slot `backdropSlot`), con el alt ya traducido.
 * `null` si la atmósfera no tiene paisaje de fondo: la noche, que pinta su
 * propio héroe.
 */
export function atmospherePainting(id: AtmosphereId, alt: string): EditorialMedia | null {
  const slot = ATMOSPHERES[id].backdropSlot;

  if (!slot) return null;

  return resolveEditorialMedia(slot, { alt, sizes: '100vw' });
}

/**
 * Esquema del velo para una atmósfera: `light` sólo en las claras. Las cálidas
 * (encuentro) se leen con el velo oscuro, como la noche, porque su texto es marfil.
 */
export function scrimToneFor(scheme: AtmosphereScheme): EditorialScrimTone {
  return scheme === 'light' ? 'light' : 'dark';
}
