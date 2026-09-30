import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { EDITORIAL_MEDIA_REGISTRY } from '@/config/editorial-media';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

const SOURCE_ROOT = resolve(process.cwd(), 'src');
const portalSource = readFileSync(
  resolve(SOURCE_ROOT, 'components/features/portal/portal-scene.tsx'),
  'utf8',
);
const rootNotFoundSource = readFileSync(resolve(SOURCE_ROOT, 'app/not-found.tsx'), 'utf8');
const localizedNotFoundSource = readFileSync(
  resolve(SOURCE_ROOT, 'app/[locale]/not-found.tsx'),
  'utf8',
);

const FALLBACK_SLOTS = ['portal.hero', 'portal.portal-field', 'not-found.hero'] as const;

describe('portal editorial threshold contracts', () => {
  it('resolves every threshold slot to a named zebra fallback without inventing a source', () => {
    for (const slot of FALLBACK_SLOTS) {
      const media = resolveEditorialMedia(slot, {
        alt: EDITORIAL_MEDIA_REGISTRY[slot].alt,
      });

      expect(media).toMatchObject({
        alt: EDITORIAL_MEDIA_REGISTRY[slot].alt,
        kind: 'fallback',
        slot,
      });
      expect(media.src).toBeUndefined();
    }
  });

  it('wires both portal layers through the shared full-bleed editorial primitive', () => {
    // El alt llega traducido por props (`portal.media.alt.*`), nunca del respaldo en español.
    expect(portalSource).toContain("resolveEditorialMedia('portal.hero', { alt: heroAlt })");
    expect(portalSource).toContain(
      "resolveEditorialMedia('portal.portal-field', { alt: fieldAlt })",
    );
    expect(portalSource).toContain('<FullBleedSection');
    expect(portalSource).toContain('<EditorialImage');
  });

  it('keeps both portal ring layers responsive inside the centered wrapper', () => {
    const ringInstances = portalSource
      .split('<OrbitalRings')
      .slice(1)
      .map((instance) => instance.slice(0, instance.indexOf('</OrbitalRings>')));

    expect(ringInstances).toHaveLength(2);
    for (const instance of ringInstances) {
      expect(instance).toContain("style={{ width: '100%', height: '100%' }}");
    }
  });

  it('gives both 404 surfaces the not-found fallback and keeps human-facing semantics', () => {
    for (const source of [rootNotFoundSource, localizedNotFoundSource]) {
      expect(source).toContain("resolveEditorialMedia('not-found.hero'");
      expect(source).toContain('<FullBleedSection');
      expect(source).not.toContain('data-media-slot="not-found.hero"');
    }

    // El 404 localizado traduce el alt; el raíz es estático en español (`lang="es"`).
    expect(localizedNotFoundSource).toContain("t('media.alt.notFound')");

    expect(rootNotFoundSource).not.toMatch(/Georgia|Arial/);
    expect(localizedNotFoundSource).toContain("getTranslations('states')");
    expect(localizedNotFoundSource).toContain("from '@/lib/editorial/asset-registry'");
  });
});

export {};
