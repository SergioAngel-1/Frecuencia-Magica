/**
 * Por debajo de esta opacidad final el canvas cósmico ya no se ve: su bucle de
 * frames se para. Con el perfil de la v1, las atmósferas claras quedan en 0,05
 * o menos (dawn, study, store, marisol) y la noche nunca baja de 0,34.
 */
export const CANVAS_PAUSE_BELOW = 0.05;

/** `true` si el canvas, con esa opacidad final, debe seguir dibujando. */
export function shouldRunCanvas(opacity: number): boolean {
  return opacity > CANVAS_PAUSE_BELOW;
}

/**
 * Cuánto esperar, en milisegundos, antes de parar el bucle. Sólo se espera
 * cuando el canvas bajaba de visible a oculto: así el fundido termina con las
 * estrellas aún moviéndose. Al montar, o si ya estaba parado, no hay espera.
 */
export function pauseDelayMs(
  previous: number | null,
  opacity: number,
  fadeSeconds: number,
): number {
  const wasRunning = previous !== null && shouldRunCanvas(previous);

  return shouldRunCanvas(opacity) || !wasRunning ? 0 : fadeSeconds * 1000;
}
