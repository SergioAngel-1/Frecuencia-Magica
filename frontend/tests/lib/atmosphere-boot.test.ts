import { beforeAll, describe, expect, it, vi } from 'vitest';

import {
  ATMOSPHERE_IDS,
  ATMOSPHERE_STORAGE_KEY,
  ATMOSPHERE_STORE_VERSION,
  ATMOSPHERES,
} from '@/config/atmospheres';
import { routing } from '@/i18n/routing';
import { atmosphereBootScript } from '@/lib/atmosphere/boot-script';
import { resolveAtmosphere } from '@/lib/atmosphere/resolve';
import { placeFromPathname } from '@/lib/realm-from-pathname';
import { useAtmosphereStore } from '@/stores/atmosphere-store';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Paridad entre el script de arranque (lo que pinta antes del primer frame), el
 * store real (zustand con `sessionStorage`) y el provider
 * (`resolveAtmosphere(placeFromPathname(ruta), elección)`). Si uno de los tres
 * cambia sin los otros, el atributo de `<html>` cambia al hidratar y aparece un
 * destello: este test lo impide.
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

/** Texto de `sessionStorage` en formato zustand; `version` se omite si es `undefined`. */
const stored = (state: unknown, version?: unknown) =>
  JSON.stringify(version === undefined ? { state } : { state, version });

const STORED_ROWS: { label: string; raw: string | null }[] = [
  { label: 'sin elección', raw: null },
  { label: 'JSON roto', raw: 'no es json' },
  { label: 'elección nula', raw: stored({ manual: null }, ATMOSPHERE_STORE_VERSION) },
  { label: 'id inválido', raw: stored({ manual: 'nope' }, ATMOSPHERE_STORE_VERSION) },
  { label: 'id del prototipo', raw: stored({ manual: 'constructor' }, ATMOSPHERE_STORE_VERSION) },
  { label: 'versión 1 (distinta)', raw: stored({ manual: 'dusk' }, 1) },
  { label: 'versión "0" (cadena)', raw: stored({ manual: 'dusk' }, '0') },
  { label: 'sin versión', raw: stored({ manual: 'dusk' }) },
  ...ATMOSPHERE_IDS.map((id) => ({
    label: `elección ${id}`,
    raw: stored({ manual: id }, ATMOSPHERE_STORE_VERSION),
  })),
];

/**
 * La elección que el store real rehidrata desde cada `sessionStorage`. Es la
 * referencia: el script y el provider deben coincidir con ella.
 */
async function storeManualFor(raw: string | null): Promise<AtmosphereId | null> {
  // Primero el estado: `setState` persiste en `sessionStorage` y pisaría el `raw`.
  useAtmosphereStore.setState({ manual: null });
  sessionStorage.clear();
  if (raw !== null) sessionStorage.setItem(ATMOSPHERE_STORAGE_KEY, raw);

  // zustand avisa con console.error cuando descarta una versión: ruido esperado.
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await useAtmosphereStore.persist.rehydrate();
  } finally {
    spy.mockRestore();
  }

  return useAtmosphereStore.getState().manual;
}

/** Filas con la elección que devuelve el store real. Se calculan una vez. */
let ROWS: { label: string; raw: string | null; manual: AtmosphereId | null }[] = [];

beforeAll(async () => {
  ROWS = [];
  for (const row of STORED_ROWS) {
    ROWS.push({ ...row, manual: await storeManualFor(row.raw) });
  }
  sessionStorage.clear();
});

type Attributes = {
  atmosphere: string | undefined;
  scheme: string | undefined;
  themeColor: string | undefined;
  themeColorMetas: number;
};

/** Elemento mínimo: atributos y nada más. */
class FakeElement {
  readonly attributes = new Map<string, string>();

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }

  getAttribute(name: string) {
    return this.attributes.get(name) ?? null;
  }
}

/**
 * `document` falso con lo que usa el script: `documentElement`, `head`,
 * `querySelector` y `createElement`. `meta` es la etiqueta `theme-color` que ya
 * existe en el HTML (la que deja Next), o `null` si no hay ninguna.
 */
