import { describe, expect, it, vi } from 'vitest';

import {
  EDITORIAL_MEDIA_REGISTRY,
  EDITORIAL_MEDIA_SLOTS,
  type EditorialMediaSlot,
} from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { editorialVisual, hasEditorialVisual } from '@/lib/editorial/visual';

import { readSource, SRC, sourceFiles } from '../helpers/source-files';

// La política de fallback es la de un slot sin foto: no puede depender de las imágenes publicadas.
vi.mock('@/config/editorial-assets.generated', () => ({ EDITORIAL_ASSETS: {} }));

/** Materia estructural con texto encima: lo único que conserva la zebra. */
const ZEBRA: readonly EditorialMediaSlot[] = [
  'portal.hero',
  'home.hero',
  'home-marisol-portrait',
  'home-membership',
  'about.hero',
  'about.angels',
  'auth.hero',
  'discover.hero',
  'resonario.hero',
  'academy.hero',
  'experiences.hero',
  'store.hero',
  'sanctuary.hero',
];

/** Contenido de un ítem del catálogo: su banda de color, no una textura común. */
const BAND: readonly EditorialMediaSlot[] = [
  'resonario.audio-cover.*',
  'resonario.featured',
  'academy.featured-course',
  'academy-course-cover',
  'academy-lesson-visual',
  'experiences.featured',
  'experiences-visual',
  'booking.hero',
  'store-product-visual',
  'product.detail',
  'product.related',
  'sanctuary.continue',
];

const BAND_GRADIENT = 'linear-gradient(150deg, #3a5a6e, #1a2c44)';

describe('editorial fallback policy', () => {
  it('assigns every slot the fallback that matches its job in the view', () => {
    for (const slot of EDITORIAL_MEDIA_SLOTS) {
      const expected = ZEBRA.includes(slot) ? 'zebra' : BAND.includes(slot) ? 'band' : 'none';
      expect({ slot, fallback: EDITORIAL_MEDIA_REGISTRY[slot].fallback }).toEqual({
        slot,
        fallback: expected,
      });
    }
  });

  it('paints the photo whenever a slot has a source, whatever its fallback', () => {
    for (const slot of ['home.hero', 'store-product-visual', 'cart.empty'] as const) {
      expect(editorialVisual(resolveEditorialMedia(slot, { src: '/editorial/x.avif' }))).toBe(
        'photo',
      );
    }
  });

  it('uses the item band for content slots and falls back to zebra without one', () => {
    expect(
      editorialVisual(resolveEditorialMedia('store-product-visual', { band: BAND_GRADIENT })),
    ).toBe('band');
    expect(editorialVisual(resolveEditorialMedia('store-product-visual'))).toBe('zebra');
  });

  it('paints nothing for atmosphere-only slots until their photo arrives', () => {
    const media = resolveEditorialMedia('cart.empty');

    expect(editorialVisual(media)).toBe('none');
    expect(hasEditorialVisual(media)).toBe(false);
  });

  it('keeps the contract fallback even if a view tries to override it', () => {
    const media = resolveEditorialMedia('cart.empty', {
      ...({ fallback: 'zebra' } as object),
    });

    expect(media.fallback).toBe('none');
  });
});

describe('zebra motion', () => {
  it('keeps the zebra still by default: a looping sweep reads as loading', () => {
    expect(readSource(`${SRC}/components/ui/media-skeleton.tsx`)).toContain('animated = false');
  });

  it('animates only the loading silhouettes, where the sweep does mean waiting', () => {
    const loadingFiles = sourceFiles(`${SRC}/app`, /loading\.tsx$/).filter((path) =>
      readSource(path).includes('<MediaSkeleton'),
    );

    expect(loadingFiles.length).toBeGreaterThan(0);
    for (const path of loadingFiles) {
      const skeletons = readSource(path).match(/<MediaSkeleton[^>]*>/g) ?? [];
      for (const skeleton of skeletons) expect(skeleton).toMatch(/\banimated\b/);
    }
  });
});
