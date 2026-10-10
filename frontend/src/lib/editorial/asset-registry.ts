import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import type { EditorialMedia, EditorialMediaInput } from '@/types/editorial-media';
import type { EditorialMediaSlot } from '@/config/editorial-media';

/** Clave del manifiesto: el slot, o `slot:instancia` (el comodín `.*` se sustituye por la instancia). */
function assetKey(slot: EditorialMediaSlot, instance?: string): string {
  if (!instance) return slot;
  return `${slot.endsWith('.*') ? slot.slice(0, -2) : slot}:${instance}`;
}

/**
 * Un `src` explícito de la vista manda; si no, el slot (o su instancia) toma la imagen
 * publicada en `EDITORIAL_ASSETS`. Sin ninguna de las dos, pinta el fallback de su contrato.
 */
export function resolveEditorialMedia(
  slot: EditorialMediaSlot,
  media?: EditorialMediaInput,
): EditorialMedia {
  const definition = EDITORIAL_MEDIA_REGISTRY[slot];
  const src = media?.src ?? EDITORIAL_ASSETS[assetKey(slot, media?.instance)];
  const hasSource = typeof src === 'string' && src.length > 0;
  const resolved: EditorialMedia = {
    alt: media?.alt ?? definition.alt ?? '',
    aspect: media?.aspect ?? definition.aspect,
    slot,
    kind: hasSource ? (media?.kind === 'art-direction' ? 'art-direction' : 'photo') : 'fallback',
    fallback: definition.fallback,
    position: media?.position ?? definition.position,
    priority: media?.priority ?? definition.priority,
    sizes: media?.sizes ?? definition.sizes,
  };

  if (hasSource) {
    resolved.src = src;
  }

  if (media?.band) {
    resolved.band = media.band;
  }

  return resolved;
}
