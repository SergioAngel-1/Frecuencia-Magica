import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Tipo, medidas y ritmo de página se nombran en `tokens.css` (`text-serif-*`,
 * `text-label|meta|body|lead`, `max-w-measure-*`, `pt-hero`, `py-section`…).
 * Un valor suelto (`text-[18px]`, `max-w-[44ch]`, `pt-[clamp(…)]`) salta la
 * escala: no se ve en el sistema de diseño ni se ajusta desde un solo sitio.
 *
 * Los `text-[clamp(…)]` fluidos de `Display` y de los titulares de tarjeta no
 * se vigilan aquí: son tipos fluidos, no peldaños, y viven en el código de
 * cada componente.
 */
const FORBIDDEN: { name: string; pattern: RegExp; exceptions: boolean }[] = [
  { name: 'text-[<n>px]', pattern: /\btext-\[\d+(?:\.\d+)?px\]/, exceptions: false },
  { name: 'max-w-[<n>ch]', pattern: /\bmax-w-\[\d+(?:\.\d+)?ch\]/, exceptions: false },
  { name: 'pt|py|gap|mt-[clamp(', pattern: /\b(?:pt|py|gap|mt)-\[clamp\(/, exceptions: true },
];

/**
 * Excepciones por archivo, sólo para la regla de espaciado (`"ruta relativa a
 * src": "motivo"`). Son grids y
 * paddings fluidos de componente (la separación entre columnas o la respiración
 * interior de una tarjeta), no ritmo entre bloques: convertirlos a `section`
 * o `block` cambiaría la composición de cada vista. Pendiente de decidir si
 * merecen peldaño propio; cada entrada desaparece al migrarse.
 */
const EXCEPTIONS: Record<string, string> = {
  'components/features/about/about-story.tsx': 'gap fluido entre columnas de la historia',
  'components/features/academy/course-card.tsx': 'padding vertical fluido de la tarjeta',
  'components/features/academy/course-detail.tsx': 'gaps fluidos entre columnas del detalle',
  'components/features/experiences/booking-flow.tsx': 'padding vertical fluido del paso de reserva',
  'components/features/experiences/experience-row.tsx': 'padding vertical fluido de la fila',
  'components/features/home/about-section.tsx': 'gap y margen fluidos de la sección sobre Marisol',
  'components/features/home/daily-frequency.tsx': 'gap fluido entre columnas de la frecuencia',
  'components/ui/button.tsx': 'padding vertical fluido del control (hit target)',
  'components/ui/confirmation-panel.tsx': 'padding vertical fluido del panel',
};

describe('named type, measure and spacing scales', () => {
  for (const rule of FORBIDDEN) {
    it(`never writes ${rule.name} in src`, () => {
      const offenders = sourceFiles(SRC, /\.tsx?$/).flatMap((path) => {
        const rel = fromSrc(path);
        if (rule.exceptions && EXCEPTIONS[rel]) return [];

        return rule.pattern.test(readSource(path)) ? [rel] : [];
      });

      expect(offenders).toEqual([]);
    });
  }

  it('declares in tokens.css every named scale step the code uses', () => {
    const tokens = readSource(`${SRC}/app/tokens.css`);
    const declared = (name: string) => tokens.includes(`--${name}:`);
    const used = new Set<string>();
    for (const path of sourceFiles(SRC, /\.tsx?$/)) {
      for (const m of readSource(path).matchAll(/\bmax-w-measure-([\w-]+)/g))
        used.add(`container-measure-${m[1]}`);
      for (const m of readSource(path).matchAll(/\btext-serif-([\w]+)/g))
        used.add(`text-serif-${m[1]}`);
      for (const m of readSource(path).matchAll(/\bpt-(hero|top)\b/g)) used.add(`spacing-${m[1]}`);
    }

    expect([...used].filter((name) => !declared(name))).toEqual([]);
  });

  it('keeps the exceptions list honest: every entry still has a file', () => {
    for (const rel of Object.keys(EXCEPTIONS)) {
      expect(sourceFiles(SRC, /\.tsx?$/).map(fromSrc)).toContain(rel);
    }
  });
});
