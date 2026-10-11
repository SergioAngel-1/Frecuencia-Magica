import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * El `useReducedMotion` de Motion lee `matchMedia` ya en el primer render del
 * cliente, mientras que en servidor devuelve `null`. Si su valor decide un
 * `initial` (`y: reduced ? 0 : 18`), con movimiento reducido el HTML del
 * servidor y la hidratación no coinciden y React avisa de un atributo `style`
 * distinto que no se corrige (así le pasaba a `TalkFloat` en todas las vistas).
 * `useReducedMotionSafe` hidrata con el valor del servidor y corrige después;
 * para un `initial` que ya se pinta en servidor, ni eso basta (el `initial`
 * sólo se lee al montar): ahí va `MotionConfig reducedMotion="user"`, que
 * Motion consulta al animar.
 */
describe('reduced motion and hydration', () => {
  it('reads the preference through useReducedMotionSafe, never Motion directly', () => {
    const offenders = sourceFiles(SRC)
      .filter((file) =>
        /import\s*\{[^}]*\buseReducedMotion\b[^}]*\}\s*from\s*['"]motion\//.test(readSource(file)),
      )
      .map(fromSrc);

    expect(offenders).toEqual([]);
  });
});
