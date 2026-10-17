import { describe, expect, it } from 'vitest';

import { readSource, SRC } from '../helpers/source-files';

/**
 * Ritmo claro/oscuro de la Home (T2.13, spec §10): cada sección con atmósfera
 * funde su borde con la noche en vez de cortar en seco, sin parallax ni
 * movimiento sobre el texto.
 */
const BACKDROP = readSource(`${SRC}/components/ui/atmosphere-backdrop.tsx`);
const ARRIVAL = readSource(`${SRC}/components/features/home/arrival-section.tsx`);
const STORE = readSource(`${SRC}/components/features/home/store-showcase.tsx`);
const HOME = readSource(`${SRC}/app/[locale]/inicio/page.tsx`);

describe('fundidos de borde de la Home', () => {
  it('AtmosphereBackdrop funde con las utilidades fm-fade, que son una máscara', () => {
    expect(BACKDROP).toContain("both: 'fm-fade-top fm-fade-bottom'");
    expect(BACKDROP).toContain('aria-hidden="true"');
    expect(BACKDROP).not.toMatch(/animate|motion|parallax|transition/i);
  });

  it('el bloque de llegada es de día por defecto y funde su borde superior', () => {
    expect(ARRIVAL).toContain("const shown = atmosphere === 'night' ? 'dawn' : atmosphere");
    expect(ARRIVAL).toContain('fm-fade-top');
  });

  it('la tienda funde el borde inferior con el bento, que es de noche', () => {
    expect(STORE).toContain('<AtmosphereBackdrop fade="bottom" />');
  });

  it('Marisol cierra la página en su atmósfera, fundida arriba y abajo', () => {
    const scope = HOME.slice(HOME.indexOf('atmosphere="marisol"'));

    expect(scope).toContain('<AtmosphereBackdrop fade="both" />');
    expect(scope.indexOf('<AtmosphereBackdrop')).toBeLessThan(scope.indexOf('<AboutSection'));
  });
});
