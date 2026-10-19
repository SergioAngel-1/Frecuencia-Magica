import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Ritmo vertical de página (DESIGN.md § Layout): dos peldaños, `section` entre
 * bloques y `block` del héroe o del encabezado a su contenido. Una vista no
 * escribe sus propios píxeles para separar bloques; y los bloques de la Home no
 * traen padding exterior: la pila `fm-stack` pone un peldaño entre dos hermanos
 * (si cada sección trajera el suyo, dos seguidas sumarían dos).
 */
const SPACING = /\b(?:pt|pb|py|mt|mb)-\[(\d+)px\]/g;
const MIN_PX_FOR_RHYTHM = 40;

/**
 * Páginas con un padding fijo que no separa bloques: pantallas completas que
 * reservan el hueco del header y del reproductor, o el interior de un héroe.
 */
const EXCEPTIONS: Record<string, string> = {
  'app/[locale]/error.tsx': 'pantalla completa de error: hueco del header y del reproductor',
  'app/[locale]/not-found.tsx': 'pantalla completa de 404: hueco del header y del reproductor',
  'app/[locale]/mi-santuario/page.tsx': 'interior del héroe (el título baja al pie de la banda)',
};

const viewFiles = () =>
  sourceFiles(SRC, /\.tsx$/).filter((path) => {
    const rel = fromSrc(path);

    return (
      (rel.startsWith('app/[locale]/') && !rel.startsWith('app/[locale]/kit/')) ||
      rel === 'components/layout/page-shell.tsx'
    );
  });

describe('page rhythm', () => {
  it('never separates blocks with a loose pixel value in a view or in PageShell', () => {
    const offenders = viewFiles().flatMap((path) => {
      const rel = fromSrc(path);
      if (EXCEPTIONS[rel]) return [];

      return [...readSource(path).matchAll(SPACING)]
        .filter((match) => Number(match[1]) >= MIN_PX_FOR_RHYTHM)
        .map((match) => `${rel}: ${match[0]}`);
    });

    expect(offenders).toEqual([]);
  });

  it('keeps the exceptions list honest: every entry still has a file and a loose value', () => {
    for (const rel of Object.keys(EXCEPTIONS)) {
      const path = viewFiles().find((file) => fromSrc(file) === rel);

      expect(path, rel).toBeDefined();
      expect(readSource(path!).match(SPACING), rel).not.toBeNull();
    }
  });

  it('Home: the blocks after the hero sit in one stack and bring no outer padding of their own', () => {
    const page = readSource(`${SRC}/app/[locale]/inicio/page.tsx`);

    expect(page).toContain('fm-stack pt-block pb-section');
    expect(page.indexOf('<HeroSection')).toBeLessThan(page.indexOf('className="fm-stack'));

    for (const file of sourceFiles(`${SRC}/components/features/home`, /\.tsx$/)) {
      if (!/<section\b|fm-editorial-full-bleed/.test(readSource(file))) continue;

      expect(readSource(file), fromSrc(file)).not.toMatch(/\b(?:py|pt|pb)-section\b/);
    }
    expect(page).not.toMatch(/\b(?:py|pt)-section\b/);
  });
});
