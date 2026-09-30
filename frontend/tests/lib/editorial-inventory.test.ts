import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { EDITORIAL_MEDIA_SLOTS } from '@/config/editorial-media';

const ROOT = process.cwd();
const SRC = resolve(ROOT, 'src');
const README = readFileSync(resolve(ROOT, 'public/editorial/README.md'), 'utf8');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) return sourceFiles(path);

    return /\.(ts|tsx)$/.test(path) ? [path] : [];
  });
}

const SOURCE = sourceFiles(SRC)
  .map((file) => readFileSync(file, 'utf8'))
  .join('\n');

/** Fila del inventario por id: `| `slot` | … | Estado |`. */
function inventoryRow(slot: string): string | undefined {
  return README.split('\n').find((line) => line.startsWith(`| \`${slot}\` |`));
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
