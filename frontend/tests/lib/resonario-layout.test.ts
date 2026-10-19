import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { AUDIO_KINDS } from '@/config/audio-kinds';
import { AUDIOS } from '@/data';
import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { featuredAudio, kindSections } from '@/lib/resonario/layout-slots';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const readSource = (relativePath: string) =>
  readFileSync(resolve(SOURCE_ROOT, relativePath), 'utf8');

const pageSource = readSource('app/[locale]/resonario/page.tsx');
const systemSource = readSource('components/features/resonario/resonario-system.tsx');
const filtersSource = readSource('components/features/resonario/resonario-filters.tsx');
const trackCardSource = readSource('components/features/resonario/track-card.tsx');
const sunSource = readSource('components/features/resonario/featured-sun.tsx');
const heroSource = readSource('components/layout/realm-hero.tsx');
const loadingSource = readSource('app/[locale]/resonario/loading.tsx');

/**
 * El texto celta de Marisol, tal cual (`Mensajes Marisol.txt`, líneas 96–108,
 * sin el enlace de la línea 94): el título y sus párrafos, y el cierre.
 */
const CELTIC_ES_VERBATIM = [
  'Música de inspiración celta: una invitación a bajar el ritmo',
  'Hay melodías que nos invitan a detenernos y escuchar. La música de inspiración celta puede abrir ese espacio: una pausa para sentir, imaginar y disfrutar del sonido.',
  'Parte de su riqueza nace de tradiciones como la del arpa irlandesa, que ha acompañado la vida cultural de Irlanda durante más de mil años. Sus notas conservan una historia de expresión, memoria y encuentro.',
  'En sus versiones más suaves, el sonido delicado del arpa, las frases de flauta y las melodías pausadas pueden crear una atmósfera acogedora. Si estos sonidos te resultan agradables, pueden acompañarte mientras descansas, contemplas un paisaje o dedicas unos minutos a ti.',
  'La investigación sobre música sugiere que escucharla puede favorecer el estado de ánimo, aunque cada persona responde de manera diferente. Su valor también está en lo que despierta en ti: serenidad, emoción, recuerdos o una sensación de compañía.',
  'En Frecuencia Mágica elegimos estas melodías para ofrecerte un momento de escucha sin exigencias. No necesitas alcanzar un estado especial. Solo encontrar un volumen cómodo y descubrir cómo te sientes.',
  'Deja que la melodía te acompañe. Este momento es tuyo.',
] as const;

const RESONARIO_SLOTS = [
  { slot: 'resonario.hero' as const, aspect: '16:9' as const, alt: 'hero' },
  { slot: 'resonario.featured' as const, aspect: '16:8' as const, alt: 'featured' },
  { slot: 'resonario.archive-banner' as const, aspect: '16:9' as const, alt: 'archiveBanner' },
  { slot: 'resonario.audio-cover.*' as const, aspect: '1:1' as const, alt: 'audioCover' },
];

type ResonarioMediaMessages = { media: { alt: Record<string, string> } };
const esResonario = esMessages.resonario as unknown as ResonarioMediaMessages;
const enResonario = enMessages.resonario as unknown as ResonarioMediaMessages;

