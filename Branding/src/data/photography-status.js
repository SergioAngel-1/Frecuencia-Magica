/**
 * Estado de cada imagen del brief: qué se entregó, qué falta y qué hay que corregir.
 * `renderBrief` lo usa para agrupar `docs/brief-fotografico.md`. Se actualiza a mano al publicar
 * o corregir una imagen; `frontend/tests/lib/photography-status.test.ts` lo cruza con el manifiesto
 * `frontend/src/config/editorial-assets.generated.ts` para que no se desfase.
 *
 * Se identifica cada imagen por su `file` (el mismo nombre del brief). Una imagen que no figura en
 * ninguna lista cuenta como faltante: aún no se ha entregado.
 */

/** Orden de las secciones del brief. */
export const STATES = ['corregir', 'faltante', 'por-cablear', 'sin-uso', 'completada']

export const STATE_LABELS = {
  corregir: 'A corregir por desviación de la IA',
  faltante: 'Faltantes',
  'por-cablear': 'Por cablear (crear vistas)',
  'sin-uso': 'No tenidas en cuenta',
  completada: 'Completadas',
}

export const SEVERITIES = ['alta', 'media', 'baja']

/**
 * Entregadas y publicadas, pero desviadas del brief o de su prompt. La gravedad es criterio visual:
 * `alta` se ve y estorba; `media` se aparta de lo pedido; `baja` es una cota que no justifica regenerar
 * salvo que se vea mal en pantalla.
 */
export const CORRECT = {
  'discover-question-atmosphere.avif': {
    severity: 'alta',
    note: 'Esfera de vidrio nítida que el prompt no pedía («nada nítido») y contraste mayor del indicado: va detrás del texto de la pregunta y compite con él. Causa probable: la frase «A glass form sits on top of this image» se dibujó como objeto.',
  },
  'resonario-audio-cover-a2.avif': {
    severity: 'alta',
    note: 'La geoda tiene el centro brillante y de alto contraste; el brief pide el centro calmo y de bajo contraste porque el Hz va superpuesto al disco.',
  },
  'home-hero.avif': {
    severity: 'media',
    note: 'La cabeza queda hacia el 51 % horizontal (brief: 62 %) y el cuerpo llega al borde derecho, cuando el brief pedía que terminara antes.',
  },
  'portal-hero.avif': {
    severity: 'media',
    note: 'El aro es una línea fina y nítida; el brief pide un halo suave y difuso, «nunca un tubo de neón fino». 1672 px de ancho.',
  },
  'auth-form-atmosphere.avif': {
    severity: 'media',
    note: 'Esfera de vidrio con un punto de luz dentro, no pedida: el prompt describía agua negra con un punto de luz reflejado y ningún objeto. Misma causa que en la pregunta del quiz.',
  },
  'resonario-audio-cover-a7.avif': {
    severity: 'media',
    note: 'El resplandor entre las manos cae justo en el centro, donde va el Hz; el brief pide el centro calmo y de bajo contraste.',
  },
  'discover-result.avif': {
    severity: 'media',
    note: 'El haz cruza el centro, que el brief pedía calmo y oscuro para el texto del resultado, y se abre en bandas de color que rozan el «arcoíris» de la lista de evitar.',
  },
  'home-marisol-portrait.avif': {
    severity: 'media',
    note: 'Sesión real (confirmada). La llama de la vela toca el borde inferior izquierdo (el brief: «nada brillante tocando el borde») y 1086 px de ancho quedan blandos en retina: pedir el original a 1440 px o más.',
  },
  'booking-hero.avif': {
    severity: 'baja',
    note: 'Las velas están encendidas (el prompt pedía apagadas) y el tercio izquierdo oscuro se aplicó con un degradado vertical recto que corta la bruma y las montañas.',
  },
  'sanctuary-journal.avif': {
    severity: 'baja',
    note: 'Esfera de vidrio desenfocada añadida arriba a la derecha, no pedida. Queda de fondo y no compite con el cuaderno.',
  },
  'discover-hero.avif': {
    severity: 'baja',
    note: 'El punto de fuga queda hacia el 64 % horizontal (brief: 50 %).',
  },
  'experiences-hero.avif': {
    severity: 'baja',
    note: 'El pabellón queda hacia el 61 % horizontal (brief: 55 %) y su arquitectura es de pagoda de Asia oriental, más específica que el «pavilion» del prompt.',
  },
  'about-hero.avif': {
    severity: 'baja',
    note: 'La mesa y la vela quedan hacia el 61 % vertical (brief: 40 %).',
  },
  'home-footer-banner.avif': {
    severity: 'baja',
    note: 'El horizonte queda hacia el 47 % vertical (brief: 40 %).',
  },
}

