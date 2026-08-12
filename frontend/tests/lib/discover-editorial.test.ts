import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import enMessages from '../../messages/en.json';
import esMessages from '../../messages/es.json';
import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

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

const EXPECTED_SLOTS = {
  intro: 'discover.hero',
  questions: 'discover.question-atmosphere',
  tuning: 'discover.tuning',
  result: 'discover.result',
} as const;

describe('Descúbrete editorial composition', () => {
  it('maps every quiz phase to a canonical editorial slot', () => {
    for (const [phase, slot] of Object.entries(EXPECTED_SLOTS)) {
      expect(layoutSource).toContain(`${phase}: '${slot}'`);
    }

    for (const slot of Object.values(EXPECTED_SLOTS)) {
      const media = resolveEditorialMedia(slot, {
        alt: `Editorial fallback for ${slot}`,
      });

      expect(media.kind).toBe('fallback');
      expect(media.src).toBeUndefined();
      expect(media.slot).toBe(slot);
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
    expect(pageSource).toContain('<QuizContainer audios={AUDIOS} media={discoverMedia}');
  });

  it('uses a full-bleed phase field and quiet non-card question controls', () => {
    expect(layoutSource).toContain('<FullBleedSection');
    expect(layoutSource).toContain('data-editorial-phase={phase}');
    expect(stepSource).not.toContain('bg-glass');
    expect(stepSource).toContain('min-h-11');
    expect(stepSource).toContain('focus-visible:ring-gold');
  });
});
