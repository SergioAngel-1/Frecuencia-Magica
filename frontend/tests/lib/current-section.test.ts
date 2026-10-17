import { describe, expect, it } from 'vitest';

import { currentSection } from '@/lib/navigation/current-section';
import { placeFromPathname } from '@/lib/realm-from-pathname';

const section = (pathname: string) => currentSection(placeFromPathname(pathname));

describe('currentSection', () => {
  it('no tiene sección en el portal ni en acceso', () => {
    expect(section('/')).toBeNull();
    expect(section('/en')).toBeNull();
    expect(section('/acceso')).toBeNull();
    expect(section('/en/auth')).toBeNull();
  });

  it('nombra cada realm en español', () => {
    expect(section('/inicio')).toEqual({ key: 'home' });
    expect(section('/descubrete')).toEqual({ key: 'descubrete' });
    expect(section('/resonario')).toEqual({ key: 'resonario' });
    expect(section('/academia')).toEqual({ key: 'academia' });
    expect(section('/experiencias')).toEqual({ key: 'experiencias' });
    expect(section('/tienda')).toEqual({ key: 'tienda' });
    expect(section('/mi-santuario')).toEqual({ key: 'sanctuario' });
  });

  it('nombra cada realm en inglés, con el mismo resultado que en español', () => {
    expect(section('/en/home')).toEqual({ key: 'home' });
    expect(section('/en/discover')).toEqual({ key: 'descubrete' });
    expect(section('/en/resonarium')).toEqual({ key: 'resonario' });
    expect(section('/en/academy')).toEqual({ key: 'academia' });
    expect(section('/en/experiences')).toEqual({ key: 'experiencias' });
    expect(section('/en/store')).toEqual({ key: 'tienda' });
    expect(section('/en/my-sanctuary')).toEqual({ key: 'sanctuario' });
  });

  it('Sobre Marisol es su propia sección, no la del home', () => {
    expect(section('/sobre-marisol')).toEqual({ key: 'story' });
    expect(section('/en/about-marisol')).toEqual({ key: 'story' });
  });

  it('las rutas anidadas pertenecen a la sección de su padre', () => {
    expect(section('/tienda/carrito')).toEqual({ key: 'tienda' });
    expect(section('/en/store/cart')).toEqual({ key: 'tienda' });
    expect(section('/academia/c1/3')).toEqual({ key: 'academia' });
  });
});
