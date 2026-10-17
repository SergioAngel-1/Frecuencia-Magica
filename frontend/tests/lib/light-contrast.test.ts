import { describe, expect, it } from 'vitest';

import { readSource, SRC } from '../helpers/source-files';

/**
 * Contraste del texto que cae sobre foto en esquema claro. Lee los valores que
 * declaran `tokens.css` (tinta `--color-fg` y velo `--scrim` de cada atmósfera
 * clara) y `globals.css` (píldora de la esfera, velo del banner) y calcula el
 * peor caso: la tinta sobre el velo con la foto más oscura debajo; el marfil de
 * la cifra sobre la píldora con la portada más pálida (blanca) debajo.
 */
const TOKENS = readSource(`${SRC}/app/tokens.css`);
const GLOBALS = readSource(`${SRC}/app/globals.css`);
const LIGHT = ['dawn', 'study', 'store', 'marisol'] as const;
const IVORY: [number, number, number] = [247, 244, 234];
const MIN = 4.5;

function blockOf(id: string): string {
  const start = TOKENS.indexOf(`[data-atmosphere='${id}'] {`);
  expect(start, id).toBeGreaterThan(-1);
  return TOKENS.slice(start, TOKENS.indexOf('}', start));
}

function rgbOf(block: string, name: string): [number, number, number] {
  const m = block.match(new RegExp(`--${name}: (\\d+) (\\d+) (\\d+);`));
  expect(m, name).not.toBeNull();
  return [Number(m![1]), Number(m![2]), Number(m![3])];
}

/** Hex de `--color-fg` (#rrggbb) del bloque. */
function hexOf(block: string, name: string): [number, number, number] {
  const m = block.match(new RegExp(`--${name}: #([0-9a-f]{6});`, 'i'));
  expect(m, name).not.toBeNull();
  const v = m![1]!;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

function lin(c: number): number {
  const x = c / 255;
  return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]: [number, number, number]): number {
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: [number, number, number], b: [number, number, number]): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Color `fg` con alfa `a` sobre `bg` opaco. */
function over(fg: [number, number, number], a: number, bg: [number, number, number]) {
  return fg.map((c, i) => c * a + bg[i]! * (1 - a)) as [number, number, number];
}

describe('light-scheme contrast on photos', () => {
  it.each(LIGHT)('%s: ink text on the light veil over the darkest photo reaches 4.5:1', (id) => {
    const block = blockOf(id);
    const ink = hexOf(block, 'color-fg');
    const scrim = rgbOf(block, 'scrim');
    // El velo más denso del banner (`.fm-banner-veil`) es 0,6; la foto más oscura es negra.
    const veil = over(scrim, 0.6, [0, 0, 0]);

    expect(contrast(ink, veil), id).toBeGreaterThanOrEqual(MIN);
  });

  it('the veil alpha in globals.css is the one measured here', () => {
    const rule = GLOBALS.slice(GLOBALS.indexOf("[data-scheme='light'] .fm-banner-veil"));
    expect(rule).toContain('rgb(var(--scrim) / 0.6)');
  });

  it.each(LIGHT)('%s: ivory disc number on the ink pill over a white cover reaches 4.5:1', (id) => {
    const block = blockOf(id);
    const ink = hexOf(block, 'color-fg');
    const pct = GLOBALS.match(
      /\.fm-disc-face \{\s*background-color: color-mix\(in srgb, var\(--color-fg\) (\d+)%/,
    );
    expect(pct, 'pill rule').not.toBeNull();
    const alpha = Number(pct![1]) / 100;
    // Peor caso: la píldora sobre la portada blanca.
    const pill = over(ink, alpha, [255, 255, 255]);

    expect(contrast(IVORY, pill), id).toBeGreaterThanOrEqual(MIN);
  });

  it('the unit at 80% opacity still reaches 4.5:1 over the pill', () => {
    const ink = hexOf(blockOf('dawn'), 'color-fg');
    const pill = over(ink, 0.72, [255, 255, 255]);
    const unit = over(IVORY, 0.8, pill);

    expect(contrast(unit, pill)).toBeGreaterThanOrEqual(MIN);
  });
});

/**
 * El velo de la noche: en un banner con foto, el texto de la etiqueta, el título
 * y el cuerpo quedan sobre el velo en esquema oscuro. Sin él (`display: none`)
 * la etiqueta cae sobre la luz de la foto.
 */
describe('banner veil in the night scheme', () => {
  it('the base veil is shown: it is not hidden by display none', () => {
    const base = GLOBALS.slice(GLOBALS.indexOf('.fm-banner-veil {'));
    const rule = base.slice(0, base.indexOf('}'));

    expect(rule).not.toContain('display: none');
    expect(rule).toContain('linear-gradient(');
  });

  it('the night veil is dense (0.8) where the eyebrow sits, 0.6 at its edges, and fades out', () => {
    // La etiqueta cae entre el 21 % y el 40 % de la altura del banner (kicker de
    // melodías: 3,97:1 con el velo a 0,6; con 0,8 en esa franja pasa de 4,5:1).
    const base = GLOBALS.slice(GLOBALS.indexOf('.fm-banner-veil {'));
    const rule = base.slice(0, base.indexOf('}'));

    expect(rule).toContain('rgb(var(--scrim) / 0.8) 18%');
    expect(rule).toContain('rgb(var(--scrim) / 0.8) 42%');
    expect(rule).toContain('rgb(var(--scrim) / 0.6) 70%');
    expect(rule).toContain('transparent 100%');
  });

  it('the light veil block is left as it was (0.6)', () => {
    const rule = GLOBALS.slice(GLOBALS.indexOf("[data-scheme='light'] .fm-banner-veil"));
    expect(rule.slice(0, rule.indexOf('}'))).toContain('rgb(var(--scrim) / 0.6)');
    expect(rule.slice(0, rule.indexOf('}'))).toContain('display: block');
  });
});
