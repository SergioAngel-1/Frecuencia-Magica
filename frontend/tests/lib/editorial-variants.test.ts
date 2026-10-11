import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import { EDITORIAL_ASSET_WIDTHS, EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';

const PUBLIC = resolve(process.cwd(), 'public');
const variantPath = (src: string, width: number) =>
  resolve(PUBLIC, `.${src.replace(/\.avif$/, `-${width}.avif`)}`);

describe('editorial width variants', () => {
  it('declares the widths of every published source, ascending', () => {
    for (const src of new Set(Object.values(EDITORIAL_ASSETS))) {
      const widths = EDITORIAL_ASSET_WIDTHS[src];

      expect(widths, src).toBeDefined();
      expect(widths!.length, src).toBeGreaterThan(0);
      expect(
        [...widths!].sort((a, b) => a - b),
        src,
      ).toEqual(widths);
      expect(new Set(widths).size, src).toBe(widths!.length);
    }
  });

  it('declares no widths for a source that is not published', () => {
    const published = new Set(Object.values(EDITORIAL_ASSETS));
    for (const src of Object.keys(EDITORIAL_ASSET_WIDTHS)) expect(published, src).toContain(src);
  });

  it('publishes every declared variant on disk, never wider than its source', async () => {
    for (const [src, widths] of Object.entries(EDITORIAL_ASSET_WIDTHS)) {
      const largest = widths[widths.length - 1]!;
      // El archivo sin sufijo es la variante mayor: su ancho es el de la fuente ingerida.
      const { width: sourceWidth } = await sharp(resolve(PUBLIC, `.${src}`)).metadata();
      expect(sourceWidth, src).toBe(largest);

      for (const width of widths) {
        const path = variantPath(src, width);
        expect(existsSync(path), path).toBe(true);
        expect(width, src).toBeLessThanOrEqual(sourceWidth!);
        const { width: actual } = await sharp(path).metadata();
        expect(actual, path).toBe(width);
      }
    }
  });
});
