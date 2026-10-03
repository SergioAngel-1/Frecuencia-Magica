import { dirname, join, relative, sep } from 'node:path';

import { describe, expect, it } from 'vitest';

import { fromSrc, SRC, sourceFiles } from '../helpers/source-files';

const APP = join(SRC, 'app');
const LOADINGS = sourceFiles(APP, /[\\/]loading\.tsx$/);
const PAGES = sourceFiles(APP, /[\\/]page\.tsx$/);

/**
 * Un `loading.tsx` envuelve en `Suspense` todo lo que cuelga de su carpeta. Si
 * debajo hay una ruta dinámica, su `notFound()` llega con la respuesta ya
 * emitida y sale con estado 200: así respondían `/tienda/p999` o
 * `/academia/zz`. El esqueleto de un realm con detalle vive en un route group
 * (`(catalogo)/`) junto a su índice, fuera del alcance del detalle.
 */
describe('real 404 status', () => {
  it('never lets a loading boundary wrap a dynamic route', () => {
    const offenders = LOADINGS.flatMap((loading) => {
      const scope = dirname(loading);

      return PAGES.filter((page) => page.startsWith(scope + sep))
        .filter((page) => relative(scope, page).includes('['))
        .map((page) => `${fromSrc(loading)} wraps ${fromSrc(page)}`);
    });

    expect(LOADINGS.length).toBeGreaterThan(0);
    expect(offenders).toEqual([]);
  });
});
