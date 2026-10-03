import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { EDITORIAL_MEDIA_SLOTS } from '@/config/editorial-media';

import { readSource, SRC, sourceFiles } from '../helpers/source-files';

const README = readSource(resolve(process.cwd(), 'public/editorial/README.md'));

const SOURCE = sourceFiles(SRC)
  .map((file) => readSource(file))
  .join('\n');

/** Fila del inventario por id: `| `slot` | … | Estado |`, con o sin relleno de columnas. */
function inventoryRow(slot: string): string | undefined {
  return README.split('\n').find((line) => line.replace(/\s+/g, ' ').startsWith(`| \`${slot}\` |`));
}

describe('editorial slot inventory', () => {
  it('has a row for every registered slot', () => {
    for (const slot of EDITORIAL_MEDIA_SLOTS) {
      expect(inventoryRow(slot), slot).toBeDefined();
    }
  });

  it('reports the real wiring status of each slot', () => {
    for (const slot of EDITORIAL_MEDIA_SLOTS) {
      const wired = SOURCE.includes(`resolveEditorialMedia('${slot}'`);
      const row = inventoryRow(slot) ?? '';

      if (wired) {
        expect(row, `${slot} is wired in code`).toContain('slot cableado');
        expect(row, `${slot} is wired in code`).not.toContain('sin cablear');
      } else {
        expect(row, `${slot} is not wired in code`).toContain('sin cablear');
      }
    }
  });
});
