/**
 * Datos de entrada del registro de materiales pendientes: el catálogo real de
 * audio, el registro de videos, los productos, los cursos y las imágenes
 * provisionales del brief. Lo comparten `export-pending-materials.mjs` (que
 * escribe el documento) y `tests/lib/pending-materials.test.ts` (que lo
 * comprueba), así que no puede haber dos formas de reunir los datos.
 *
 * Los imports llevan la extensión `.ts` para que sirvan a Node (con
 * `ts-alias-hooks.mjs`) y a Vitest por igual.
 */
import { expandAll } from '../../Branding/src/data/photography.js';
import { VIDEOS } from '../src/config/videos.ts';
import { AUDIOS } from '../src/data/audios.ts';
import { COURSES } from '../src/data/courses.ts';
import { PRODUCTS } from '../src/data/products.ts';
import es from '../messages/es.json' with { type: 'json' };

/** Texto de una clave con puntos de `messages/es.json`. */
function titleOf(key) {
  const text = key.split('.').reduce((node, part) => node?.[part], es);
  if (typeof text !== 'string') throw new Error(`clave sin texto en es.json: ${key}`);

  return text;
}

/** Las imágenes provisionales del brief, agrupadas por slot (como la sección «Provisionales» del brief). */
function provisionalPhotos() {
  const groups = new Map();

  for (const row of expandAll().filter((item) => item.provisional)) {
    const group = groups.get(row.slotId) ?? {
      slotId: row.slotId,
      view: row.view,
      files: [],
      note: row.provisional,
    };
    group.files.push(row.file);
    groups.set(row.slotId, group);
  }

  return [...groups.values()];
}

export function collectPendingInputs() {
  return {
    audios: AUDIOS,
    videos: Object.values(VIDEOS),
    products: PRODUCTS,
    courses: COURSES,
    photos: provisionalPhotos(),
    titleOf,
  };
}
