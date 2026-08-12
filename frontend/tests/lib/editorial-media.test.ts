import { describe, expect, it } from 'vitest';

import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { mediaLayout } from '@/lib/editorial/media-layout';

describe('editorial media contracts', () => {
  it('uses a zebra fallback without inventing a URL when a slot has no source', () => {
    const media = resolveEditorialMedia('home.hero', {
      alt: 'El universo Frecuencia Mágica en una sola imagen',
      sizes: '100vw',
    });

    expect(media).toMatchObject({
      alt: 'El universo Frecuencia Mágica en una sola imagen',
      slot: 'home.hero',
      kind: 'fallback',
    });
    expect(media.src).toBeUndefined();
  });

  it('keeps a registered source as real editorial media', () => {
    const media = resolveEditorialMedia('portal.hero', {
      src: '/editorial/portal-hero.avif',
      alt: 'Luz y cosmos en el umbral de Frecuencia Mágica',
      sizes: '100vw',
    });

    expect(media).toMatchObject({
      src: '/editorial/portal-hero.avif',
      slot: 'portal.hero',
      kind: 'photo',
    });
  });

  it('returns deterministic layout contracts for each editorial mode', () => {
    expect(mediaLayout('viewport', 'desktop')).toMatchObject({
      ratio: 'viewport',
      overlay: 'left',
      sizes: '100vw',
    });
    expect(mediaLayout('banner', 'mobile')).toMatchObject({
      ratio: '16:8',
      overlay: 'bottom',
      sizes: '100vw',
    });
    expect(
      mediaLayout('portrait', { focalPoint: '50% 30%' }),
    ).toMatchObject({
      ratio: '3:4',
      objectPosition: '50% 30%',
    });
    expect(mediaLayout('banner', 'desktop').sizes).toBe(
      mediaLayout('banner', 'desktop').sizes,
    );
  });
});

export {};
