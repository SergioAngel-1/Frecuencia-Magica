import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** `tokens.css` de la web, resuelto desde `frontend/` (Vitest corre ahí). */
export const TOKENS_CSS_PATH = resolve(process.cwd(), 'src/app/tokens.css');

/**
 * Tokens que cada bloque `[data-atmosphere='<id>']` redefine (DESIGN.md § Atmósferas).
 * Los `--color-*` son utilidades de Tailwind (`text-accent`, `bg-surface`…); el
 * resto son variables planas (tripletes RGB y gradientes).
 */
export const ATMOSPHERE_TOKENS = [
  '--color-fg',
  '--color-fg-body',
  '--color-fg-soft',
  '--color-fg-muted',
  '--color-fg-meta',
  '--color-accent',
  '--color-accent-2',
  '--color-accent-3',
  '--color-line',
  '--color-line-strong',
  '--color-surface',
  '--color-surface-strong',
  '--color-on-accent',
  '--scrim',
  '--scrim-deep',
  '--halo',
  '--color-scrim',
  '--color-scrim-deep',
  '--color-halo',
  '--nebula-a',
  '--nebula-b',
  '--nebula-c',
  '--atmo-bg',
  '--atmo-backdrop',
] as const;

export function readTokensCss(): string {
  return readFileSync(TOKENS_CSS_PATH, 'utf8');
}

/** Quita los comentarios `/* ... *\/`. */
export function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Declaraciones de todas las reglas cuyo selector es exactamente `selector`
 * (`@theme`, `:root`, `[data-atmosphere='night']`…). Si hay varias, gana la última,
 * como en CSS. Los valores llegan sin saltos de línea y con espacios colapsados.
 */
export function ruleDeclarations(css: string, selector: string): Record<string, string> {
  const pattern = new RegExp(`(?:^|[\\s},])${escapeRegExp(selector)}\\s*\\{([^}]*)\\}`, 'g');
  const declarations: Record<string, string> = {};

  for (const match of stripComments(css).matchAll(pattern)) {
    for (const part of match[1]!.split(';')) {
      const colon = part.indexOf(':');
      if (colon === -1) continue;

      const name = part.slice(0, colon).trim();
      if (!name.startsWith('--')) continue;

      declarations[name] = part
        .slice(colon + 1)
        .trim()
        .replace(/\s+/g, ' ');
    }
  }

  return declarations;
}

/** Sustituye cada `var(--x)` por su valor, recursivamente. Falla si un token no tiene valor. */
export function resolveVar(
  value: string,
  lookup: (name: string) => string | undefined,
  depth = 0,
): string {
  if (depth > 10) throw new Error(`var() demasiado anidado: ${value}`);

  return value.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, name: string) => {
    const resolved = lookup(name);
    if (resolved === undefined) throw new Error(`token sin valor: ${name}`);

    return resolveVar(resolved, lookup, depth + 1);
  });
}

/**
 * Valores resueltos de los tokens que declara el bloque `selector`. Un `var()`
 * se resuelve primero dentro del mismo bloque, luego en `@theme` y luego en `:root`.
 */
export function resolvedTokens(css: string, selector: string): Record<string, string> {
  const block = ruleDeclarations(css, selector);
  const theme = ruleDeclarations(css, '@theme');
  const root = ruleDeclarations(css, ':root');
  const lookup = (name: string) => block[name] ?? theme[name] ?? root[name];

  return Object.fromEntries(
    Object.keys(block).map((name) => [name, resolveVar(block[name]!, lookup)]),
  );
}

/* ---------------------------------------------------------------------------
   Color y WCAG 2.x. Sólo lo necesario para medir los pares de la atmósfera.
   ------------------------------------------------------------------------- */

export type RGB = { r: number; g: number; b: number };
export type RGBA = RGB & { a: number };

/** Acepta `#rrggbb`, `rgb(r g b / a)` y `rgba(r, g, b, a)`. */
export function parseColor(value: string): RGBA {
  const text = value.trim().toLowerCase();

  const hex = /^#([0-9a-f]{6})$/.exec(text);
  if (hex) {
    const n = parseInt(hex[1]!, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }

  const fn = /^rgba?\((.*)\)$/.exec(text);
  if (fn) {
    const [r, g, b, a = '1'] = fn[1]!.split(/[\s,/]+/).filter(Boolean);
    return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) };
  }

  throw new Error(`color no soportado: ${value}`);
}

/** Triplete RGB sin función (`15 27 46`), como lo guardan `--scrim` y `--halo`. */
export function parseTriplet(value: string): RGB {
  const [r, g, b] = value.trim().split(/\s+/).map(Number);
  if ([r, g, b].some((channel) => !Number.isInteger(channel) || channel! < 0 || channel! > 255)) {
    throw new Error(`triplete RGB no válido: ${value}`);
  }

  return { r: r!, g: g!, b: b! };
}

/** Paradas de color de un gradiente, en el orden en que aparecen. */
export function gradientStops(gradient: string): RGBA[] {
  const matches = gradient.match(/#[0-9a-fA-F]{6}\b|rgba?\([^)]*\)/g) ?? [];
  return matches.map(parseColor);
}

function channel(value: number): number {
  const s = value / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** Luminancia relativa (WCAG 2.x). */
export function luminance({ r, g, b }: RGB): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Razón de contraste (WCAG 2.x), siempre >= 1. */
export function contrast(a: RGB, b: RGB): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

/** Compone un color con alfa sobre otro opaco (`over`, sRGB). */
export function over(top: RGBA, below: RGB): RGB {
  return {
    r: top.r * top.a + below.r * (1 - top.a),
    g: top.g * top.a + below.g * (1 - top.a),
    b: top.b * top.a + below.b * (1 - top.a),
  };
}

export function brightest(colors: RGB[]): RGB {
  return colors.reduce((a, b) => (luminance(b) > luminance(a) ? b : a));
}

export function darkest(colors: RGB[]): RGB {
  return colors.reduce((a, b) => (luminance(b) < luminance(a) ? b : a));
}
