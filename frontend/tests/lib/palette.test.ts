import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { readTokensCss } from '../helpers/css-tokens';
import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

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
  // Color de la barra (`theme-color`) de cada tema.
  'config/atmospheres.ts': ['#331a3a', '#f0d6c3', '#0b1426', '#1e3328'],
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
};

/**
 * Hex de `tokens.css` fuera de los bloques `[data-atmosphere]`. La tinta
 * (`--color-ink`) es la neutral de DESIGN.md y se declara en `@theme`.
 */
const TOKENS_EXCEPTIONS = ['#12213a'];

/** Los valores de cada atmósfera viven en sus bloques `[data-atmosphere]`, y sólo ahí. */
const ATMOSPHERE_BLOCK = /\[data-atmosphere='[a-z-]+'\]\s*\{[^}]*\}/g;

describe('closed palette', () => {
  it('allows hex in tokens.css only inside the atmosphere blocks', () => {
    const outside = readTokensCss().replace(ATMOSPHERE_BLOCK, '');
    const allowed = new Set([...PALETTE, ...TOKENS_EXCEPTIONS]);
    const hexes = outside.match(/#[0-9a-fA-F]{6}\b/g) ?? [];

    expect(hexes.filter((hex) => !allowed.has(hex.toLowerCase()))).toEqual([]);
  });

  it('keeps every hex literal in source inside the palette or a documented exception', () => {
    const offenders: string[] = [];

    for (const file of sourceFiles(SRC)) {
      const name = fromSrc(file);
      const allowed = new Set([...PALETTE, ...(FILE_EXCEPTIONS[name] ?? [])]);
      const hexes = readSource(file).match(/#[0-9a-fA-F]{6}\b/g) ?? [];

      for (const hex of hexes) {
        if (!allowed.has(hex.toLowerCase())) offenders.push(`${name}: ${hex}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('keeps the cover tints out of the data layer', () => {
    for (const file of ['audios', 'courses', 'experiences', 'products']) {
      const source = readSource(join(SRC, 'data', `${file}.ts`));

      expect(source, file).not.toMatch(/#[0-9a-fA-F]{6}/);
      expect(source, file).toContain('COVERS.');
    }
  });
});
