import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
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

      expect(selected).toBe(phaseMedia[phase]);
      expect(selected.kind).toBe('fallback');
      expect(selected.src).toBeUndefined();
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
    expect(pageSource).toContain('<QuizContainer audios={AUDIOS} media={discoverMedia}');
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

  it('opens the resolved audio while preserving the localized library link', () => {
    expect(containerSource).toContain('open(resolvedAudio.id)');
    expect(resultSource).toContain('onListen');
    expect(resultSource).toContain('asChild onClick={onListen}');
    expect(resultSource).toContain('href="/biblioteca"');
  });
});
