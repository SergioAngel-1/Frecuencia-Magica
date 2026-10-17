import { describe, expect, it } from 'vitest';

import { placeFromPathname, realmFromPathname } from '@/lib/realm-from-pathname';

describe('realmFromPathname', () => {
  it('la raíz es el portal', () => {
    expect(realmFromPathname('/')).toBe('portal');
  });

  it('la raíz de un locale también es el portal', () => {
    expect(realmFromPathname('/en')).toBe('portal');
  });

  it('reconoce cada realm por su segmento en español', () => {
    expect(realmFromPathname('/inicio')).toBe('home');
    expect(realmFromPathname('/acceso')).toBe('auth');
    expect(realmFromPathname('/descubrete')).toBe('descubrete');
    expect(realmFromPathname('/resonario')).toBe('resonario');
    expect(realmFromPathname('/academia')).toBe('academia');
    expect(realmFromPathname('/experiencias')).toBe('experiencias');
    expect(realmFromPathname('/tienda')).toBe('tienda');
    expect(realmFromPathname('/mi-santuario')).toBe('sanctuario');
  });

  it('reconoce cada realm por su segmento en inglés', () => {
    expect(realmFromPathname('/home')).toBe('home');
    expect(realmFromPathname('/auth')).toBe('auth');
    expect(realmFromPathname('/discover')).toBe('descubrete');
    expect(realmFromPathname('/resonarium')).toBe('resonario');
    expect(realmFromPathname('/academy')).toBe('academia');
    expect(realmFromPathname('/experiences')).toBe('experiencias');
    expect(realmFromPathname('/store')).toBe('tienda');
    expect(realmFromPathname('/my-sanctuary')).toBe('sanctuario');
  });

  it('las rutas anidadas heredan el realm del padre', () => {
    expect(realmFromPathname('/academia/c1/3')).toBe('academia');
    expect(realmFromPathname('/tienda/carrito')).toBe('tienda');
    expect(realmFromPathname('/experiencias/e2/reservar')).toBe('experiencias');
  });

  it('la vista de Marisol hereda el realm del home en ambos idiomas', () => {
    expect(realmFromPathname('/sobre-marisol')).toBe('home');
    expect(realmFromPathname('/en/about-marisol')).toBe('home');
  });

  it('una ruta desconocida cae en el portal', () => {
    expect(realmFromPathname('/inexistente')).toBe('portal');
  });

  it('los nombres de propiedades del prototipo no son lugares: caen en portal', () => {
    expect(placeFromPathname('/constructor')).toBe('portal');
    expect(placeFromPathname('/en/__proto__')).toBe('portal');
    expect(placeFromPathname('/toString')).toBe('portal');
    expect(placeFromPathname('/en/hasOwnProperty')).toBe('portal');
    expect(realmFromPathname('/constructor')).toBe('portal');
    expect(realmFromPathname('/en/__proto__')).toBe('portal');
  });

  it('las rutas anidadas en inglés con prefijo de locale también heredan', () => {
    expect(realmFromPathname('/en/resonarium')).toBe('resonario');
    expect(realmFromPathname('/en/academy/c1/3')).toBe('academia');
  });
});
