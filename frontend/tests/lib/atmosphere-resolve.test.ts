import { describe, expect, it } from 'vitest';

import { ATMOSPHERE_IDS, PLACE_ATMOSPHERE } from '@/config/atmospheres';
import { resolveAtmosphere, suggestNightAlternative } from '@/lib/atmosphere/resolve';
import { placeFromPathname, realmFromPathname } from '@/lib/realm-from-pathname';
import type { AtmosphereId, Place } from '@/types/atmosphere';

const PLACES = Object.keys(PLACE_ATMOSPHERE) as Place[];

describe('resolveAtmosphere', () => {
  it('la elección de la persona gana en todos los lugares', () => {
    expect(resolveAtmosphere('descubrete', 'forest')).toBe('forest');
    expect(resolveAtmosphere('academia', 'forest')).toBe('forest');
    expect(resolveAtmosphere('tienda', 'dusk')).toBe('dusk');
    expect(resolveAtmosphere('story', 'night')).toBe('night');
    expect(resolveAtmosphere('portal', 'moon')).toBe('moon');
  });

  it('sin elección, cada lugar usa el tema que sugiere', () => {
    expect(resolveAtmosphere('descubrete')).toBe('moon');
    expect(resolveAtmosphere('academia')).toBe('forest');
    expect(resolveAtmosphere('sanctuario')).toBe('moon');
    expect(resolveAtmosphere('tienda')).toBe('dawn');
    expect(resolveAtmosphere('story', null)).toBe('dawn');
    expect(resolveAtmosphere('experiencias', null)).toBe('dusk');
  });

  it('la elección de la persona gana a lo que suena', () => {
    expect(resolveAtmosphere('resonario', 'forest', 'moon')).toBe('forest');
    expect(resolveAtmosphere('resonario', 'dawn', 'night')).toBe('dawn');
  });

  it('lo que suena gana al tema del lugar cuando no hay elección', () => {
    expect(resolveAtmosphere('resonario', null, 'forest')).toBe('forest');
    expect(resolveAtmosphere('resonario', undefined, 'moon')).toBe('moon');
  });

  it('sin escucha, el tema del lugar no cambia', () => {
    expect(resolveAtmosphere('resonario', null, null)).toBe('night');
    expect(resolveAtmosphere('resonario', null, undefined)).toBe('night');
    expect(resolveAtmosphere('resonario', undefined, null)).toBe('night');
  });
});

describe('la elección manda sobre el lugar y sobre la escucha', () => {
  it.each(PLACES)('en %s, cualquier elección gana con y sin escucha', (place) => {
    for (const choice of ATMOSPHERE_IDS) {
      expect(resolveAtmosphere(place, choice)).toBe(choice);

      for (const listening of ATMOSPHERE_IDS) {
        expect(resolveAtmosphere(place, choice, listening)).toBe(choice);
      }
    }
  });

  it.each(PLACES)('en %s, sin elección manda la escucha o, en su defecto, el lugar', (place) => {
    expect(resolveAtmosphere(place, null)).toBe(PLACE_ATMOSPHERE[place]);

    for (const listening of ATMOSPHERE_IDS) {
      expect(resolveAtmosphere(place, null, listening)).toBe(listening);
      expect(resolveAtmosphere(place, undefined, listening)).toBe(listening);
    }
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
    ['/academia', 'forest'],
    ['/academia/c1', 'forest'],
    ['/academia/c1/3', 'forest'],
    ['/en/academy', 'forest'],
    ['/en/academy/c1/3', 'forest'],
    ['/descubrete', 'moon'],
    ['/en/discover', 'moon'],
    ['/mi-santuario', 'moon'],
    ['/en/my-sanctuary', 'moon'],
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
