import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { EDITORIAL_MEDIA_REGISTRY, type EditorialMediaSlot } from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type HomeMediaAlias =
  | 'home.hero'
  | 'home.daily-frequency'
  | 'home.audio-banner'
  | 'home.realms-banner'
  | 'home.marisol'
  | 'home.membership'
  | 'home.footer-banner';

const HOME_MEDIA_SLOTS = {
  'home.hero': 'home.hero',
  'home.daily-frequency': 'home.daily-frequency',
  'home.audio-banner': 'home.audio-banner',
  'home.realms-banner': 'home.realms-banner',
  'home.marisol': 'home-marisol-portrait',
  'home.membership': 'home-membership',
  'home.footer-banner': 'home.footer-banner',
} as const satisfies Record<HomeMediaAlias, EditorialMediaSlot>;

const HOME_MEDIA_ALT_KEYS = {
  'home.hero': 'hero',
  'home.daily-frequency': 'dailyFrequency',
  'home.audio-banner': 'audioBanner',
  'home.realms-banner': 'realmsBanner',
  'home.marisol': 'marisolPortrait',
  'home.membership': 'membership',
  'home.footer-banner': 'footerBanner',
} as const satisfies Record<HomeMediaAlias, keyof typeof esMessages.home.media.alt>;

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const homePageSource = readSource('app/[locale]/inicio/page.tsx');
const footerSource = readSource('components/layout/site-footer.tsx');
const homeSources = [
  homePageSource,
  readSource('components/features/home/hero-section.tsx'),
  readSource('components/features/home/daily-frequency.tsx'),
  readSource('components/features/home/audio-grid.tsx'),
  readSource('components/features/home/realms-grid.tsx'),
  readSource('components/features/home/realm-card.tsx'),
  readSource('components/features/home/about-section.tsx'),
  readSource('components/features/home/membership-section.tsx'),
  footerSource,
].join('\n');

const registryAspectBySlot = {
  'home.hero': '16:9',
  'home.daily-frequency': '16:8',
  'home.audio-banner': '16:9',
  'home.realms-banner': '16:8',
  'home-marisol-portrait': '3:4',
  'home-membership': '16:9',
  'home.footer-banner': '16:9',
} as const;

describe('home editorial composition contracts', () => {
  it('resolves every localized home media alt without a registry phrase or invented source', () => {
    for (const [requestedSlot, registeredSlot] of Object.entries(HOME_MEDIA_SLOTS) as [
      HomeMediaAlias,
      EditorialMediaSlot,
    ][]) {
      const altKey = HOME_MEDIA_ALT_KEYS[requestedSlot];
      const esAlt = esMessages.home.media.alt[altKey];
      const enAlt = enMessages.home.media.alt[altKey];
      const media = resolveEditorialMedia(registeredSlot, { alt: esAlt });

      expect(enAlt).not.toBe(esAlt);
      expect(EDITORIAL_MEDIA_REGISTRY[registeredSlot]).not.toHaveProperty('alt');
      expect(media).toMatchObject({
        alt: esAlt,
        aspect: registryAspectBySlot[registeredSlot as keyof typeof registryAspectBySlot],
        kind: 'fallback',
        slot: registeredSlot,
      });
      expect(media.src).toBeUndefined();
      expect(requestedSlot).toMatch(/^home\./);
    }
  });

  it('resolves home alt text in the locale-aware server/client callers', () => {
    expect(homePageSource).toContain('const locale = await resolveLocale(params);');
    expect(homePageSource).toContain("getTranslations({ locale, namespace: 'home' })");

    for (const altKey of Object.values(HOME_MEDIA_ALT_KEYS).slice(0, 6)) {
      expect(homePageSource).toContain(`alt: t('media.alt.${altKey}')`);
    }

    expect(footerSource).toContain("alt: tHome('media.alt.footerBanner')");
    expect(homeSources).not.toMatch(/alt:\s*['"][^'"]*[áéíóúñ]/i);
  });

  it('wires the seven canonical home slots through the shared editorial resolver', () => {
    for (const registeredSlot of Object.values(HOME_MEDIA_SLOTS)) {
      expect(homeSources).toContain(`resolveEditorialMedia('${registeredSlot}'`);
    }

    expect(homeSources).toContain('<FullBleedSection');
    expect(homeSources).toContain('<EditorialBanner');
    expect(homeSources).toContain('<EditorialImage');
    expect(homeSources).toContain('<PageShell');
    expect(homeSources).toContain('export function SiteFooter');
  });

  it('preserves canonical aliases, focal points, and declared banner ratios', () => {
    expect(HOME_MEDIA_SLOTS['home.marisol']).toBe('home-marisol-portrait');
    expect(EDITORIAL_MEDIA_REGISTRY['home.hero'].position).toBe('62% 40%');
    expect(EDITORIAL_MEDIA_REGISTRY['home-membership'].position).toBe('50% 15%');
    expect(EDITORIAL_MEDIA_REGISTRY['home-membership'].aspect).toBe('16:9');
    expect(EDITORIAL_MEDIA_REGISTRY['home.footer-banner'].aspect).toBe('16:9');

    const bannerSource = readSource('components/ui/editorial-banner.tsx');
    expect(bannerSource).toContain('aspect={media.aspect}');
  });

  it('keeps the daily player action independent from block content', () => {
    const dailySource = readSource('components/features/home/daily-frequency.tsx');
    const buttonStart = dailySource.indexOf('      <button');
    const buttonEnd = dailySource.indexOf('      </button>', buttonStart);
    const buttonBody = dailySource.slice(buttonStart, buttonEnd);

    expect(dailySource).toContain('<section');
    expect(dailySource).toContain('aria-pressed={isActive}');
    expect(buttonStart).toBeGreaterThan(-1);
    expect(buttonEnd).toBeGreaterThan(buttonStart);
    expect(buttonBody).not.toMatch(/<(?:div|h[1-6]|p)\b/);
  });

  it('restores the approved decorative logo and fixed-ui reserve on home', () => {
    const heroSource = readSource('components/features/home/hero-section.tsx');

    expect(heroSource).toContain('src="/logo.png"');
    expect(heroSource).toContain('alt=""');
    expect(homePageSource).not.toContain('reserveBottomUi={false}');
  });

  it('makes absent editorial media fill its positioned wrapper', () => {
    const imageSource = readSource('components/ui/editorial-image.tsx');

    expect(imageSource).toContain('<MediaSkeleton');
    expect(imageSource).toContain('className="h-full w-full"');
  });

  it('keeps the home composition free of remote or stock image sources', () => {
    expect(homeSources).not.toMatch(/unsplash|pexels|images\.unsplash|https?:\/\//i);
    expect(homeSources).not.toContain('data-media-slot="home.');
  });
});

export {};
