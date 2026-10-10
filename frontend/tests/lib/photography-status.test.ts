import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { EDITORIAL_ASSETS } from '@/config/editorial-assets.generated';

import { expandAll } from '../../../Branding/src/data/photography.js';
import {
  COMPLETED,
  CORRECT,
  PENDING_NOTES,
  UNUSED,
  UNWIRED,
  statusOf,
} from '../../../Branding/src/data/photography-status.js';

const FILES: string[] = expandAll().map((row: { file: string }) => row.file);

/** Lo publicado de verdad: el manifiesto de slots y la imagen OG, que sirve el layout. */
const PUBLISHED = new Set<string>([
  ...Object.values(EDITORIAL_ASSETS).map((src) => src.split('/').pop()!),
  ...(existsSync(resolve(process.cwd(), 'public/editorial/og-image.jpg')) ? ['og-image.jpg'] : []),
]);

describe('photography status', () => {
  it('only names images that exist in the brief', () => {
    const named = [
      ...Object.keys(CORRECT),
      ...Object.keys(UNWIRED),
      ...Object.keys(UNUSED),
      ...Object.keys(PENDING_NOTES),
      ...COMPLETED,
    ] as string[];

    for (const file of named) expect(FILES, file).toContain(file);
  });

  it('puts every image in exactly one state', () => {
    const lists = [
      Object.keys(CORRECT),
      Object.keys(UNWIRED),
      Object.keys(UNUSED),
      COMPLETED as string[],
    ];
    const all = lists.flat();

    expect(new Set(all).size, 'an image is listed in two states').toBe(all.length);
  });

  it('marks as delivered exactly what is published', () => {
    for (const file of FILES) {
      const { state } = statusOf(file) as { state: string };
      const delivered = ['completada', 'corregir', 'sin-uso'].includes(state);

      expect(PUBLISHED.has(file), `${file} (${state})`).toBe(delivered);
    }
  });

  it('keeps the pending notes on images that are still missing', () => {
    for (const file of Object.keys(PENDING_NOTES)) {
      expect(statusOf(file).state, file).toBe('faltante');
    }
  });

  it('never publishes an image whose view is still to be created', () => {
    for (const file of Object.keys(UNWIRED)) expect(PUBLISHED.has(file), file).toBe(false);
  });
});
