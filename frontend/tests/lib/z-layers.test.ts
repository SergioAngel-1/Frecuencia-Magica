import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Entre capas del layout se apila con la escala con nombre de `globals.css`
 * (`z-content`, `z-header`, `z-cursor`…). Un `z-[N]` de tres cifras o más es
 * una capa de layout fuera de la escala: así quedó el cursor por debajo del
 * contenido.
 */
describe('named layer scale', () => {
  it('never stacks layout layers with raw z-[N] values', () => {
    const offenders = sourceFiles(SRC, /\.tsx?$/).flatMap((path) =>
      /\bz-\[\d{3,}\]/.test(readSource(path)) ? [fromSrc(path)] : [],
    );

    expect(offenders).toEqual([]);
  });

  it('keeps the luminous cursor above every other layer', () => {
    const cursor = readSource(`${SRC}/components/world/luminous-cursor.tsx`);

    expect(cursor).toMatch(/className="fm-cursor z-cursor"/);
  });
});
