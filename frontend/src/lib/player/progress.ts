/**
 * Helpers puros del reproductor. Sin dependencias de tiempo ni de estado:
 * reciben todo por parámetro para poder testearlos sin mocks.
 */

/** Porcentaje transcurrido, acotado a `[0, 100]`. Con `total` cero no divide por cero. */
export function progressPercent(elapsed: number, total: number): number {
  if (total <= 0) return 0;

  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

/**
 * Id del audio siguiente en el catálogo. Envuelve al principio al llegar al
 * final, para que "siguiente" nunca deje al reproductor sin audio.
 */
export function nextAudioId(currentId: string, catalog: readonly { id: string }[]): string {
  const index = catalog.findIndex((item) => item.id === currentId);
  const nextIndex = (index + 1) % catalog.length;
  const next = catalog[nextIndex];

  // El índice siempre cae dentro del catálogo (módulo de su longitud): sólo
  // falta si el catálogo está vacío, que es un error de uso, no un caso a cubrir.
  if (!next) throw new Error('nextAudioId: el catálogo está vacío');

  return next.id;
}
