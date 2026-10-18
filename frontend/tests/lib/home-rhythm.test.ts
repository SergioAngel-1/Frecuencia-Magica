import { describe, expect, it } from 'vitest';

import { readSource, SRC } from '../helpers/source-files';

/**
 * Ritmo claro/oscuro de la Home (T2.13, spec §10): cada sección con atmósfera
 * funde su borde con la noche en vez de cortar en seco, sin parallax ni
 * movimiento sobre el texto.
 */
const BACKDROP = readSource(`${SRC}/components/ui/scope-backdrop.tsx`);
const ARRIVAL = readSource(`${SRC}/components/features/home/arrival-section.tsx`);
const STORE = readSource(`${SRC}/components/features/home/store-showcase.tsx`);
const HOME = readSource(`${SRC}/app/[locale]/inicio/page.tsx`);

describe('fundidos de borde de la Home', () => {
  it('ScopeBackdrop funde con las utilidades fm-fade, que son una máscara', () => {
    expect(BACKDROP).toContain("both: 'fm-fade-top fm-fade-bottom'");
    expect(BACKDROP).toContain('aria-hidden="true"');
    expect(BACKDROP).not.toMatch(/animate|motion|parallax|transition/i);
  });

  it('el bloque de llegada es de día por defecto y funde su borde superior', () => {
    expect(ARRIVAL).toContain("const shown = atmosphere === 'night' ? 'dawn' : atmosphere");
    expect(ARRIVAL).toContain('fm-fade-top');
  });

  it('el fondo del bloque de llegada no se aclara a media transición: la capa vieja espera a la nueva', () => {
    // Con las dos capas fundiéndose a la vez, a mitad del cruce el fondo de la página asoma
    // (0,5 sobre 0,5 cubre 0,75). La que sale se queda opaca debajo mientras la nueva sube.
    expect(ARRIVAL).toContain('exit={{ opacity: 0, transition: { delay: fade, duration: 0 } }}');
    expect(ARRIVAL).toContain('const fade = reduced ? 0.2 : 0.6');
  });

  it('la tienda se cruza con el bloque de llegada por arriba y se funde con la noche por abajo', () => {
    expect(STORE).toContain('<ScopeBackdrop fade="both" />');
    // Sube un fade-band sobre el relleno inferior del bloque de llegada (mismo valor).
    expect(STORE).toContain('className="-mt-section"');
    expect(ARRIVAL).toContain('py-section');
  });

  it('Marisol cierra la página en su atmósfera, fundida arriba y abajo', () => {
    const scope = HOME.slice(HOME.indexOf('atmosphere="marisol"'));

    // A sangre: el fondo ocupa todo el ancho, no sólo la columna de la vista.
    expect(scope.slice(0, scope.indexOf('<ScopeBackdrop'))).toContain('fm-editorial-full-bleed');
    expect(scope).toContain('<ScopeBackdrop fade="both" />');
    expect(scope.indexOf('<ScopeBackdrop')).toBeLessThan(scope.indexOf('<AboutSection'));
  });
});
