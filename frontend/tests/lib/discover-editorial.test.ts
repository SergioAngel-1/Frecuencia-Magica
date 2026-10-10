import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { DISCOVER_MEDIA_SLOTS, selectDiscoverMedia } from '@/lib/discover/media';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const pageSource = readFileSync(resolve(SOURCE_ROOT, 'app/[locale]/descubrete/page.tsx'), 'utf8');
const layoutSource = readFileSync(
  resolve(SOURCE_ROOT, 'components/features/descubrete/quiz-layout.tsx'),
  'utf8',
);
const stepSource = readFileSync(
  resolve(SOURCE_ROOT, 'components/features/descubrete/quiz-step.tsx'),
  'utf8',
);
const containerSource = readFileSync(
  resolve(SOURCE_ROOT, 'components/features/descubrete/quiz-container.tsx'),
  'utf8',
);
const resultSource = readFileSync(
  resolve(SOURCE_ROOT, 'components/features/descubrete/result-step.tsx'),
  'utf8',
);
const fullBleedSource = readFileSync(
  resolve(SOURCE_ROOT, 'components/ui/full-bleed-section.tsx'),
  'utf8',
);

describe('Descúbrete editorial composition', () => {
  it('maps every quiz phase to a canonical editorial slot', () => {
    expect(DISCOVER_MEDIA_SLOTS).toEqual({
      intro: 'discover.hero',
      questions: 'discover.question-atmosphere',
      tuning: 'discover.tuning',
      result: 'discover.result',
    });

    const media = {
      hero: resolveEditorialMedia('discover.hero', { alt: 'Hero' }),
      question: resolveEditorialMedia('discover.question-atmosphere', { alt: 'Question' }),
      tuning: resolveEditorialMedia('discover.tuning', { alt: 'Tuning' }),
      result: resolveEditorialMedia('discover.result', { alt: 'Result' }),
    };

    const phaseMedia = {
      intro: media.hero,
      questions: media.question,
      tuning: media.tuning,
      result: media.result,
    };

    for (const phase of Object.keys(DISCOVER_MEDIA_SLOTS) as Array<keyof typeof phaseMedia>) {
      const selected = selectDiscoverMedia(phase, media);
      const slot = DISCOVER_MEDIA_SLOTS[phase];

      // La única fuente legítima es la publicada en el manifiesto; nada se inventa.
      const published = EDITORIAL_ASSETS[slot];

      expect(selected).toBe(phaseMedia[phase]);
      expect(selected.kind).toBe(published ? 'photo' : 'fallback');
      expect(selected.src).toBe(published);
      expect(selected.slot).toBe(slot);
      expect(EDITORIAL_MEDIA_REGISTRY[slot]).toBeDefined();
    }
  });

  it('keeps phase media localized and resolved before entering the client flow', () => {
    const esAlt = esMessages.discover.media.alt;
    const enAlt = enMessages.discover.media.alt;

    expect(Object.keys(esAlt)).toEqual(Object.keys(enAlt));
    for (const key of Object.keys(esAlt) as Array<keyof typeof esAlt>) {
      expect(esAlt[key]).not.toBe(enAlt[key]);
    }

    expect(pageSource).toContain("resolveEditorialMedia('discover.hero'");
    expect(pageSource).toContain("resolveEditorialMedia('discover.question-atmosphere'");
    expect(pageSource).toContain("resolveEditorialMedia('discover.tuning'");
    expect(pageSource).toContain("resolveEditorialMedia('discover.result'");
    expect(pageSource).toContain("sizes: '100vw'");
    expect(pageSource).toContain('<QuizContainer catalog={catalog} media={discoverMedia}');
  });

  it('uses a full-bleed phase field and quiet non-card question controls', () => {
    expect(layoutSource).toContain('<FullBleedSection');
    expect(layoutSource).toContain('data-editorial-phase={phase}');
    expect(containerSource).toContain('selectDiscoverMedia(quiz.step, media)');
    expect(fullBleedSource).toContain('aspect={media.aspect}');
    expect(layoutSource).toContain('reserveBottomUi');
    expect(layoutSource).toContain("phase !== 'result'");
    expect(stepSource).not.toContain('bg-glass');
    expect(stepSource).not.toContain('backdrop-blur');
    expect(stepSource).toContain('min-h-11');
    expect(stepSource).toContain('focus-visible:ring-gold');
    expect(stepSource).toContain('text-body');
    expect(resultSource).toContain('text-body');
  });

  it('opens the resolved audio while preserving the localized resonario link', () => {
    expect(containerSource).toContain('open(result.audio.id)');
    expect(resultSource).toContain('onListen');
    expect(resultSource).toContain('asChild onClick={onListen}');
    expect(resultSource).toContain('href="/resonario"');
  });
  it('anchors the result at its slot ratio and keeps the question atmosphere as the one backdrop', () => {
    // El resultado crece con su texto: la foto se pinta a su 16:9, anclada, no estirada.
    expect(layoutSource).toContain("if (phase === 'result') return 'anchored'");
    // La atmósfera de pregunta es la excepción `backdrop` del contrato: fondo completo,
    // con `sizes` por alto, porque cubre la pantalla por encima de su 3:4.
    expect(EDITORIAL_MEDIA_REGISTRY['discover.question-atmosphere'].backdrop).toBe(true);
    expect(layoutSource).toContain("phase === 'questions' || phase === 'tuning'");
    expect(layoutSource).toContain("? mediaSizes('viewport', media.aspect)");
  });
  it('softens the layer behind the questions: one light treatment, a quieter halo', () => {
    // Ni el velo direccional doble ni un halo intenso sobre la aurora de la foto.
    expect(layoutSource).toContain("tint={phase === 'questions' ? 'mobile' : true}");
    expect(fullBleedSource).toContain(
      "overlayClassName={tint === 'mobile' ? 'md:hidden' : undefined}",
    );
    expect(fullBleedSource).toContain('overlay={tint ? overlayDirection : false}');
    expect(fullBleedSource).toContain('scrim={overlayDirection}');
    expect(layoutSource).toContain("phase === 'questions' ? 'opacity-20'");
  });

  it('paces the questions calmly and keeps the leaving step inert', () => {
    const swapSource = readFileSync(resolve(SOURCE_ROOT, 'components/ui/swap.tsx'), 'utf8');

    expect(containerSource).toContain('pace="calm"');
    expect(swapSource).toContain('SWAP_PACE[pace]');
    expect(swapSource).toContain('inert={!present}');
    expect(swapSource).toContain('useReducedMotion');
  });

  it('reveals the result through the portal iris without navigating', () => {
    const hookSource = readFileSync(resolve(SOURCE_ROOT, 'hooks/use-portal-reveal.ts'), 'utf8');

    expect(containerSource).toContain('usePortalReveal()');
    expect(containerSource).toContain('cover(finishTune)');
    expect(containerSource).toContain('if (showingResult) arrive();');
    expect(containerSource).toContain('onFinish={revealResult}');
    // Mismo iris, sin ruta, sin audio ambiental y sin el reposo del portal.
    expect(hookSource).toContain("portal.cross(mode, 'reveal')");
    expect(hookSource).toContain('portalModeFor(reduced, false)');
    expect(hookSource).toContain('clearTimeout');
    expect(hookSource).not.toMatch(/useRouter|useAmbientStore|markPortalCrossed/);
  });
});
