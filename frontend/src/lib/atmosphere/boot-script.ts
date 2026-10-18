import {
  ATMOSPHERE_IDS,
  ATMOSPHERE_STORAGE_KEY,
  ATMOSPHERE_STORE_VERSION,
  ATMOSPHERES,
  PLACE_ATMOSPHERE,
} from '@/config/atmospheres';
import { locales } from '@/i18n/routing';
import { SEGMENT_TO_PLACE } from '@/lib/realm-from-pathname';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Atmósfera que pinta el servidor. Como el HTML es estático, no sabe la ruta:
 * el script de arranque la corrige antes del primer pintado.
 */
export const SERVER_ATMOSPHERE: AtmosphereId = 'night';

/**
 * Script en línea, síncrono, para `<head>`: fija `data-atmosphere` y
 * `data-scheme` en `<html>` y el `theme-color` antes de que el navegador pinte
 * nada, de modo que una recarga directa de `/academia` no destelle con la noche.
 *
 * No duplica reglas a mano: las tablas (segmento → lugar, lugar → atmósfera,
 * esquemas, colores, locales, clave y versión del store) se
 * serializan desde la config. La lógica replica `placeFromPathname`,
 * `resolveAtmosphere` y la rehidratación de zustand (una versión numérica distinta
 * descarta el estado). `tests/lib/atmosphere-boot.test.ts` compara el resultado
 * con el store real y con el provider.
 */
export function atmosphereBootScript(): string {
  const config = {
    storageKey: ATMOSPHERE_STORAGE_KEY,
    storeVersion: ATMOSPHERE_STORE_VERSION,
    ids: ATMOSPHERE_IDS,
    locales: [...locales],
    segments: SEGMENT_TO_PLACE,
    placeAtmosphere: PLACE_ATMOSPHERE,
    schemes: Object.fromEntries(ATMOSPHERE_IDS.map((id) => [id, ATMOSPHERES[id].scheme])),
    themeColors: Object.fromEntries(ATMOSPHERE_IDS.map((id) => [id, ATMOSPHERES[id].themeColor])),
  };

  // `<` escapado: ningún valor puede cerrar la etiqueta <script> desde dentro.
  const json = JSON.stringify(config).replace(/</g, '\\u003c');

  return `(function (c) {
  try {
    var segments = window.location.pathname.split('/').filter(Boolean);
    var first = segments[0];
    var segment = first === undefined ? undefined : c.locales.indexOf(first) !== -1 ? segments[1] : first;
    var place = 'portal';
    if (segment !== undefined && Object.prototype.hasOwnProperty.call(c.segments, segment)) {
      place = c.segments[segment];
    }
    var choice = null;
    try {
      var raw = window.localStorage.getItem(c.storageKey);
      var value = raw ? JSON.parse(raw) : null;
      // Igual que zustand: sólo una versión numérica distinta descarta el estado.
      var discarded = value && typeof value.version === 'number' && value.version !== c.storeVersion;
      var id = value && !discarded && value.state ? value.state.choice : null;
      if (typeof id === 'string' && c.ids.indexOf(id) !== -1) choice = id;
    } catch (e) {}
    var atmosphere = choice !== null ? choice : c.placeAtmosphere[place];
    var root = document.documentElement;
    root.setAttribute('data-atmosphere', atmosphere);
    root.setAttribute('data-scheme', c.schemes[atmosphere]);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', c.themeColors[atmosphere]);
  } catch (e) {}
})(${json});`;
}
