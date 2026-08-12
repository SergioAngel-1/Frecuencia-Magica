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
    expect(portalSource).toContain("resolveEditorialMedia('portal.hero')");
    expect(portalSource).toContain("resolveEditorialMedia('portal.portal-field')");
    expect(portalSource).toContain('<FullBleedSection');
    expect(portalSource).toContain('<EditorialImage');
  });

  it('gives both 404 surfaces the not-found fallback and keeps human-facing semantics', () => {
    for (const source of [rootNotFoundSource, localizedNotFoundSource]) {
      expect(source).toContain("resolveEditorialMedia('not-found.hero')");
      expect(source).toContain('<FullBleedSection');
      expect(source).not.toContain('data-media-slot="not-found.hero"');
    }

    expect(rootNotFoundSource).not.toMatch(/Georgia|Arial/);
    expect(localizedNotFoundSource).toContain("getTranslations('states')");
    expect(localizedNotFoundSource).toContain("from '@/lib/editorial/asset-registry'");
  });
});

export {};
