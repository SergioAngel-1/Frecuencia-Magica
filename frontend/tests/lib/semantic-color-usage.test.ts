import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Guarda de uso de color semántico (ambientes v2, DESIGN.md § Atmósferas).
 *
 * El color del texto, los bordes, los fondos y los halos sale de los tokens
 * semánticos de `tokens.css` (`text-fg*`, `text-accent*`, `border-line*`,
 * `bg-surface*`, `rgb(var(--halo) / a)`…), que cambian con la atmósfera. Una
 * utilidad de paleta cruda (`text-gold`, `bg-void/70`…), una variable de la
 * paleta (`var(--color-gold)` en un valor arbitrario o un estilo inline) o un
 * `rgba()` con un triplete de la paleta se quedan fijos en la noche: el test
 * los detecta por archivo.
 *
 * `ALLOWED` lista los archivos que hoy incumplen, cada uno con su motivo. La
 * lista sólo puede reducirse: un archivo que deja de incumplir debe salir de
 * ella, y uno nuevo que incumpla falla. Quedan dos clases de motivo: los
 * decorativos permanentes (geometría, halos del world engine, isotipo, cursor,
 * portal, aros) y los velos `void-2`, que no tienen token equivalente.
 */

/**
 * Prefijos de utilidad que pintan color. `accent-<paleta>` sólo cuenta con un
 * color crudo detrás (`accent-gold`); `accent-2` y `accent-3` son tokens válidos.
 */
const PREFIXES = [
  'text',
  'bg',
  'border',
  'border-t',
  'border-b',
  'border-x',
  'border-y',
  'border-l',
  'border-r',
  'border-s',
  'border-e',
  'ring',
  'ring-offset',
  'inset-ring',
  'from',
  'via',
  'to',
  'divide',
  'divide-x',
  'divide-y',
  'shadow',
  'outline',
  'fill',
  'stroke',
  'decoration',
  'caret',
  'accent',
];

/** Colores de la paleta que no pueden aparecer como utilidad (`glass-brd` antes que `glass`). */
const COLORS = ['glass-brd', 'glass', 'void-2', 'void', 'ivory', 'gold', 'teal', 'lav', 'ink'];

/** Utilidad cruda, con variante delante (`hover:`, `md:`) y sufijo de opacidad (`/20`, `/[.4]`). */
const UTILITY = new RegExp(
  `(?<![\\w-])(?:${PREFIXES.join('|')})-(?:${COLORS.join('|')})(?![\\w-])(?:\\/[^\\s"'\`]*)?`,
  'g',
);

/** Tripletes RGB de la paleta: `rgba(216,185,120,…)` o `rgb(247 244 234 / …)`. Sin `warn`: no está en la lista de utilidades. */
const PALETTE_TRIPLES = new Set([
  '15 27 46', // void
  '10 18 32', // void-2
  '216 185 120', // gold (y glass-brd)
  '150 198 188', // teal
  '185 176 214', // lav
  '247 244 234', // ivory (y glass)
  '18 33 58', // ink
]);

const RGB_CALL = /rgba?\(\s*(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})(?=[\s,)/])/g;

/** Variable de la paleta: `var(--color-gold)` en un valor arbitrario o un estilo inline. */
const PALETTE_VAR = /var\(--color-(?:glass-brd|glass|void-2|void|ivory|gold|teal|lav|ink)\)/g;

/** Hallazgos de una fuente: `L<línea>: <texto>`. Vacío si cumple. */
export function findRawColorUse(source: string): string[] {
  const hits: string[] = [];

  source.split('\n').forEach((line, index) => {
    for (const match of line.matchAll(UTILITY)) {
      hits.push(`L${index + 1}: ${match[0]}`);
    }

    for (const match of line.matchAll(PALETTE_VAR)) {
      hits.push(`L${index + 1}: ${match[0]}`);
    }

    for (const match of line.matchAll(RGB_CALL)) {
      const triple = `${match[1]} ${match[2]} ${match[3]}`;
      if (PALETTE_TRIPLES.has(triple)) hits.push(`L${index + 1}: ${match[0]}`);
    }
  });

  return hits;
}