/**
 * Entregadas, pero sin slot en el registro ni pantalla que las pinte: hay que crear ambos.
 * Los archivos están en `frontend/public/editorial/` como `states-<estado>.png`, sin convertir.
 */
export const UNWIRED = {
  'states-loading.avif': 'Pantalla de carga: `RealmLoading` y los `loading.tsx`.',
  'states-empty.avif': 'Pantalla de vacío: `EmptyState`, del UI Kit puro, así que habría que pasarle la imagen por props.',
  'states-error.avif': 'Pantalla de error: `app/[locale]/error.tsx`.',
  'states-offline.avif': 'No existe ninguna pantalla de sin conexión: el texto `states.offline` está en los mensajes, pero nada lo pinta. Hay que crear la vista.',
}

/**
 * Publicadas, pero ninguna vista las pinta con el diseño actual: el audio o la experiencia que
 * representan es siempre el elemento destacado, que usa otro slot.
 */
export const UNUSED = {
  'resonario-audio-cover-a1.avif': '`a1` es siempre el audio destacado del resonario, que usa `resonario.featured`. Hay que usarla en otra vista o retirarla.',
  'experiences-visual-e1.avif': '`e1` es siempre la experiencia destacada, que usa `experiences.featured`. Hay que usarla en otra vista o retirarla.',
}

/** Notas de las faltantes que, al llegar, piden algo más que publicarlas. */
export const PENDING_NOTES = {
  'academy-course-cover-c1.avif': 'Al llegar hay que pasar `instance` en el detalle de curso: hoy resuelve una portada compartida. En la lista, `c1` es el curso destacado y usa `academy.featured-course`.',
  'academy-course-cover-c2.avif': 'Al llegar hay que pasar `instance` en la lista y en el detalle de curso (hoy comparten una portada).',
  'academy-course-cover-c3.avif': 'Al llegar hay que pasar `instance` en la lista y en el detalle de curso (hoy comparten una portada).',
  'store-product-visual-p1.avif': 'Al llegar hay que pasar `instance` en el catálogo de la tienda (hoy resuelve cada producto sin él). Es el producto destacado, a 16:8.',
  'store-product-visual-p2.avif': 'Al llegar hay que pasar `instance` en el catálogo de la tienda.',
  'store-product-visual-p3.avif': 'Al llegar hay que pasar `instance` en el catálogo de la tienda.',
  'store-product-visual-p4.avif': 'Al llegar hay que pasar `instance` en el catálogo de la tienda.',
  'store-product-visual-p5.avif': 'Al llegar hay que pasar `instance` en el catálogo de la tienda.',
  'store-product-visual-p6.avif': 'Al llegar hay que pasar `instance` en el catálogo de la tienda.',
  'store-product-visual-p7.avif': 'Al llegar hay que pasar `instance` en el catálogo de la tienda.',
  'store-product-visual-p8.avif': 'Al llegar hay que pasar `instance` en el catálogo de la tienda.',
}

/** Entregadas, publicadas, cableadas y sin desviación conocida. */
export const COMPLETED = [
  'portal-portal-field.avif',
  'not-found-hero.avif',
  'home-daily-frequency.avif',
  'home-realms-banner.avif',
  'about-angels.avif',
  'auth-hero.avif',
  'discover-tuning.avif',
  'resonario-hero.avif',
  'resonario-featured.avif',
  'resonario-archive-banner.avif',
  'resonario-audio-cover-a3.avif',
  'resonario-audio-cover-a4.avif',
  'resonario-audio-cover-a5.avif',
  'resonario-audio-cover-a6.avif',
  'academy-hero.avif',
  'academy-featured-course.avif',
  'academy-lesson-visual.avif',
  'experiences-featured.avif',
  'booking-confirmation.avif',
  'store-hero.avif',
  'store-ritual-banner.avif',
  'product-detail.avif',
  'product-related.avif',
  'cart-empty.avif',
  'checkout-confirmation.avif',
  'sanctuary-hero.avif',
  'sanctuary-continue.avif',
  'sanctuary-daily.avif',
  'sanctuary-empty.avif',
  'og-image.jpg',
]

/** `{ state, severity?, note? }` de una imagen del brief, por su nombre de archivo. */
export function statusOf(file) {
  if (CORRECT[file]) return { state: 'corregir', ...CORRECT[file] }
  if (UNWIRED[file]) return { state: 'por-cablear', note: UNWIRED[file] }
  if (UNUSED[file]) return { state: 'sin-uso', note: UNUSED[file] }
  if (COMPLETED.includes(file)) return { state: 'completada' }

  return { state: 'faltante', ...(PENDING_NOTES[file] ? { note: PENDING_NOTES[file] } : {}) }
}