describe('resonario por tipo de escucha', () => {
  it('la destacada es la primera frecuencia lista y no se repite en su sección', () => {
    expect(featuredAudio(AUDIOS)?.id).toBe('a1');

    const frequency = kindSections(AUDIOS, 'frequency', 'a1')[0]!;
    expect(frequency.tracks.map((audio) => audio.id)).not.toContain('a1');
  });

  it('muestra la destacada sólo en «Todo», y nunca dos veces', () => {
    expect(systemSource).toContain("const showAll = !filter || filter === 'all';");
    expect(systemSource).toContain('showAll ? featured?.id : undefined');
    expect(systemSource).toContain('{showAll && featured ? <FeaturedSun');
  });

  it('filtra por el campo kind del catálogo, nunca por texto traducido', () => {
    expect(filtersSource).toContain('AUDIO_KINDS.map((entry) => entry.kind)');
    expect(filtersSource).toContain("onChange(key === 'all' ? null : key)");
    expect(filtersSource).not.toMatch(/tags\./);
  });

  it('cada tipo tiene su explicación en ES y EN, distinta en cada idioma', () => {
    for (const entry of AUDIO_KINDS) {
      const es = esMessages.resonario.kinds[entry.kind].explanation;
      const en = enMessages.resonario.kinds[entry.kind].explanation;

      expect(es, `es ${entry.kind}`).toBeTruthy();
      expect(en, `en ${entry.kind}`).toBeTruthy();
      expect(en).not.toBe(es);
    }
  });

  it('el texto celta en ES coincide verbatim con el de Marisol', () => {
    const celtic = esMessages.resonario.celtic;

    expect(celtic.heading).toBe(CELTIC_ES_VERBATIM[0]);
    expect([celtic.p1, celtic.p2, celtic.p3, celtic.p4, celtic.p5]).toEqual(
      CELTIC_ES_VERBATIM.slice(1, 6),
    );
    expect(celtic.closing).toBe(CELTIC_ES_VERBATIM[6]);
  });

  it('el texto celta tiene traducción EN propia, para aprobación de Marisol', () => {
    const celticEn = enMessages.resonario.celtic;
    const keys = ['heading', 'p1', 'p2', 'p3', 'p4', 'p5', 'closing'] as const;

    for (const key of keys) {
      expect(celticEn[key], key).toBeTruthy();
      expect(celticEn[key], key).not.toBe(esMessages.resonario.celtic[key]);
    }
  });

  it('cada banner de tipo resuelve su instancia y tiene alt en ES y EN', () => {
    for (const entry of AUDIO_KINDS) {
      const media = resolveEditorialMedia('resonario.kind-banner.*', {
        instance: entry.bannerSlug,
        alt: `kind ${entry.kind}`,
      });

      expect(media).toMatchObject({ slot: 'resonario.kind-banner.*', aspect: '16:8' });
      expect(EDITORIAL_MEDIA_REGISTRY['resonario.kind-banner.*']).toBeDefined();
      expect(esMessages.resonario.media.alt.kindBanner[entry.kind]).toBeTruthy();
      expect(enMessages.resonario.media.alt.kindBanner[entry.kind]).toBeTruthy();
    }
  });

  it('la página cablea los banners por tipo y la pieza celta desde sus slots', () => {
    expect(pageSource).toContain("resolveEditorialMedia('resonario.kind-banner.*', {");
    expect(pageSource).toContain("resolveEditorialMedia('resonario.celtic'");
    expect(pageSource).toContain('kindBanners: Object.fromEntries(');
    expect(pageSource).toContain('<ResonarioSystem media={resonarioMedia}');
  });

  it('qué suena y el aviso de auriculares se ven siempre en la tarjeta, antes de la guía plegada', () => {
    const guideSource = readSource('components/features/resonario/track-guide.tsx');

    expect(trackCardSource.indexOf("t('guide.composition')")).toBeGreaterThan(-1);
    expect(trackCardSource.indexOf("t('guide.composition')")).toBeLessThan(
      trackCardSource.indexOf('<TrackGuide'),
    );
    expect(trackCardSource).toContain(
      "{audio.headphones ? <span>{t('guide.headphones')}</span> : null}",
    );
    // La guía plegada sólo lleva postura y momento.
    expect(guideSource).not.toContain('guide.composition');
    expect(guideSource).not.toContain('guide.headphones');
  });

  it('una pista sin material se lista como «Próximamente», sin controles de play', () => {
    expect(trackCardSource).toContain('const ready = isPlayable(audio);');
    expect(trackCardSource).toContain("<Badge>{t('soon')}</Badge>");
    // Los controles de muestra y completa sólo existen dentro de la rama lista.
    const readyBranch = trackCardSource.slice(
      trackCardSource.indexOf('{ready ? ('),
      trackCardSource.indexOf(") : (\n        <Badge>{t('soon')}"),
    );
    expect(readyBranch).toContain('<SampleButton');
    expect(readyBranch).toContain('open(audio.id)');
  });

  it('la tarjeta dice qué es, cuánto dura y si lleva voz, y la guía va antes de reproducir', () => {
    expect(trackCardSource).toContain('t(`kinds.${audio.kind}.title`');
    expect(trackCardSource).toContain("audio.duration ?? t('soon')");
    expect(trackCardSource).toContain("audio.voice ? t('card.voice') : t('card.noVoice')");
    expect(trackCardSource).toContain('<TrackGuide');
  });

  it('la muestra va por el canal de preview del reproductor, y «Escuchar completa» abre la pista', () => {
    const sampleSource = readSource('components/features/resonario/sample-button.tsx');

    expect(sampleSource).toContain("open(audioId, 'preview')");
    expect(sampleSource).toContain("t('sample.label')");
    expect(sampleSource).toContain("t('sample.listen')");
    expect(esMessages.resonario.sample.full).toBeTruthy();
  });

  it('cada sección ocupa su tipo y el orden es el de AUDIO_KINDS, sin el orbital', () => {
    expect(systemSource).toContain('<KindSection');
    expect(systemSource).not.toContain('<AudioDisc');
    expect(systemSource).not.toContain('orbitalLayout');
    expect(systemSource).toContain('grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4');
  });

  it('muestra un vacío de marca cuando el filtro no tiene secciones', () => {
    expect(systemSource).toContain('{sections.length === 0 ? (');
    expect(systemSource).toContain('<EmptyState');
  });
});

