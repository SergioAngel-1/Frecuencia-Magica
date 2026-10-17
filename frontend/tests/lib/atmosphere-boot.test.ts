import { describe, expect, it } from 'vitest';

import { ATMOSPHERE_IDS, ATMOSPHERE_STORAGE_KEY, ATMOSPHERES } from '@/config/atmospheres';
import { routing } from '@/i18n/routing';
import { atmosphereBootScript } from '@/lib/atmosphere/boot-script';
import { resolveAtmosphere } from '@/lib/atmosphere/resolve';
import { placeFromPathname } from '@/lib/realm-from-pathname';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Paridad entre el script de arranque (lo que pinta antes del primer frame) y
 * el provider (`resolveAtmosphere(placeFromPathname(ruta), elección)`). Si uno
 * de los dos cambia sin el otro, el atributo de `<html>` cambia al hidratar y
 * aparece un destello: este test lo impide.
 */

/** Sustituye los segmentos dinámicos (`[courseId]`) por un valor concreto. */
const concrete = (path: string) => path.replace(/\[[^\]]+\]/g, 'x1');

/** Prefijo de locale: `/` en inglés es `/en`, no `/en/`. */
const inEnglish = (path: string) => (path === '/' ? '/en' : `/en${path}`);

const PATHS = [
  ...Object.values(routing.pathnames).flatMap((value) => {
    const es = typeof value === 'string' ? value : value.es;
    const en = typeof value === 'string' ? value : value.en;

    return [concrete(es), inEnglish(concrete(en))];
  }),
  '/',
  '/en',
  '/inexistente',
  '/en/inexistente',
  // Nombres de propiedades del prototipo: no son lugares.
  '/constructor',
  '/en/__proto__',
];

const envelope = (manual: unknown) => JSON.stringify({ state: { manual }, version: 0 });

/** Estados de `sessionStorage` posibles y la elección válida que contienen. */
const STORED: { label: string; raw: string | null; manual: AtmosphereId | null }[] = [
  { label: 'sin elección', raw: null, manual: null },
  { label: 'JSON roto', raw: 'no es json', manual: null },
  { label: 'elección nula', raw: envelope(null), manual: null },
  { label: 'id inválido', raw: envelope('nope'), manual: null },
  { label: 'id del prototipo', raw: envelope('constructor'), manual: null },
  ...ATMOSPHERE_IDS.map((id) => ({ label: `elección ${id}`, raw: envelope(id), manual: id })),
];

type Attributes = { atmosphere: string | undefined; scheme: string | undefined };

/**
 * Ejecuta el script con un `window`, un `document` y un `sessionStorage` falsos
 * y devuelve los atributos que habría fijado en `<html>`.
 */
function runBootScript(pathname: string, raw: string | null): Attributes {
  const attributes = new Map<string, string>();
  const fakeWindow = {
    location: { pathname },
    sessionStorage: {
      getItem: (key: string) => (key === ATMOSPHERE_STORAGE_KEY ? raw : null),
    },
  };
  const fakeDocument = {
    documentElement: {
      setAttribute: (name: string, value: string) => void attributes.set(name, value),
    },
  };

  new Function('window', 'document', atmosphereBootScript())(fakeWindow, fakeDocument);

  return {
    atmosphere: attributes.get('data-atmosphere'),
    scheme: attributes.get('data-scheme'),
  };
}

/** Lo que el provider fijaría para esa ruta y esa elección. */
function providerAttributes(pathname: string, manual: AtmosphereId | null): Attributes {
  const atmosphere = resolveAtmosphere(placeFromPathname(pathname), manual);

  return { atmosphere, scheme: ATMOSPHERES[atmosphere].scheme };
}

describe('atmosphereBootScript', () => {
  it.each(PATHS)('fija lo mismo que el provider en %s', (pathname) => {
    for (const { label, raw, manual } of STORED) {
      expect(runBootScript(pathname, raw), `${pathname} · ${label}`).toEqual(
        providerAttributes(pathname, manual),
      );
    }
  });

  it('usa el lugar de la URL cruda aunque no haya sessionStorage', () => {
    const fakeWindow = { location: { pathname: '/academia' } };
    const attributes = new Map<string, string>();
    const fakeDocument = {
      documentElement: {
        setAttribute: (name: string, value: string) => void attributes.set(name, value),
      },
    };

    new Function('window', 'document', atmosphereBootScript())(fakeWindow, fakeDocument);

    expect(attributes.get('data-atmosphere')).toBe('study');
    expect(attributes.get('data-scheme')).toBe('light');
  });

  it('el provider ve la ruta sin prefijo de locale (usePathname): mismo lugar que la URL', () => {
    for (const value of Object.values(routing.pathnames)) {
      if (typeof value === 'string') continue;

      const localized = concrete(value.en);

      expect(placeFromPathname(localized), localized).toBe(placeFromPathname(inEnglish(localized)));
    }
  });

  it('el texto del script no puede cerrar la etiqueta <script> desde dentro', () => {
    expect(atmosphereBootScript()).not.toMatch(/<\/script/i);
  });
});
