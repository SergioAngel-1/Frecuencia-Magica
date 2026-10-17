export type LoopConditions = {
  /** La persona pidió menos movimiento (`prefers-reduced-motion`). */
  reduced: boolean;
  /** La conexión pide ahorrar datos (`navigator.connection.saveData`). */
  saveData: boolean;
};

/**
 * Si el entorno permite un loop de paisaje: ni movimiento reducido ni ahorro de
 * datos. Función pura; quien la llama lee las dos señales del navegador.
 */
export function allowsLoopVideo({ reduced, saveData }: LoopConditions): boolean {
  return !reduced && !saveData;
}

/** El loop sólo suena si hay fuente y el entorno lo permite; si no, queda el póster. */
export function shouldPlayLoop(src: string | undefined, conditions: LoopConditions): boolean {
  return Boolean(src) && allowsLoopVideo(conditions);
}
