import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { AUDIOS } from '@/data';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { splitFeaturedAudio } from '@/lib/library/layout-slots';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const pageSource = readSource('app/[locale]/biblioteca/page.tsx');
const systemSource = readSource('components/features/library/library-system.tsx');
const filtersSource = readSource('components/features/library/library-filters.tsx');
const heroSource = readSource('components/layout/realm-hero.tsx');
const loadingSource = readSource('app/[locale]/biblioteca/loading.tsx');

const LIBRARY_SLOTS = [
  { slot: 'library.hero' as const, aspect: '16:9' as const, alt: 'hero' },
  { slot: 'library.featured' as const, aspect: '16:8' as const, alt: 'featured' },
  { slot: 'library.archive-banner' as const, aspect: '16:9' as const, alt: 'archiveBanner' },
  { slot: 'library.audio-cover.*' as const, aspect: '1:1' as const, alt: 'audioCover' },
];

type LibraryMediaMessages = { media: { alt: Record<string, string> } };
const esLibrary = esMessages.library as unknown as LibraryMediaMessages;
const enLibrary = enMessages.library as unknown as LibraryMediaMessages;

describe('library editorial composition contracts', () => {
  it('separates one featured frequency from every secondary frequency', () => {
    const { featured, others } = splitFeaturedAudio(AUDIOS);

    expect(featured?.id).toBe('a1');
    expect(others).toHaveLength(AUDIOS.length - 1);
    expect(others.map((audio) => audio.id)).not.toContain(featured?.id);
  });

  it('keeps the featured split total and stable for empty or single-item catalogs', () => {
    expect(splitFeaturedAudio([])).toEqual({ featured: undefined, others: [] });
    expect(splitFeaturedAudio([AUDIOS[0]!])).toEqual({
      featured: AUDIOS[0],
      others: [],
    });
  });

  it('resolves all library slots to localized zebra fallbacks without inventing media', () => {
    for (const { slot, aspect } of LIBRARY_SLOTS) {
      const media = resolveEditorialMedia(slot, { alt: `Library ${slot}` });

      expect(media).toMatchObject({ kind: 'fallback', slot, aspect });
      expect(media.src).toBeUndefined();
      expect(EDITORIAL_MEDIA_REGISTRY[slot]).toBeDefined();
    }
  });

  it('provides bilingual alt copy for each library slot', () => {
    for (const { alt } of LIBRARY_SLOTS) {
      const esAlt = esLibrary.media.alt[alt];
      const enAlt = enLibrary.media.alt[alt];

      expect(esAlt).toBeTruthy();
      expect(enAlt).toBeTruthy();
      expect(enAlt).not.toBe(esAlt);
    }
  });

  it('composes the full-width hero and localized media contracts before the client system', () => {
    expect(pageSource).toContain('const locale = await resolveLocale(params);');
    expect(pageSource).toContain("getTranslations({ locale, namespace: 'library' })");
    expect(pageSource).toContain("resolveEditorialMedia('library.hero'");
    expect(pageSource).toContain("resolveEditorialMedia('library.featured'");
    expect(pageSource).toContain("resolveEditorialMedia('library.archive-banner'");
    expect(pageSource).toContain("resolveEditorialMedia('library.audio-cover.*'");
    expect(pageSource).toContain("alt: t('media.alt.hero')");
    expect(pageSource).toContain("sizes: '(min-width: 1024px) 720px, 100vw'");
    expect(pageSource).toContain("sizes: '(min-width: 1024px) 150px, 150px'");
    expect(pageSource).toContain('<RealmHero');
    expect(heroSource).toContain('<FullBleedSection');
    expect(pageSource).toContain('fm-editorial-full-bleed');
    expect(pageSource).toContain('<LibrarySystem media={libraryMedia}');
  });

  it('paints featured and secondary frequencies with the shared AudioDisc, cover inside the sphere', () => {
    const discSource = readSource('components/features/player/audio-disc.tsx');

    expect(systemSource).toContain('media: LibraryMedia');
    // Sin doble contenedor: ningún marco de imagen alrededor de los discos.
    expect(systemSource).not.toContain('<EditorialImage');
    expect(systemSource).not.toContain('<FrequencyDisc');
    expect(systemSource.match(/<AudioDisc/g)).toHaveLength(2);
    expect(systemSource).toContain('cover={{ ...media.featured, band: featured.band }}');
    expect(systemSource).toContain('cover={audioCoverMedia(audio)}');
    expect(discSource).toContain('<EditorialImage');
    expect(discSource).toContain("editorialVisual(cover) === 'photo'");
    expect(discSource).toContain('onClick={() => open(audio.id)}');
    expect(systemSource).toContain("alt: t('media.alt.audioCover', { title: audioTitle(audio) })");
    expect(systemSource).toContain('data-editorial-featured="true"');
    expect(systemSource).toContain('{others.map');
    expect(systemSource).not.toContain('{filtered.map');
    expect(systemSource).toContain('<EmptyState');
    expect(systemSource).toContain('<LibraryFilters');
  });

  it('keeps the orbital desktop stage and compact mobile secondary grid', () => {
    expect(systemSource).toContain('grid-cols-[repeat(auto-fill,minmax(140px,1fr))]');
    expect(systemSource).toContain('lg:block');
    expect(systemSource).toContain('lg:min-h-[720px]');
    expect(systemSource).toContain('const slot = discSlot(i)');
    expect(systemSource).toContain('data-editorial-stage="orbital"');
    expect(systemSource).toContain('data-editorial-secondary="true"');
    expect(systemSource).not.toContain('lg:hidden');
  });

  it('places the archive banner between filters and the catalog states', () => {
    const filtersIndex = systemSource.indexOf('<LibraryFilters');
    const bannerIndex = systemSource.indexOf('<EditorialBanner');
    const catalogIndex = systemSource.indexOf('{filtered.length === 0');

    expect(filtersIndex).toBeGreaterThan(-1);
    expect(bannerIndex).toBeGreaterThan(filtersIndex);
    expect(catalogIndex).toBeGreaterThan(bannerIndex);
    expect(systemSource).toContain('media={media.archiveBanner}');
  });

  it('mirrors the editorial bands, media fields, filters and orbital geometry while loading', () => {
    expect(loadingSource).toContain('aria-busy="true"');
    expect(loadingSource).toContain('<MediaSkeleton');
    expect(loadingSource).toContain('slot="library.hero"');
    // El destacado es un disco, no un campo fotográfico: su silueta también.
    expect(loadingSource).not.toContain('slot="library.featured"');
    expect(loadingSource).toContain('variant="disc"');
    // `library.archive-banner` es `none`: la silueta replica un banner sólo de texto.
    expect(loadingSource).not.toContain('slot="library.archive-banner"');
    expect(loadingSource).toContain('role="group"');
    expect(loadingSource).toContain('data-editorial-stage="orbital"');
    expect(loadingSource).toContain('lg:hidden');
    expect(loadingSource).toContain('lg:block');
    expect(filtersSource).toContain("onChange(key === 'all' ? null : key)");
  });
});

export {};
