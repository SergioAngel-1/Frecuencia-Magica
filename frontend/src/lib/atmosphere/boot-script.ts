import {
  ATMOSPHERE_IDS,
  ATMOSPHERE_STORAGE_KEY,
  ATMOSPHERES,
  LISTENING_PLACES,
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
 * `data-scheme` en `<html>` antes de que el navegador pinte nada, de modo que
 * una recarga directa de `/academia` no destelle con la noche.
 *
 * No duplica reglas a mano: las tablas (segmento → lugar, lugar → atmósfera,
 * lugares de escucha, esquemas, locales) se serializan desde la config. La
 * lógica de derivación replica `placeFromPathname` + `resolveAtmosphere` y
 * `tests/lib/atmosphere-boot.test.ts` comprueba que dan el mismo resultado.
 * Si cambia una de las dos, el test falla.
 */
export function atmosphereBootScript(): string {
  const config = {
    storageKey: ATMOSPHERE_STORAGE_KEY,
    ids: ATMOSPHERE_IDS,
    locales: [...locales],
    segments: SEGMENT_TO_PLACE,
    listening: LISTENING_PLACES,
    placeAtmosphere: PLACE_ATMOSPHERE,
    schemes: Object.fromEntries(ATMOSPHERE_IDS.map((id) => [id, ATMOSPHERES[id].scheme])),
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
    var manual = null;
    try {
      var raw = window.sessionStorage.getItem(c.storageKey);
      var value = raw ? JSON.parse(raw) : null;
      var id = value && value.state ? value.state.manual : null;
      if (typeof id === 'string' && c.ids.indexOf(id) !== -1) manual = id;
    } catch (e) {}
    var atmosphere = manual !== null && c.listening.indexOf(place) !== -1 ? manual : c.placeAtmosphere[place];
    var root = document.documentElement;
    root.setAttribute('data-atmosphere', atmosphere);
    root.setAttribute('data-scheme', c.schemes[atmosphere]);
  } catch (e) {}
})(${json});`;
}