describe('resonario editorial composition contracts', () => {
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
    // El archivo es una tarjeta enmarcada (`FramedHeading`), no una banda a sangre.
    expect(pageSource).toContain("resolveEditorialMedia('resonario.archive-banner'");
    // Las portadas por audio no se resuelven en la página: las pinta cada tarjeta.
    expect(pageSource).not.toContain("'resonario.audio-cover.*'");
    expect(pageSource).toContain("alt: t('media.alt.hero')");
    expect(pageSource).toContain("sizes: '(min-width: 1024px) 720px, 100vw'");
    // El héroe es un `RealmHero`: su imagen por tema la resuelve `EditorialImage`.
    expect(pageSource).toContain('<RealmHero');
    expect(heroSource).toContain('<FullBleedSection');
    expect(pageSource).toContain('fm-editorial-full-bleed');
    expect(pageSource).toContain('<ResonarioSystem media={resonarioMedia}');
  });

  it('paints every track as its sphere, the same AudioDisc as the rest of the site', () => {
    const discSource = readSource('components/features/player/audio-disc.tsx');
    const coverSource = readSource('components/features/player/audio-cover.tsx');

    // La esfera (AudioDisc) es la portada de la tarjeta; sin foto, pinta su banda.
    expect(trackCardSource).toContain('<AudioDisc');
    expect(trackCardSource).toContain('caption={false}');
    expect(trackCardSource).toContain('interactive={ready}');
    expect(discSource).toContain('resolveAudioCover(audio');
    expect(discSource).toContain('interactive = true');
    expect(coverSource).toContain('<EditorialImage');
    expect(coverSource).toContain("editorialVisual(media) !== 'photo'");
  });

  it('the active track in a card says «Sonando ahora», and the featured sun does too while it plays', () => {
    expect(trackCardSource).toContain('const { playing } = useAudioPlayback(audio.id);');
    expect(trackCardSource).toContain("t('nowPlaying')");
    expect(sunSource).toContain("t('nowPlaying')");
    expect(esMessages.resonario.nowPlaying).toBeTruthy();
    expect(enMessages.resonario.nowPlaying).not.toBe(esMessages.resonario.nowPlaying);
  });

  it('the now-playing label keeps its space and only fades its opacity, so the sphere does not jump', () => {
    // Montado siempre, con su hueco de altura fijo; sólo cambia la opacidad y sin movimiento reducido.
    expect(trackCardSource).not.toMatch(/\{playing \? \(/);
    expect(trackCardSource).toContain('h-7');
    expect(trackCardSource).toContain('transition-opacity');
    expect(trackCardSource).toContain('motion-reduce:transition-none');
  });

  it('the featured track is the sun: a large AudioDisc with its photo, not a card', () => {
    expect(sunSource).toContain('size="lg"');
    expect(sunSource).toContain('cover={cover}');
    expect(sunSource).toContain('showPlay');
    expect(systemSource).toContain('<FeaturedSun');
    expect(systemSource).toContain('cover={media.featured}');
  });

  it('shows the same audio cover in the player dock and in the collapsed player', () => {
    const dockSource = readSource('components/features/player/player-dock.tsx');
    const miniSource = readSource('components/features/player/player-mini.tsx');
    const orbSource = readSource('components/features/player/player-orb.tsx');

    expect(dockSource).toContain('<AudioCover media={resolveAudioCover(audio');
    // La carátula de la barra es el mismo `PlayerOrb` con la misma portada, ahora con su aro de
    // avance: lo lee en su propia hoja (ver player-progress), igual que el disco recogido.
    expect(dockSource).toContain('<PlayerArtworkProgress');
    expect(dockSource).toContain('band={audio.band}');
    expect(dockSource).toContain('<PlayerMiniProgress');
    expect(dockSource).toContain('cover={cover}');
    const progressSource = readSource('components/features/player/player-progress.tsx');
    expect(progressSource).toContain(
      '<PlayerOrb {...props} progress={progressPercent(elapsed, total)}',
    );
    expect(progressSource).toContain('progress={progressPercent(elapsed, total)}');
    expect(miniSource).toContain('<PlayerOrb band={band} cover={cover}');
    expect(orbSource).toContain(
      '{cover ? <span className="absolute inset-0">{cover}</span> : null}',
    );
  });

  it('reads the archive as a framed card, not a band, between the hero and the system', () => {
    // Héroe (banda) → tarjeta enmarcada (contenida) → sistema: nunca dos bandas seguidas.
    expect(pageSource).not.toContain('<BandChain');
    expect(pageSource).not.toContain('<EditorialBanner');
    const hero = pageSource.indexOf('<RealmHero');
    const archive = pageSource.indexOf("t('archive.title')");
    const system = pageSource.indexOf('<ResonarioSystem');
    expect(hero).toBeGreaterThan(-1);
    expect(archive).toBeGreaterThan(hero);
    expect(system).toBeGreaterThan(archive);
    expect(pageSource).toContain('<FramedHeading');
    expect(pageSource).toContain("t('archive.eyebrow')");
    expect(pageSource).toContain("t('archive.description')");

    // Los filtros quedan justo encima de lo que filtran.
    const filtersIndex = systemSource.indexOf('<ResonarioFilters');
    const catalogIndex = systemSource.indexOf('{sections.length === 0');
    expect(filtersIndex).toBeGreaterThan(-1);
    expect(catalogIndex).toBeGreaterThan(filtersIndex);
  });

  it('waits with the shared loading scene, like every other view', () => {
    // Una sola espera en todo el sitio: la esfera de `states.loading` (ver `loading-flow`).
    expect(loadingSource.trim()).toBe(
      "export { RealmLoading as default } from '@/components/layout';",
    );
  });
});

export {};
