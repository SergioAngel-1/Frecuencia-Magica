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

/** Prioridad de la vista, de más a menos importante (el contrato de `editorial-media.ts`). */
const PRIORITIES = ['P0', 'P1', 'P2']

/**
 * Entregadas y publicadas, pero desviadas del brief o de su prompt. La gravedad es criterio visual:
 * `alta` se ve y estorba; `media` se aparta de lo pedido; `baja` es una cota que no justifica regenerar
 * salvo que se vea mal en pantalla.
 *
 * - `note`: qué salió mal en el resultado.
 * - `part`: la parte del prompt donde nació la desviación, según el resultado. Muchas veces es una
 *   contradicción interna del prompt, no falta de énfasis.
 * - `fix`: el refuerzo que ya lleva el prompt de `photography.js`. La imagen sigue «a corregir» hasta
 *   que se regenere con él.
 * - `published`: sólo `true` si la imagen sigue servida. Las demás se retiraron de
 *   `frontend/public/editorial/` a `frontend/.editorial-trials/` (ignorada por git) y su slot pinta el
 *   fallback hasta que llegue la regenerada.
 */
export const CORRECT = {
}

/**
 * Entregadas, pero sin slot en el registro ni pantalla que las pinte: hay que crear ambos.
 * Se dejan como `<slot>.png` sin convertir en `frontend/public/editorial/` hasta cablearlas.
 */
export const UNWIRED = {
}

/**
 * Publicadas, pero ninguna vista las pinta con el diseño actual: el audio o la experiencia que
 * representan es siempre el elemento destacado, que usa otro slot.
 */
export const UNUSED = {
  'experiences-visual-e1.avif': '`e1` es siempre la experiencia destacada, que usa `experiences.featured`. Hay que usarla en otra vista o retirarla.',
}

/** Notas de las faltantes que, al llegar, piden algo más que publicarlas. */
export const PENDING_NOTES = {
}

/** Entregadas, publicadas, cableadas y sin desviación conocida. */
export const COMPLETED = [
  'states-loading.avif',
  'states-empty.avif',
  'states-error.avif',
  'states-offline.avif',
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
  'resonario-audio-cover-a1.avif',
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
  'discover-question-atmosphere.avif',
  'resonario-audio-cover-a2.avif',
  'portal-hero.avif',
  'home-hero.avif',
  'home-marisol-portrait.avif',
  'resonario-audio-cover-a7.avif',
  'resonario-audio-cover-b1.avif',
  'resonario-audio-cover-n1.avif',
  'resonario-audio-cover-b2.avif',
  'resonario-audio-cover-n2.avif',
  'resonario-audio-cover-m1.avif',
  'resonario-audio-cover-n3.avif',
  'resonario-audio-cover-m2.avif',
  'resonario-audio-cover-g1.avif',
  'resonario-audio-cover-g2.avif',
  'portal-hero-dusk.avif',
  'portal-hero-dawn.avif',
  'portal-hero-forest.avif',
  'home-hero-dusk.avif',
  'home-hero-dawn.avif',
  'home-hero-forest.avif',
  'about-hero-dusk.avif',
  'about-hero-forest.avif',
  'auth-hero-dusk.avif',
  'auth-hero-forest.avif',
  'auth-hero-dawn.avif',
  'discover-hero-dusk.avif',
  'discover-hero-dawn.avif',
  'auth-form-atmosphere.avif',
  'og-image.jpg',
  'discover-hero.avif',
  'about-hero.avif',
  'experiences-hero.avif',
  'discover-result.avif',
  'booking-hero.avif',
  'home-footer-banner.avif',
  'sanctuary-journal.avif',
  'store-hero-dawn.avif',
  'home-membership.avif',
  'academy-course-cover-c1.avif',
  'academy-course-cover-c2.avif',
  'academy-course-cover-c3.avif',
  'academy-completion.avif',
  'experiences-visual-e2.avif',
  'experiences-visual-e3.avif',
  'experiences-visual-e4.avif',
  'store-product-visual-p1.avif',
  'store-product-visual-p2.avif',
  'store-product-visual-p3.avif',
  'store-product-visual-p4.avif',
  'store-product-visual-p5.avif',
  'store-product-visual-p6.avif',
  'store-product-visual-p7.avif',
  'store-product-visual-p8.avif',
  'atmosphere-forest-autumn.avif',
  'academy-hero-dawn.avif',
  'about-hero-dawn.avif',
  'resonario-kind-banner-melody.avif',
  'resonario-celtic.avif',
  'resonario-kind-banner-nature.avif',
  'resonario-kind-banner-frequency.avif',
  'resonario-kind-banner-binaural.avif',
  'resonario-kind-banner-guided.avif',
  'discover-hero-forest.avif',
  'academy-hero-dusk.avif',
  'experiences-hero-dawn.avif',
  'academy-hero-forest.avif',
  'booking-hero-dusk.avif',
  'experiences-hero-forest.avif',
  'experiences-hero-dusk.avif',
  'booking-hero-dawn.avif',
  'booking-hero-forest.avif',
  'store-hero-dusk.avif',
  'store-hero-forest.avif',
  'sanctuary-hero-dusk.avif',
  'sanctuary-hero-forest.avif',
  'home-daily-frequency-dawn.avif',
  'home-realms-banner-dawn.avif',
  'sanctuary-hero-dawn.avif',
  'home-footer-banner-dawn.avif',
  'home-membership-dawn.avif',
  'about-angels-dawn.avif',
  'resonario-featured-dawn.avif',
  'resonario-archive-banner-dawn.avif',
  'auth-form-atmosphere-dawn.avif',
  'discover-question-atmosphere-dawn.avif',
  'academy-featured-course-dawn.avif',
  'experiences-featured-dawn.avif',
  'store-ritual-banner-dawn.avif',
  'portal-hero-moon.avif',
  'home-hero-moon.avif',
  'resonario-hero-moon.avif',
  'about-hero-moon.avif',
  'discover-hero-moon.avif',
  'academy-hero-moon.avif',
  'experiences-hero-moon.avif',
  'booking-hero-moon.avif',
  'auth-hero-moon.avif',
]