/** Excepciones con dueño: archivo (relativo a `src/`) -> motivo. */
const ALLOWED: Record<string, string> = {
  // Decorativos permanentes: halos, aros, geometría y brillos sin texto ni controles.
  // Su visibilidad en atmósferas claras la gobierna el perfil de engine (T0.7).
  'app/[locale]/not-found.tsx': 'geometría sagrada: anillos orbitales del 404 (decorativo)',
  'components/features/auth/auth-aside.tsx':
    'geometría sagrada y halo de la ilustración de acceso (decorativo)',
  'components/features/descubrete/quiz-layout.tsx':
    'geometría sagrada y halo del fondo del quiz (decorativo)',
  'components/features/home/about-section.tsx': 'halo decorativo sin texto ni controles',
  'components/features/home/hero-section.tsx':
    'geometría sagrada y halo del isotipo del héroe (decorativo)',
  'components/features/portal/portal-scene.tsx': 'portal: anillos y halo del cruce (decorativo)',
  'components/features/sanctuary/sanctuary-header.tsx': 'halo decorativo sin texto ni controles',
  'components/layout/brand-mark.tsx': 'halo del isotipo (decorativo)',
  'components/layout/talk-float.tsx': 'aura decorativa del botón de hablar (decorativo)',

  // Aros y halos decorativos con utilidad de paleta cruda que quedan: su visibilidad
  // en atmósferas claras la gobierna el perfil de engine (T0.7), no el tema.
  'components/ui/media-skeleton.tsx': 'aros y halo de luz de la zebra (decorativo)',
  'components/ui/editorial-banner.tsx': 'aro orbital decorativo de la banda (border-gold/25)',
  'components/features/experiences/experience-row.tsx': 'aros orbitales de la fila (decorativo)',
  'components/features/home/realm-card.tsx':
    'aros orbitales de la card (decorativo) y peldaño void-2 del fundido (sin token)',

  // Velos void-2 (#0a1220) que quedan. El modal y el diario ya leen `bg-scrim-deep` (en la noche
  // vale void-2, en una atmósfera clara es el velo claro). Los de abajo no cambian con la
  // atmósfera a propósito: el vídeo es un medio (su tinta es marfil sobre oscuro en todas), el
  // acceso es siempre noche y el degradado de la card cae sobre foto con texto `on-media`.
  'components/features/player/video-player.tsx':
    'fondo y velo void-2 del vídeo: superficie de medio, oscura en toda atmósfera (controles en marfil)',
};

describe('semantic color usage', () => {
  it('detects raw palette utilities and palette rgb triples', () => {
    expect(findRawColorUse('<p className="hover:text-gold/80 md:bg-void">')).toHaveLength(2);
    expect(findRawColorUse('stroke="rgba(216,185,120,0.4)"')).toHaveLength(1);
    expect(findRawColorUse('color: rgb(247 244 234 / 0.82)')).toHaveLength(1);
    expect(findRawColorUse("background: 'var(--color-gold)'")).toHaveLength(1);
    expect(
      findRawColorUse('bg-[linear-gradient(var(--color-teal),var(--color-lav))]'),
    ).toHaveLength(2);
  });

  it('detects the side, ring, caret and accent prefixes and the ink color', () => {
    expect(findRawColorUse('border-t-gold border-x-void/20')).toHaveLength(2);
    expect(findRawColorUse('ring-offset-void focus:ring-offset-ink')).toHaveLength(2);
    expect(findRawColorUse('caret-ivory accent-gold decoration-teal')).toHaveLength(3);
    expect(findRawColorUse('bg-ink text-ink')).toHaveLength(2);
  });

  it('ignores semantic tokens and non-palette colors', () => {
    const clean = [
      'text-accent bg-surface-strong border-line-strong text-fg shadow-glow-gold',
      'accent-2 accent-3 border-t-line ring-offset-scrim text-on-accent',
      'text-warn bg-gold-soft text-on-accent bg-ivory-ish',
      'rgb(var(--halo) / 0.4) rgba(200, 100, 50, 0.1)',
      'var(--color-accent) var(--color-surface) var(--color-scrim) var(--color-glass-x)',
    ].join('\n');

    expect(findRawColorUse(clean)).toEqual([]);
  });

  it('lists every file that breaks the rule, and only those', () => {
    const found = new Map<string, string[]>();

    for (const file of sourceFiles(SRC)) {
      const hits = findRawColorUse(readSource(file));
      if (hits.length > 0) found.set(fromSrc(file), hits);
    }

    const unlisted = [...found]
      .filter(([file]) => !(file in ALLOWED))
      .map(([file, hits]) => `${file} (${hits.length}): ${hits.slice(0, 3).join(' | ')}`);
    const stale = Object.keys(ALLOWED).filter((file) => !found.has(file));

    expect(unlisted, 'archivos con color crudo que no están en ALLOWED').toEqual([]);
    expect(stale, 'entradas de ALLOWED que ya no incumplen: quítalas').toEqual([]);
  });

  it('gives every exception a reason', () => {
    const empty = Object.entries(ALLOWED)
      .filter(([, reason]) => reason.trim().length < 4)
      .map(([file]) => file);

    expect(empty).toEqual([]);
  });
});
