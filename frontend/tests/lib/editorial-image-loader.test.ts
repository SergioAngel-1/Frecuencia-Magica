import { describe, expect, it, vi } from 'vitest';

import editorialImageLoader from '@/lib/editorial/image-loader';

// El manifiesto real cambia con cada ingesta: el contrato del loader no depende de él.
vi.mock('@/config/editorial-assets.generated', () => ({
  EDITORIAL_ASSETS: { 'home.hero': '/editorial/home-hero.avif' },
  EDITORIAL_ASSET_WIDTHS: {
    '/editorial/home-hero.avif': [640, 828, 1200, 1920, 2880],
    '/editorial/sanctuary-daily.avif': [640, 828, 1200, 1254],
  },
}));

describe('editorial image loader', () => {
  it('serves the exact variant when the requested width is published', () => {
    expect(editorialImageLoader({ src: '/editorial/home-hero.avif', width: 1200 })).toBe(
      '/editorial/home-hero-1200.avif',
    );
  });

  it('rounds an intermediate width up to the next variant', () => {
    expect(editorialImageLoader({ src: '/editorial/home-hero.avif', width: 1080 })).toBe(
      '/editorial/home-hero-1200.avif',
    );
    expect(editorialImageLoader({ src: '/editorial/home-hero.avif', width: 96 })).toBe(
      '/editorial/home-hero-640.avif',
    );
  });

  it('caps a width above the largest variant at the largest one', () => {
    expect(editorialImageLoader({ src: '/editorial/home-hero.avif', width: 3840 })).toBe(
      '/editorial/home-hero-2880.avif',
    );
    expect(editorialImageLoader({ src: '/editorial/sanctuary-daily.avif', width: 1920 })).toBe(
      '/editorial/sanctuary-daily-1254.avif',
    );
  });

  it('returns a source outside the manifest untouched, like the logo', () => {
    expect(editorialImageLoader({ src: '/logo.png', width: 256 })).toBe('/logo.png');
    expect(editorialImageLoader({ src: '/editorial/og-image.jpg', width: 640 })).toBe(
      '/editorial/og-image.jpg',
    );
  });

  it('keeps a query string on the chosen variant', () => {
    expect(editorialImageLoader({ src: '/editorial/home-hero.avif?v=2', width: 828 })).toBe(
      '/editorial/home-hero-828.avif?v=2',
    );
  });
});