/**
 * Agrupa las filas del brief por estado, en el orden de las secciones. «A corregir» va de más a menos
 * urgente (gravedad y, a igual gravedad, prioridad P0 → P2); dentro de cada grupo, y de cada empate, se
 * conserva el orden de las vistas. Lo usan el brief y los prompts, para que ambos documentos sigan
 * siempre el mismo orden.
 */
export function groupByState(rows) {
  const byState = new Map(STATES.map((state) => [state, []]))

  for (const row of rows) {
    const status = statusOf(row.file)
    byState.get(status.state).push({ row, status })
  }

  // Urgencia de una imagen a corregir: primero la gravedad y, a igual gravedad, la prioridad de su vista.
  byState
    .get('corregir')
    .sort(
      (a, b) =>
        SEVERITIES.indexOf(a.status.severity) - SEVERITIES.indexOf(b.status.severity) ||
        PRIORITIES.indexOf(a.row.priority) - PRIORITIES.indexOf(b.row.priority),
    )

  return byState
}

/**
 * Viñetas de una imagen «a corregir»: el resultado, la parte del prompt donde nació la desviación, el
 * refuerzo ya aplicado y si sigue servida o está retirada. Las usan el brief y los prompts.
 */
export function correctionLines(status) {
  return [
    `- **Desviación (${status.severity}):** ${status.note}`,
    `- **Parte del prompt desviada:** ${status.part}`,
    `- **Refuerzo aplicado:** ${status.fix}`,
    status.published
      ? '- **Estado:** sigue publicada: es la imagen Open Graph (JPEG) y retirarla dejaría sin imagen al compartir el enlace.'
      : '- **Estado:** retirada de `frontend/public/editorial/` (copia en `frontend/.editorial-trials/`); el slot pinta su fallback hasta regenerarla.',
  ]
}

/** `{ state, severity?, note?, part?, fix? }` de una imagen del brief, por su nombre de archivo. */
export function statusOf(file) {
  if (CORRECT[file]) return { state: 'corregir', ...CORRECT[file] }
  if (UNWIRED[file]) return { state: 'por-cablear', note: UNWIRED[file] }
  if (UNUSED[file]) return { state: 'sin-uso', note: UNUSED[file] }
  if (COMPLETED.includes(file)) return { state: 'completada' }

  return { state: 'faltante', ...(PENDING_NOTES[file] ? { note: PENDING_NOTES[file] } : {}) }
}
