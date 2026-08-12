import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const homeSources = [
  readSource('app/[locale]/inicio/page.tsx'),
  readSource('components/features/home/hero-section.tsx'),
  readSource('components/features/home/daily-frequency.tsx'),
  readSource('components/features/home/audio-grid.tsx'),
  readSource('components/features/home/realms-grid.tsx'),
  readSource('components/features/home/realm-card.tsx'),
  readSource('components/features/home/about-section.tsx'),
  readSource('components/features/home/membership-section.tsx'),
  readSource('components/layout/site-footer.tsx'),
].join('\n');

const HOME_MEDIA_SLOTS = {
  'home.hero': 'home.hero',
  'home.daily-frequency': 'home.daily-frequency',
  'home.audio-banner': 'home.audio-banner',
  'home.realms-banner': 'home.realms-banner',
  'home.marisol': 'home-marisol-portrait',
  'home.membership': 'home-membership',
  'home.footer-banner': 'home.footer-banner',
} as const;

describe('home editorial composition contracts', () => {
  it('resolves every home media slot to a named fallback without inventing a source', () => {
    for (const [requestedSlot, registeredSlot] of Object.entries(HOME_MEDIA_SLOTS)) {
      const media = resolveEditorialMedia(registeredSlot, {
        alt: EDITORIAL_MEDIA_REGISTRY[registeredSlot].alt,
      });

      expect(media).toMatchObject({
        alt: EDITORIAL_MEDIA_REGISTRY[registeredSlot].alt,
        kind: 'fallback',
        slot: registeredSlot,
      });
      expect(media.src).toBeUndefined();
      expect(requestedSlot).toMatch(/^home\./);
    }
  });

  it('wires the seven home slots through the shared editorial resolver', () => {
    for (const registeredSlot of Object.values(HOME_MEDIA_SLOTS)) {
      expect(homeSources).toContain(`resolveEditorialMedia('${registeredSlot}')`);
    }

    expect(homeSources).toContain('<FullBleedSection');
    expect(homeSources).toContain('<EditorialBanner');
    expect(homeSources).toContain('<EditorialImage');
    expect(homeSources).toContain('<PageShell');
    expect(homeSources).toContain('export function SiteFooter');
  });

  it('keeps the home composition free of remote or stock image sources', () => {
    expect(homeSources).not.toMatch(/unsplash|pexels|images\.unsplash|https?:\/\//i);
    expect(homeSources).not.toContain('data-media-slot="home.');
  });
});

export {};
