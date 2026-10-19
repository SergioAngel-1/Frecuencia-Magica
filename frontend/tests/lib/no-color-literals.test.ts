import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Guarda de color literal (auditoría 2026-10). Además del hex que vigila
 * `palette.test.ts`, ningún archivo de `src/` puede pintar con un literal
 * numérico: `rgb()`/`rgba()` con argumentos, `hsl()`/`hsla()` o un triplete
 * `'R,G,B'`. El color sale siempre de un token de `tokens.css`
 * (`rgb(var(--halo) / a)`, `color-mix(...)`, `text-fg`…), que sigue el tema.
 *
 * `ALLOWED` lista las fuentes donde los números SON el color: el canvas pinta
 * píxeles y las tablas de tema, portada y acento se serializan tal cual.
 */

/** Fuentes con valores numéricos de color legítimos, cada una con su motivo. */
const ALLOWED: Record<string, string> = {
  'config/atmospheres.ts': 'theme-color de cada tema: meta del navegador',
  'config/covers.ts': 'tintes de portada con nombre (ver DESIGN.md)',
  'config/realms.ts': 'acento de cada realm: lo consume el canvas cósmico',
  'lib/cosmic/colors.ts': 'el canvas cósmico pinta con números',
  'lib/cosmic/themes.ts': 'escena de cada tema del canvas, con números',
  'lib/cosmic/scene.ts': 'render del canvas, con números',
};

/** `rgb(...)`/`rgba(...)` con argumento numérico. `rgb(var(--x) …)` NO casa. */
const RGB_CALL = /(?:rgb|rgba)\(\s*[-+.\d]/;
/** `hsl(...)`/`hsla(...)`: siempre con grados o porcentajes. */
const HSL_CALL = /(?:hsl|hsla)\(/;
/** Triplete RGB entrecomillado: `'216,185,120'`. */
const RGB_TRIPLET = /(['"`])\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\1/;

/** Hallazgos de una fuente: `L<línea>: <texto>`. Vacío si cumple. */
export function findColorLiterals(source: string): string[] {
  const hits: string[] = [];

  source.split('\n').forEach((line, index) => {
    if (RGB_CALL.test(line) || HSL_CALL.test(line) || RGB_TRIPLET.test(line)) {
      hits.push(`L${index + 1}: ${line.trim().slice(0, 80)}`);
    }
  });

  return hits;
}

describe('no color literals', () => {
  it('detects numeric rgb/hsl calls and quoted rgb triplets', () => {
    expect(findColorLiterals("stroke: 'rgba(216,185,120,0.4)'")).toHaveLength(1);
    expect(findColorLiterals("background: 'rgb(247 244 234 / 0.82)'")).toHaveLength(1);
    expect(findColorLiterals("shadow: 'hsl(220 40% 10%)'")).toHaveLength(1);
    expect(findColorLiterals("const rgb = '185,176,214';")).toHaveLength(1);
  });

  it('ignores token-based colors', () => {
    const clean = [
      "stroke: 'rgb(var(--halo) / 0.4)'",
      "background: 'color-mix(in srgb, var(--color-accent-2) 40%, transparent)'",
      'className="text-fg bg-scrim/60 border-line-strong"',
      "background: 'radial-gradient(circle, var(--color-fg) 20%, transparent)'",
      "boxShadow: '0 0 24px color-mix(in srgb, var(--color-accent-3) 25%, transparent)'",
    ].join('\n');

    expect(findColorLiterals(clean)).toEqual([]);
  });

  it('finds no color literal outside the allowed sources', () => {
    const offenders: string[] = [];

    for (const file of sourceFiles(SRC)) {
      const name = fromSrc(file);
      if (name in ALLOWED) continue;

      for (const hit of findColorLiterals(readSource(file))) {
        offenders.push(`${name} ${hit}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('gives every allowed source a reason', () => {
    const empty = Object.entries(ALLOWED)
      .filter(([, reason]) => reason.trim().length < 4)
      .map(([file]) => file);

    expect(empty).toEqual([]);
  });
});
