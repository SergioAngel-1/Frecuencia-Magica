import { describe, expect, it } from 'vitest';

import type { AtmosphereId } from '@/types/atmosphere';
import { resolveAtmosphere, suggestNightAlternative } from '@/lib/atmosphere/resolve';
import { placeFromPathname, realmFromPathname } from '@/lib/realm-from-pathname';

describe('resolveAtmosphere', () => {
  it('la elección de la persona gana en todos los lugares', () => {
    expect(resolveAtmosphere('descubrete', 'forest')).toBe('forest');
    expect(resolveAtmosphere('academia', 'forest')).toBe('forest');
    expect(resolveAtmosphere('tienda', 'dusk')).toBe('dusk');
    expect(resolveAtmosphere('story', 'night')).toBe('night');
    expect(resolveAtmosphere('portal', 'moon')).toBe('moon');
  });

  it('sin elección, cada lugar usa el tema que sugiere', () => {
    expect(resolveAtmosphere('descubrete')).toBe('night');
    expect(resolveAtmosphere('academia')).toBe('dawn');
    expect(resolveAtmosphere('story', null)).toBe('dawn');
    expect(resolveAtmosphere('experiencias', null)).toBe('dusk');
  });
});

describe('placeFromPathname', () => {
  it('reconoce cada realm en español y en inglés, con y sin prefijo /en', () => {
    expect(placeFromPathname('/')).toBe('portal');
    expect(placeFromPathname('/en')).toBe('portal');
    expect(placeFromPathname('/inicio')).toBe('home');
    expect(placeFromPathname('/en/home')).toBe('home');
    expect(placeFromPathname('/acceso')).toBe('auth');
    expect(placeFromPathname('/en/auth')).toBe('auth');
    expect(placeFromPathname('/descubrete')).toBe('descubrete');
    expect(placeFromPathname('/en/discover')).toBe('descubrete');
    expect(placeFromPathname('/resonario')).toBe('resonario');
    expect(placeFromPathname('/en/resonarium')).toBe('resonario');
    expect(placeFromPathname('/academia')).toBe('academia');
    expect(placeFromPathname('/en/academy/c1/3')).toBe('academia');
    expect(placeFromPathname('/experiencias')).toBe('experiencias');
    expect(placeFromPathname('/en/experiences')).toBe('experiencias');
    expect(placeFromPathname('/tienda/carrito')).toBe('tienda');
    expect(placeFromPathname('/en/store')).toBe('tienda');
    expect(placeFromPathname('/mi-santuario')).toBe('sanctuario');
    expect(placeFromPathname('/en/my-sanctuary')).toBe('sanctuario');
  });

  it('distingue Sobre Marisol como story en ambos idiomas', () => {
    expect(placeFromPathname('/sobre-marisol')).toBe('story');
    expect(placeFromPathname('/en/about-marisol')).toBe('story');
  });

  it('una ruta huérfana cae a portal', () => {
    expect(placeFromPathname('/inexistente')).toBe('portal');
    expect(placeFromPathname('/en/inexistente')).toBe('portal');
  });

  it('realmFromPathname sigue devolviendo home para Sobre Marisol', () => {
    expect(realmFromPathname('/sobre-marisol')).toBe('home');
    expect(realmFromPathname('/en/about-marisol')).toBe('home');
  });
});

describe('suggestNightAlternative', () => {
  it('sugiere la noche desde las 21 h y hasta las 5 h', () => {
    expect(suggestNightAlternative(20)).toBe(false);
    expect(suggestNightAlternative(21)).toBe(true);
    expect(suggestNightAlternative(23)).toBe(true);
    expect(suggestNightAlternative(4)).toBe(true);
    expect(suggestNightAlternative(5)).toBe(false);
  });
});

/** Cada vista de un lugar sugiere su tema desde la ruta, en español y en inglés. */
describe('la ruta sugiere el tema de cada lugar', () => {
  it.each([
    ['/academia', 'dawn'],
    ['/academia/c1', 'dawn'],
    ['/academia/c1/3', 'dawn'],
    ['/en/academy', 'dawn'],
    ['/en/academy/c1/3', 'dawn'],
    ['/tienda', 'dawn'],
    ['/en/store', 'dawn'],
    ['/experiencias', 'dusk'],
    ['/experiencias/e1/reservar', 'dusk'],
    ['/en/experiences', 'dusk'],
    ['/en/experiences/e1/book', 'dusk'],
    ['/sobre-marisol', 'dawn'],
    ['/en/about-marisol', 'dawn'],
  ])('%s resuelve a %s', (pathname, atmosphere) => {
    expect(resolveAtmosphere(placeFromPathname(pathname))).toBe(atmosphere);
  });
});

describe('la elección llega a todos los lugares, en ES y EN', () => {
  it.each<[string, AtmosphereId]>([
    ['/resonario', 'forest'],
    ['/en/resonarium', 'forest'],
    ['/academia', 'forest'],
    ['/en/academy', 'forest'],
    ['/tienda/carrito', 'forest'],
    ['/en/about-marisol', 'forest'],
  ])('%s toma la elección %s', (pathname, choice) => {
    expect(resolveAtmosphere(placeFromPathname(pathname), choice)).toBe(choice);
  });
});