function fakeDocument(meta: FakeElement | null) {
  const root = new FakeElement();
  const head = {
    children: [] as FakeElement[],
    appendChild(element: FakeElement) {
      this.children.push(element);

      return element;
    },
  };
  const isThemeColor = (element: FakeElement) => element.getAttribute('name') === 'theme-color';
  const metas = () => [...(meta ? [meta] : []), ...head.children.filter(isThemeColor)];

  return {
    documentElement: root,
    head,
    querySelector(selector: string) {
      if (selector !== 'meta[name="theme-color"]') return null;

      return metas()[0] ?? null;
    },
    createElement: (_tag: string) => new FakeElement(),
    metas,
  };
}

/**
 * Ejecuta el script con un `window`, un `document` y un `sessionStorage` falsos
 * y devuelve lo que habría dejado en `<html>` y en `theme-color`.
 */
function runBootScript(pathname: string, raw: string | null, withMeta: boolean): Attributes {
  const existing = withMeta ? new FakeElement() : null;
  existing?.setAttribute('name', 'theme-color');
  existing?.setAttribute('content', '#000000');
  const doc = fakeDocument(existing);
  const fakeWindow = {
    location: { pathname },
    sessionStorage: {
      getItem: (key: string) => (key === ATMOSPHERE_STORAGE_KEY ? raw : null),
    },
  };

  new Function('window', 'document', atmosphereBootScript())(fakeWindow, doc);

  const metas = doc.metas();

  return {
    atmosphere: doc.documentElement.getAttribute('data-atmosphere') ?? undefined,
    scheme: doc.documentElement.getAttribute('data-scheme') ?? undefined,
    themeColor: metas[0]?.getAttribute('content') ?? undefined,
    themeColorMetas: metas.length,
  };
}

/** Lo que el provider fijaría para esa ruta y esa elección. */
function providerAttributes(pathname: string, manual: AtmosphereId | null): Attributes {
  const atmosphere = resolveAtmosphere(placeFromPathname(pathname), manual);

  return {
    atmosphere,
    scheme: ATMOSPHERES[atmosphere].scheme,
    themeColor: ATMOSPHERES[atmosphere].themeColor,
    themeColorMetas: 1,
  };
}

describe('atmosphereBootScript', () => {
  it('la tabla del store real da la elección esperada en cada fila', () => {
    const byLabel = Object.fromEntries(ROWS.map((row) => [row.label, row.manual]));

    expect(byLabel['sin elección']).toBeNull();
    expect(byLabel['JSON roto']).toBeNull();
    expect(byLabel['id inválido']).toBeNull();
    expect(byLabel['id del prototipo']).toBeNull();
    expect(byLabel['versión 1 (distinta)']).toBeNull();
    // zustand sólo descarta una versión numérica distinta: estos se aceptan.
    expect(byLabel['versión "0" (cadena)']).toBe('dusk');
    expect(byLabel['sin versión']).toBe('dusk');
    expect(byLabel['elección moon']).toBe('moon');
  });

  it.each(PATHS)('fija lo mismo que el store y el provider en %s', (pathname) => {
    for (const { label, raw, manual } of ROWS) {
      for (const withMeta of [true, false]) {
        expect(
          runBootScript(pathname, raw, withMeta),
          `${pathname} · ${label} · meta ${withMeta}`,
        ).toEqual(providerAttributes(pathname, manual));
      }
    }
  });

  it('usa el lugar de la URL cruda aunque sessionStorage no sea legible', () => {
    const fakeWindow = {
      location: { pathname: '/academia' },
      sessionStorage: {
        getItem: () => {
          throw new Error('SecurityError');
        },
      },
    };
    const doc = fakeDocument(null);

    new Function('window', 'document', atmosphereBootScript())(fakeWindow, doc);

    expect(doc.documentElement.getAttribute('data-atmosphere')).toBe('study');
    expect(doc.documentElement.getAttribute('data-scheme')).toBe('light');
    expect(doc.metas()[0]?.getAttribute('content')).toBe(ATMOSPHERES.study.themeColor);
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
