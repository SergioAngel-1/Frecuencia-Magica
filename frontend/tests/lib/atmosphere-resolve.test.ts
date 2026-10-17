import { describe, expect, it } from 'vitest';

import { PLACE_ATMOSPHERE } from '@/config/atmospheres';
import type { AtmosphereId } from '@/types/atmosphere';
import { resolveAtmosphere, suggestNightAlternative } from '@/lib/atmosphere/resolve';
import { placeFromPathname, realmFromPathname } from '@/lib/realm-from-pathname';

describe('resolveAtmosphere', () => {
  it('en un lugar de escucha, la elección manual gana sobre el defecto', () => {
    expect(resolveAtmosphere('descubrete', 'forest')).toBe('forest');
    expect(resolveAtmosphere('resonario', 'dusk')).toBe('dusk');
    expect(resolveAtmosphere('sanctuario', 'moon')).toBe('moon');
  });

  it('fuera de los lugares de escucha, la elección manual se ignora', () => {
    expect(resolveAtmosphere('academia', 'dawn')).toBe(PLACE_ATMOSPHERE.academia);
    expect(resolveAtmosphere('tienda', 'dusk')).toBe(PLACE_ATMOSPHERE.tienda);
    expect(resolveAtmosphere('story', 'night')).toBe(PLACE_ATMOSPHERE.story);
    expect(resolveAtmosphere('portal', 'moon')).toBe(PLACE_ATMOSPHERE.portal);
  });

  it('sin elección manual, cada lugar usa su defecto', () => {
    expect(resolveAtmosphere('descubrete')).toBe('night');
    expect(resolveAtmosphere('academia')).toBe('study');
    expect(resolveAtmosphere('story', null)).toBe('marisol');
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

/**
 * Cada vista de un lugar con identidad propia (ambientes v2, R11) hereda su
 * atmósfera desde la ruta, en español y en inglés, con y sin el segmento de
 * detalle. La elección manual no llega aquí: estos lugares no son de escucha.
 */
describe('la ruta fija la atmósfera de cada lugar con identidad propia', () => {
  it.each([
    ['/academia', 'study'],
    ['/academia/c1', 'study'],
    ['/academia/c1/3', 'study'],
    ['/en/academy', 'study'],
    ['/en/academy/c1/3', 'study'],
    ['/experiencias', 'gathering'],
    ['/experiencias/e1/reservar', 'gathering'],
    ['/en/experiences', 'gathering'],
    ['/en/experiences/e1/book', 'gathering'],
    ['/sobre-marisol', 'marisol'],
    ['/en/about-marisol', 'marisol'],
  ])('%s resuelve a %s', (pathname, atmosphere) => {
    expect(resolveAtmosphere(placeFromPathname(pathname))).toBe(atmosphere);
  });
});

describe('la elección manual llega a los lugares de escucha, en ES y EN', () => {
  it.each<[string, AtmosphereId]>([
    ['/resonario', 'forest'],
    ['/en/resonarium', 'forest'],
    ['/descubrete', 'forest'],
    ['/en/discover', 'forest'],
    ['/mi-santuario', 'forest'],
    ['/en/my-sanctuary', 'forest'],
  ])('%s toma la elección manual %s', (pathname, manual) => {
    expect(resolveAtmosphere(placeFromPathname(pathname), manual)).toBe(manual);
  });
});
