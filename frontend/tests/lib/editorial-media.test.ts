import { describe, expect, it, vi } from 'vitest';

import { EDITORIAL_MEDIA_REGISTRY, EDITORIAL_MEDIA_SLOTS } from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { mediaLayout } from '@/lib/editorial/media-layout';

// El manifiesto real crece con cada imagen publicada: el contrato no puede depender de él.
vi.mock('@/config/editorial-assets.generated', () => ({
  EDITORIAL_ASSETS: {
    'discover.hero': '/editorial/discover-hero.avif',
    'resonario.audio-cover:a1': '/editorial/resonario-audio-cover-a1.avif',
  },
}));

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

  it('takes the published asset of a slot when the view passes no source', () => {
    expect(resolveEditorialMedia('discover.hero', { alt: 'x' })).toMatchObject({
      src: '/editorial/discover-hero.avif',
      kind: 'photo',
    });
  });

  it('lets an explicit source win over the published asset', () => {
    const media = resolveEditorialMedia('discover.hero', { src: '/editorial/otra.avif', alt: 'x' });

    expect(media.src).toBe('/editorial/otra.avif');
  });

  it('resolves a per-item slot by instance, replacing the wildcard of the slot id', () => {
    const withPhoto = resolveEditorialMedia('resonario.audio-cover.*', {
      instance: 'a1',
      alt: 'x',
    });
    const withoutPhoto = resolveEditorialMedia('resonario.audio-cover.*', {
      instance: 'a2',
      alt: 'x',
    });
    const noInstance = resolveEditorialMedia('resonario.audio-cover.*', { alt: 'x' });

    expect(withPhoto).toMatchObject({
      src: '/editorial/resonario-audio-cover-a1.avif',
      kind: 'photo',
    });
    // Un ítem sin foto no hereda la de otro: pinta el fallback de su contrato.
    expect(withoutPhoto.kind).toBe('fallback');
    expect(withoutPhoto.src).toBeUndefined();
    expect(noInstance.src).toBeUndefined();
  });

  it('gives a mobile focal point only to home.hero and sanctuary.hero, without moving their desktop focus', () => {
    const withMobile = EDITORIAL_MEDIA_SLOTS.filter(
      (slot) => EDITORIAL_MEDIA_REGISTRY[slot].mobilePosition !== undefined,
    );

    expect(withMobile).toEqual(['home.hero', 'sanctuary.hero']);
    expect(EDITORIAL_MEDIA_REGISTRY['home.hero']).toMatchObject({
      position: '62% 40%',
      mobilePosition: '75% 40%',
    });
    // El cuerpo de luz de Mi Santuario está en la mitad baja y a la derecha.
    expect(EDITORIAL_MEDIA_REGISTRY['sanctuary.hero']).toMatchObject({
      position: '50% 72%',
      mobilePosition: '90% 72%',
    });
  });

  it('marks only discover.question-atmosphere as a full-screen backdrop', () => {
    const backdrops = EDITORIAL_MEDIA_SLOTS.filter(
      (slot) => EDITORIAL_MEDIA_REGISTRY[slot].backdrop,
    );

    expect(backdrops).toEqual(['discover.question-atmosphere']);
  });

  it('propagates the mobile focal point, and lets the view override it', () => {
    expect(resolveEditorialMedia('home.hero', { alt: 'x' }).mobilePosition).toBe('75% 40%');
    expect(
      resolveEditorialMedia('home.hero', { alt: 'x', mobilePosition: '80% 40%' }).mobilePosition,
    ).toBe('80% 40%');
    expect(resolveEditorialMedia('discover.hero', { alt: 'x' })).not.toHaveProperty(
      'mobilePosition',
    );
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
    expect(mediaLayout('portrait', { focalPoint: '50% 30%' })).toMatchObject({
      ratio: '3:4',
      objectPosition: '50% 30%',
    });
    expect(mediaLayout('banner', 'desktop').sizes).toBe(mediaLayout('banner', 'desktop').sizes);
  });
});

export {};
