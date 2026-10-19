import { describe, expect, it, vi } from 'vitest';

import { bandForPhotoTreatment, tintForPhotoTreatment } from '@/config/bands';
import { getRealm } from '@/config/realms';
import {
  EDITORIAL_MEDIA_REGISTRY,
  EDITORIAL_MEDIA_SLOTS,
  type EditorialMediaSlot,
} from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { driftPlan } from '@/lib/editorial/drift';
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

/** Paisajes de apoyo sin trabajo narrativo: sin foto pintan el degradado del tema activo. */
const ATMOSPHERE: readonly EditorialMediaSlot[] = ['atmosphere.forest-autumn'];

const BAND_GRADIENT = 'linear-gradient(150deg, #3a5a6e, #1a2c44)';

describe('editorial fallback policy', () => {
  it('assigns every slot the fallback that matches its job in the view', () => {
    for (const slot of EDITORIAL_MEDIA_SLOTS) {
      const expected = ZEBRA.includes(slot)
        ? 'zebra'
        : BAND.includes(slot)
          ? 'band'
          : ATMOSPHERE.includes(slot)
            ? 'atmosphere'
            : 'none';
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

  it('paints the atmosphere backdrop, never a zebra, for an atmosphere slot without photo', () => {
    for (const slot of ATMOSPHERE) {
      expect(editorialVisual(resolveEditorialMedia(slot)), slot).toBe('atmosphere');
      expect(hasEditorialVisual(resolveEditorialMedia(slot)), slot).toBe(true);
    }
  });

  it('keeps the photo over the atmosphere backdrop once the photo is published', () => {
    expect(
      editorialVisual(
        resolveEditorialMedia('atmosphere.forest-autumn', { src: '/editorial/autumn.avif' }),
      ),
    ).toBe('photo');
  });

  it('keeps the contract fallback even if a view tries to override it', () => {
    const media = resolveEditorialMedia('cart.empty', {
      ...({ fallback: 'zebra' } as object),
    });

    expect(media.fallback).toBe('none');
  });
});

describe('natural photo treatment', () => {
  it('applies no accent band: the landscape keeps its own colours', () => {
    expect(bandForPhotoTreatment('natural')).toBeNull();
  });

  it('still tints the accent treatments', () => {
    expect(bandForPhotoTreatment('warm')).toEqual(expect.stringContaining('--halo'));
  });

  it('drops the accent veil of the store hero, and only of natural realms', () => {
    expect(tintForPhotoTreatment('natural')).toBe(false);
    expect(tintForPhotoTreatment('warm')).toBe(true);
    expect(tintForPhotoTreatment(getRealm('tienda').photoTreatment)).toBe(false);
    expect(tintForPhotoTreatment(getRealm('resonario').photoTreatment)).toBe(true);
  });
});

describe('landscape drift', () => {
  it('is not mounted with reduced motion', () => {
    expect(driftPlan(true)).toBeNull();
  });

  it('keeps a slow, bounded cycle when motion is allowed', () => {
    const plan = driftPlan(false);

    expect(plan).not.toBeNull();
    expect(plan!.seconds).toBeGreaterThanOrEqual(20);
    expect(plan!.shiftPercent).toBeGreaterThan(0);
    expect(plan!.shiftPercent).toBeLessThanOrEqual(3);
    expect(plan!.scale).toBeGreaterThan(1);
    expect(plan!.scale).toBeLessThanOrEqual(1.08);
  });

  it('animates only transform in the component, and checks reduced motion before mounting', () => {
    const source = readSource(`${SRC}/components/world/landscape-drift.tsx`);

    expect(source).toContain('useReducedMotionSafe');
    expect(source).toContain('driftPlan(reduced)');
    expect(source).not.toMatch(/\b(width|height|top|left|right|bottom|margin|padding)\s*:/);
  });
});

describe('zebra motion', () => {
  it('keeps the zebra still by default: a looping sweep reads as loading', () => {
    expect(readSource(`${SRC}/components/ui/media-skeleton.tsx`)).toContain('animated = false');
  });

  it('never animates a zebra in a view: the only wait is the loading scene', () => {
    // Con una sola espera (`LoadingScene`) ninguna silueta barre: un barrido
    // en una vista se leería como «cargando» donde no se carga nada.
    for (const path of sourceFiles(SRC, /\.tsx$/)) {
      const skeletons = readSource(path).match(/<MediaSkeleton[^>]*>/g) ?? [];
      for (const skeleton of skeletons) expect(skeleton, path).not.toMatch(/\banimated\b/);
    }
  });
});
