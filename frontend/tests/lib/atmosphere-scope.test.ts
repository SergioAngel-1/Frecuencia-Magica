import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Tinta de una sección re-tematizada (ambientes v2, R29). `AtmosphereScope` fija
 * `color: var(--color-fg)` en su propio contenedor: como la variable se redefine
 * en `[data-atmosphere]`, el texto hereda la tinta de la atmósfera de la sección.
 * Sin ese fijado, un título dentro de una sección clara (`Display`, que no lleva
 * color) hereda el marfil de la noche de `body` y se vuelve ilegible.
 */
const SCOPE = readSource(resolve(SRC, 'components/ui/atmosphere-scope.tsx'));
const ARRIVAL = readSource(resolve(SRC, 'components/features/home/arrival-section.tsx'));

describe('AtmosphereScope fija la tinta de su atmósfera', () => {
  it('el contenedor lleva la clase semántica text-fg (color: var(--color-fg))', () => {
    expect(SCOPE).toMatch(/cn\(\s*'text-fg'/);
  });

  it('un título sin color propio dentro del scope no declara un color de la noche', () => {
    // El agente anterior esquivó el problema con `text-fg` local en el Display. El
    // contrato nuevo es la herencia: el Display no lleva color.
    expect(ARRIVAL).not.toMatch(/<Display[^>]*className="text-fg"/);
  });

  it('los scopes del sitio no pintan la tinta con colores de la paleta', () => {
    for (const file of sourceFiles(SRC, /\.(ts|tsx)$/)) {
      if (!readSource(file).includes('<AtmosphereScope')) continue;
      expect(readSource(file)).not.toMatch(/text-(ivory|gold|void)\b/);
    }
  });
});
