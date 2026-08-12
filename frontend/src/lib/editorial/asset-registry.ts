import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import type { EditorialMedia, EditorialMediaInput } from '@/types/editorial-media';
import type { EditorialMediaSlot } from '@/config/editorial-media';

export function resolveEditorialMedia(
  slot: EditorialMediaSlot,
  media?: EditorialMediaInput,
): EditorialMedia {
  const definition = EDITORIAL_MEDIA_REGISTRY[slot];
  const hasSource = typeof media?.src === 'string' && media.src.length > 0;
  const resolved: EditorialMedia = {
    alt: media?.alt ?? definition.alt,
    slot,
    kind: hasSource
      ? media?.kind === 'art-direction'
        ? 'art-direction'
        : 'photo'
      : 'fallback',
    position: media?.position ?? definition.position,
    priority: media?.priority ?? definition.priority,
    sizes: media?.sizes ?? definition.sizes,
  };

  if (hasSource) {
    resolved.src = media.src;
  }

  return resolved;
}
