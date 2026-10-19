import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Cambiar de tema es una experiencia (confirmación, cruce, nombre del estado), no una asignación:
 * toda escritura de la elección pasa por `useAtmosphereShift`. Sólo el store del cruce, que aplica
 * la elección al cubrirse la pantalla, y el propio store de tema la escriben directamente.
 */
const MAY_WRITE_CHOICE = new Set([
  'stores/atmosphere-shift-store.ts',
  'stores/atmosphere-store.ts',
]);

describe('atmosphere choice writers', () => {
  it('only the shift store writes the stored theme choice', () => {
    const offenders = sourceFiles(SRC)
      .map((file) => ({ path: fromSrc(file), source: readSource(file) }))
      .filter(
        ({ path, source }) =>
          /\bsetChoice\b|useAtmosphereStore\.getState\(\)\.clear|state\.clear\b/.test(source) &&
          !MAY_WRITE_CHOICE.has(path),
      )
      .map(({ path }) => path);

    expect(offenders).toEqual([]);
  });
});
