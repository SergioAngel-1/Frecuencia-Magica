import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';
import { EDITORIAL_MEDIA_REGISTRY, THEME_VARIANT_POSITIONS } from '@/config/editorial-media';
import { ATMOSPHERE_IDS } from '@/config/atmospheres';
import type { EditorialMedia, EditorialMediaInput } from '@/types/editorial-media';
import type { EditorialMediaSlot } from '@/config/editorial-media';

/** Clave del manifiesto: el slot, o `slot:instancia` (el comodín `.*` se sustituye por la instancia). */
function assetKey(slot: EditorialMediaSlot, instance?: string): string {
  if (!instance) return slot;
  return `${slot.endsWith('.*') ? slot.slice(0, -2) : slot}:${instance}`;
}

/** Variantes por tema publicadas para una clave del manifiesto (`<clave>@<tema>`). */
function themeVariants(
  key: string,
): Pick<EditorialMedia, 'variants' | 'variantPositions'> | undefined {
  const variants: NonNullable<EditorialMedia['variants']> = {};
  const positions: NonNullable<EditorialMedia['variantPositions']> = {};

  for (const theme of ATMOSPHERE_IDS) {
    if (theme === 'night') continue;
    const src = EDITORIAL_ASSETS[`${key}@${theme}`];
    if (!src) continue;

    variants[theme] = src;
    const position = THEME_VARIANT_POSITIONS[`${key}@${theme}`];
    if (position) positions[theme] = position;
  }

  if (Object.keys(variants).length === 0) return undefined;

  return {
    variants,
    ...(Object.keys(positions).length > 0 ? { variantPositions: positions } : {}),
  };
}

/**
 * Un `src` explícito de la vista manda; si no, el slot (o su instancia) toma la imagen
 * publicada en `EDITORIAL_ASSETS`. Sin ninguna de las dos, pinta el fallback de su contrato.
 * Si el slot tiene imágenes propias de un tema (`slot@tema`), viajan en `variants`: la base
 * es siempre la de la noche, y un tema sin variante la ve a ella. Un `src` explícito no las usa.
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

    const themed = media?.src ? undefined : themeVariants(assetKey(slot, media?.instance));
    if (themed) Object.assign(resolved, themed);
  }

  const mobilePosition = media?.mobilePosition ?? definition.mobilePosition;
  if (mobilePosition) {
    resolved.mobilePosition = mobilePosition;
  }

  if (media?.band) {
    resolved.band = media.band;
  }

  return resolved;
}
