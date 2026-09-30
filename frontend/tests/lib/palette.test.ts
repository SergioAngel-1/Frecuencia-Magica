import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const SRC = resolve(process.cwd(), 'src');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) return sourceFiles(path);

    return /\.(ts|tsx)$/.test(path) ? [path] : [];
  });
}

/** La paleta cerrada de AGENTS.md (más el punto claro del gradiente de fondo). */
const PALETTE = new Set([
  '#0f1b2e', // --void
  '#0a1220', // --void-2
  '#d8b978', // --gold
  '#96c6bc', // --teal
  '#b9b0d6', // --lav
  '#f7f4ea', // --ivory
  '#c98b7a', // --warn
  '#16273f', // punto más claro del gradiente de fondo
]);

/** Excepciones con dueño: archivo -> hex permitidos y por qué. */
const FILE_EXCEPTIONS: Record<string, string[]> = {
  // Los nueve tintes de portada viven aquí, con nombre (ver DESIGN.md).
  'config/covers.ts': [
    '#3a5a6e',
    '#1a2c44',
    '#4a7d8a',
    '#1c2f36',
    '#6e5f8a',
    '#241f3a',
    '#6a5a8c',
    '#221d38',
    '#3f4a72',
    '#1b2138',
    '#4f6b5e',
    '#1e2e28',
    '#5a6b52',
    '#20281c',
    '#8a7150',
    '#2c2418',
    '#a07840',
    '#2c2012',
  ],
  // Reflejo de oro claro en el centro del cruce del portal.
  'components/world/portal-transition.tsx': ['#e8d199'],
};

describe('closed palette', () => {
  it('keeps every hex literal in source inside the palette or a documented exception', () => {
    const offenders: string[] = [];

    for (const file of sourceFiles(SRC)) {
      const name = relative(SRC, file).replaceAll('\\', '/');
      const allowed = new Set([...PALETTE, ...(FILE_EXCEPTIONS[name] ?? [])]);
      const hexes = readFileSync(file, 'utf8').match(/#[0-9a-fA-F]{6}\b/g) ?? [];

      for (const hex of hexes) {
        if (!allowed.has(hex.toLowerCase())) offenders.push(`${name}: ${hex}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('keeps the cover tints out of the data layer', () => {
    for (const file of ['audios', 'courses', 'experiences', 'products']) {
      const source = readFileSync(join(SRC, 'data', `${file}.ts`), 'utf8');

      expect(source, file).not.toMatch(/#[0-9a-fA-F]{6}/);
      expect(source, file).toContain('COVERS.');
    }
  });
});
