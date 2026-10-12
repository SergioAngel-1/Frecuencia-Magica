import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { AUDIOS } from '@/data';
import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { splitFeaturedAudio } from '@/lib/resonario/layout-slots';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const pageSource = readSource('app/[locale]/resonario/page.tsx');
const systemSource = readSource('components/features/resonario/resonario-system.tsx');
const filtersSource = readSource('components/features/resonario/resonario-filters.tsx');
const heroSource = readSource('components/layout/realm-hero.tsx');
const loadingSource = readSource('app/[locale]/resonario/loading.tsx');

const RESONARIO_SLOTS = [
  { slot: 'resonario.hero' as const, aspect: '16:9' as const, alt: 'hero' },
  { slot: 'resonario.featured' as const, aspect: '16:8' as const, alt: 'featured' },
  { slot: 'resonario.archive-banner' as const, aspect: '16:9' as const, alt: 'archiveBanner' },
  { slot: 'resonario.audio-cover.*' as const, aspect: '1:1' as const, alt: 'audioCover' },
];

type ResonarioMediaMessages = { media: { alt: Record<string, string> } };
const esResonario = esMessages.resonario as unknown as ResonarioMediaMessages;
const enResonario = enMessages.resonario as unknown as ResonarioMediaMessages;

describe('resonario editorial composition contracts', () => {
  it('separates one featured frequency from every secondary frequency', () => {
    const { featured, others } = splitFeaturedAudio(AUDIOS);

    expect(featured?.id).toBe('a1');
    expect(others).toHaveLength(AUDIOS.length - 1);
    expect(others.map((audio) => audio.id)).not.toContain(featured?.id);
  });

  it('gives the centre to the active frequency, read from the player store', () => {
    expect(systemSource).toContain('const activeId = useActiveAudioId();');
    expect(systemSource).toContain('orbitalLayout(filtered, orbital ? activeId : null)');
    expect(systemSource).toContain("t('nowPlaying')");
    expect(esMessages.resonario.nowPlaying).toBeTruthy();
    expect(enMessages.resonario.nowPlaying).not.toBe(esMessages.resonario.nowPlaying);
    // Sólo se desliza la posición, en escritorio y sin movimiento reducido.
    expect(systemSource).toContain('const glide = orbital && !reduced;');
    expect(systemSource).toContain("layout={glide ? 'position' : false}");
    expect(systemSource).not.toMatch(/createContext|Provider/);
  });

  it('keeps the featured split total and stable for empty or single-item catalogs', () => {
    expect(splitFeaturedAudio([])).toEqual({ featured: undefined, others: [] });
    expect(splitFeaturedAudio([AUDIOS[0]!])).toEqual({
      featured: AUDIOS[0],
      others: [],
    });
  });

  it('resolves all resonario slots to their published photo or a fallback, never invented media', () => {
    for (const { slot, aspect } of RESONARIO_SLOTS) {
      const media = resolveEditorialMedia(slot, { alt: `Resonario ${slot}` });
      // La única fuente legítima es la publicada en el manifiesto; nada se inventa.
      const published = EDITORIAL_ASSETS[slot];

      expect(media).toMatchObject({ kind: published ? 'photo' : 'fallback', slot, aspect });
      expect(media.src).toBe(published);
      expect(EDITORIAL_MEDIA_REGISTRY[slot]).toBeDefined();
    }
  });

  it('provides bilingual alt copy for each resonario slot', () => {
    for (const { alt } of RESONARIO_SLOTS) {
      const esAlt = esResonario.media.alt[alt];
      const enAlt = enResonario.media.alt[alt];

      expect(esAlt).toBeTruthy();
      expect(enAlt).toBeTruthy();
      expect(enAlt).not.toBe(esAlt);
    }
  });

  it('composes the full-width hero and localized media contracts before the client system', () => {
    expect(pageSource).toContain('const locale = await resolveLocale(params);');
    expect(pageSource).toContain("getTranslations({ locale, namespace: 'resonario' })");
    expect(pageSource).toContain("resolveEditorialMedia('resonario.hero'");
    expect(pageSource).toContain("resolveEditorialMedia('resonario.featured'");
    expect(pageSource).toContain("resolveEditorialMedia('resonario.archive-banner'");
    // Las portadas por audio no se resuelven en la página: las pinta `AudioDisc`.
    expect(pageSource).not.toContain("'resonario.audio-cover.*'");
    expect(pageSource).toContain("alt: t('media.alt.hero')");
    expect(pageSource).toContain("sizes: '(min-width: 1024px) 720px, 100vw'");
    expect(pageSource).toContain('<RealmHero');
    expect(heroSource).toContain('<FullBleedSection');
    expect(pageSource).toContain('fm-editorial-full-bleed');
    expect(pageSource).toContain('<ResonarioSystem media={resonarioMedia}');
  });

  it('paints featured and secondary frequencies with the shared AudioDisc, cover inside the sphere', () => {
    const discSource = readSource('components/features/player/audio-disc.tsx');
    const coverSource = readSource('components/features/player/audio-cover.tsx');

    expect(systemSource).toContain('media: ResonarioMedia');
    // Sin doble contenedor: ningún marco de imagen alrededor de los discos.
    expect(systemSource).not.toContain('<EditorialImage');
    expect(systemSource).not.toContain('<FrequencyDisc');
    expect(systemSource.match(/<AudioDisc/g)).toHaveLength(2);
    // El destacado en el centro conserva su foto; cualquier otro disco, la
    // portada de su audio, que resuelve el propio disco.
    expect(systemSource).toContain('{ ...media.featured, band: audio.band }');
    expect(systemSource).toContain('cover={centerCover(center)}');
    expect(systemSource.match(/cover=\{/g)).toHaveLength(1);
    expect(systemSource).not.toContain('audioCover');
    expect(discSource).toContain('resolveAudioCover(audio');
    expect(discSource).toContain("alt: t('media.alt.audioCover', { title })");
    expect(discSource).toContain("lg: '(min-width: 1024px) 380px, 84vw'");
    expect(discSource).toContain('cover={<AudioCover media={coverMedia} />}');
    // El disco con control de play comparte estado con el reproductor: su
    // play pasa a pausa mientras suena y pulsarlo conmuta; los demás abren.
    expect(discSource).toContain(
      'onClick={() => (showPlay ? toggleAudio(audio.id) : open(audio.id))}',
    );
    expect(discSource).toContain('useAudioPlayback(audio.id)');
    expect(discSource).toContain('playing={active ? playing : true}');
    expect(coverSource).toContain('<EditorialImage');
    expect(coverSource).toContain("editorialVisual(media) !== 'photo'");
    expect(systemSource).toContain('data-editorial-featured="true"');
    expect(systemSource).toContain('{orbit.map');
    expect(systemSource).not.toContain('{filtered.map');
    expect(systemSource).toContain('<EmptyState');
    expect(systemSource).toContain('<ResonarioFilters');
  });

  it('shows the same audio cover in the player dock and in the collapsed player', () => {
    const dockSource = readSource('components/features/player/player-dock.tsx');
    const miniSource = readSource('components/features/player/player-mini.tsx');
    const orbSource = readSource('components/features/player/player-orb.tsx');

    expect(dockSource).toContain('<AudioCover media={resolveAudioCover(audio');
    expect(dockSource).toContain('<PlayerOrb band={audio.band} cover={cover}');
    expect(dockSource).toContain('cover={cover}\n              progress={pct}');
    expect(miniSource).toContain('<PlayerOrb band={band} cover={cover}');
    expect(orbSource).toContain(
      '{cover ? <span className="absolute inset-0">{cover}</span> : null}',
    );
  });

  it('keeps the orbital desktop stage and compact mobile secondary grid', () => {
    expect(systemSource).toContain('grid-cols-[repeat(auto-fill,minmax(140px,1fr))]');
    expect(systemSource).toContain('lg:block');
    expect(systemSource).toContain('lg:min-h-[720px]');
    expect(systemSource).toContain('const slot = discSlot(index)');
    expect(systemSource).toContain('data-editorial-stage="orbital"');
    expect(systemSource).toContain('data-editorial-secondary="true"');
    expect(systemSource).not.toContain('lg:hidden');
  });

  it('chains the archive banner to the hero and keeps the filters above the catalog states', () => {
    // El banner sigue al héroe en la misma cadena: dos bandas consecutivas, sin hueco.
    const chain = pageSource.slice(
      pageSource.indexOf('<BandChain>'),
      pageSource.indexOf('</BandChain>'),
    );
    expect(chain.indexOf('<RealmHero')).toBeGreaterThan(-1);
    expect(chain.indexOf('<EditorialBanner')).toBeGreaterThan(chain.indexOf('<RealmHero'));
    expect(chain).toContain('media={archiveBanner}');
    expect(systemSource).not.toContain('<EditorialBanner');

    // Los filtros quedan justo encima de lo que filtran.
    const filtersIndex = systemSource.indexOf('<ResonarioFilters');
    const catalogIndex = systemSource.indexOf('{filtered.length === 0');
    expect(filtersIndex).toBeGreaterThan(-1);
    expect(catalogIndex).toBeGreaterThan(filtersIndex);
  });

  it('waits with the shared loading scene, like every other view', () => {
    // Una sola espera en todo el sitio: la esfera de `states.loading` (ver `loading-flow`).
    expect(loadingSource.trim()).toBe(
      "export { RealmLoading as default } from '@/components/layout';",
    );
  });

  it('clears the filter back to the whole archive from the «all» pill', () => {
    expect(filtersSource).toContain("onChange(key === 'all' ? null : key)");
  });
});

export {};
