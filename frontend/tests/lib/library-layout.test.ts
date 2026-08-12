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
    expect(pageSource).toContain('<FullBleedSection');
    expect(pageSource).toContain('fm-editorial-full-bleed');
    expect(pageSource).toContain('<LibrarySystem media={libraryMedia}');
  });

  it('keeps the featured frequency inside the editorial field and never maps it as a secondary', () => {
    expect(systemSource).toContain('media: LibraryMedia');
    expect(systemSource).toContain('<EditorialImage');
    expect(systemSource).toContain('media={media.featured}');
    expect(systemSource).toContain('media={audioCoverMedia(audio)}');
    expect(systemSource).toContain("alt: t('media.alt.audioCover', { title: audioTitle(audio) })");
    expect(systemSource).toContain('data-editorial-featured="true"');
    expect(systemSource).toContain('{others.map');
    expect(systemSource).not.toContain('{filtered.map');
    expect(systemSource).toContain('<LibrarySecondaryDisc');
    expect(readSource('components/features/library/library-secondary-disc.tsx')).toContain(
      'onOpen(audio.id)',
    );
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
    expect(loadingSource).toContain('slot="library.featured"');
    expect(loadingSource).toContain('slot="library.archive-banner"');
    expect(loadingSource).toContain('role="group"');
    expect(loadingSource).toContain('data-editorial-stage="orbital"');
    expect(loadingSource).toContain('lg:hidden');
    expect(loadingSource).toContain('lg:block');
    expect(filtersSource).toContain("onChange(key === 'all' ? null : key)");
  });
});

export {};
