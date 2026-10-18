import { describe, expect, it } from 'vitest';

import { readSource, SRC } from '../helpers/source-files';

/**
 * La viñeta de la nebulosa oscurece el borde inferior de la pantalla. Con el
 * navy escrito a mano, en una atmósfera clara (estudio, tienda, Marisol…) la
 * capa, a la opacidad de su perfil, ensuciaba el fondo crema a gris: 240 -> 209
 * de luminosidad medidos con Chromium. Lee el velo de la atmósfera: en la noche
 * es el mismo navy (los mismos píxeles); en una clara, el velo claro.
 */
const NEBULA = readSource(`${SRC}/components/world/nebula-layer.tsx`);
const VIGNETTE_RULE = NEBULA.match(/'radial-gradient\(120% 90%[^']*'/)?.[0] ?? '';

describe('viñeta de la nebulosa', () => {
  it('sigue el velo de la atmósfera, no un navy fijo', () => {
    expect(VIGNETTE_RULE).not.toBe('');
    expect(VIGNETTE_RULE).toContain('rgb(var(--scrim) / 0)');
    expect(VIGNETTE_RULE).toContain('rgb(var(--scrim-deep) / 0.85)');
    expect(VIGNETTE_RULE).not.toMatch(/rgba\(/);
  });
});
