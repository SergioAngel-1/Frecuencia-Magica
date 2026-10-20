import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { readTokensCss, stripComments } from '../helpers/css-tokens';

/**
 * Guarda de color semántico en el CSS global (ambientes v2, DESIGN.md § Atmósferas).
 *
 * Fuera de los bloques de tema (`@theme`, `:root` y `[data-atmosphere]`), el texto,
 * los bordes, el foco, la selección y las superficies de contenido deben leer los
 * semánticos (`--color-fg`, `--color-accent`, `--color-surface`…), que cambian con
 * la atmósfera. Una variable de la paleta cruda (`var(--color-gold)`) o un hex de
 * la paleta se quedan fijos en la noche. `semantic-color-usage.test.ts` hace lo
 * mismo para el TSX; este test cubre `tokens.css` y `globals.css`.
 *
 * `ALLOWED` lista cada regla que hoy usa la paleta cruda, por archivo y selector,
 * con su motivo. Sólo puede reducirse: una regla que deja de incumplir sale de la
 * lista, y una nueva que incumpla falla.
 */

const GLOBALS_CSS_PATH = resolve(process.cwd(), 'src/app/globals.css');

/** Variables de la paleta que no son semánticas. */
const PALETTE_VAR = /var\(--color-(?:glass-brd|glass|void-2|void|ivory|gold|teal|lav|ink)\)/g;

/** Hex de la paleta cerrada (y la tinta). Los de `:root` y los bloques de atmósfera no cuentan. */
const PALETTE_HEX = /#(?:0f1b2e|0a1220|d8b978|96c6bc|b9b0d6|f7f4ea|c98b7a|16273f|12213a)\b/gi;

/** Bloques que definen los tokens: ahí la paleta es la fuente, no un uso. */
const THEME_RULE = /^(?:@theme|:root|\[data-atmosphere=)/;

/** Reglas más internas (`selector { cuerpo }`): los `@media` y `@layer` se recorren solos. */
const RULE = /([^{}]+)\{([^{}]*)\}/g;

export type RawColorHit = { selector: string; match: string };

/** Reglas fuera de los bloques de tema que usan la paleta cruda. */
export function findRawCssColor(css: string): RawColorHit[] {
  const hits: RawColorHit[] = [];

  for (const [, rawSelector = '', body = ''] of stripComments(css).matchAll(RULE)) {
    const selector = rawSelector.replace(/\s+/g, ' ').trim();
    if (THEME_RULE.test(selector)) continue;

    for (const match of [...body.matchAll(PALETTE_VAR), ...body.matchAll(PALETTE_HEX)]) {
      hits.push({ selector, match: match[0] });
    }
  }

  return hits;
}

/** Excepciones con dueño: `archivo :: selector` -> motivo. */
const ALLOWED: Record<string, string> = {
  // Zebra: materia estructural oscura por contrato (texto encima), no es superficie de contenido.
  'tokens.css :: @utility fm-editorial-zebra':
    'materia zebra del fallback editorial: oscura por contrato, texto encima (no se re-tematiza)',
};

describe('semantic color in global CSS', () => {
  it('detects palette variables and palette hex outside the theme blocks', () => {
    const css = `
      @theme { --color-gold: #d8b978; }
      :root { --fm-night: #16273f; }
      [data-atmosphere='dawn'] { --color-fg: #0f1b2e; }
      body { color: var(--color-ivory); }
      a { border-color: #96c6bc; }
    `;

    expect(findRawCssColor(css)).toEqual([
      { selector: 'body', match: 'var(--color-ivory)' },
      { selector: 'a', match: '#96c6bc' },
    ]);
  });

  it('ignores semantic tokens, the rgba decorations and comments', () => {
    const css = `
      /* var(--color-gold) en un comentario */
      a { color: var(--color-accent); }
      .x { background: color-mix(in srgb, var(--color-accent) 30%, transparent); }
      .y { border-color: rgba(216, 185, 120, 0.25); background: var(--color-surface); }
    `;

    expect(findRawCssColor(css)).toEqual([]);
  });

  it('lists every rule that breaks the rule, and only those', () => {
    const found = new Map<string, string[]>();

    for (const [file, css] of [
      ['tokens.css', readTokensCss()],
      ['globals.css', readFileSync(GLOBALS_CSS_PATH, 'utf8')],
    ] as const) {
      for (const { selector, match } of findRawCssColor(css)) {
        const key = `${file} :: ${selector}`;
        found.set(key, [...(found.get(key) ?? []), match]);
      }
    }

    const unlisted = [...found]
      .filter(([key]) => !(key in ALLOWED))
      .map(([key, hits]) => `${key} (${hits.join(', ')})`);
    const stale = Object.keys(ALLOWED).filter((key) => !found.has(key));

    expect(unlisted, 'reglas con paleta cruda que no están en ALLOWED').toEqual([]);
    expect(stale, 'entradas de ALLOWED que ya no incumplen: quítalas').toEqual([]);
  });

  it('gives every exception a reason', () => {
    const empty = Object.entries(ALLOWED)
      .filter(([, reason]) => reason.trim().length < 4)
      .map(([key]) => key);

    expect(empty).toEqual([]);
  });
});
