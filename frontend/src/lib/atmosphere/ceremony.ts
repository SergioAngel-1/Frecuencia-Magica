/**
 * Fases de los dos cruces que pueden tapar un cambio de tema. Se declaran aquí,
 * estructuralmente, para que `lib/` no dependa de los stores; el hook les pasa
 * las fases reales.
 */
export type ThemeCeremonyPhases = {
  portal: 'idle' | 'in' | 'hold' | 'out';
  shift: 'idle' | 'confirming' | 'in' | 'hold' | 'out';
};

/**
 * ¿El cambio de tema ocurre bajo una ceremonia? Hay dos: el velo de atmósfera
 * (`in` → `hold` → `out`) y el cruce de portal (`in` → `hold` → `out`). En ambos
 * el tema se aplica con la pantalla cubierta, así que ninguna capa debe fundir:
 * el velo es la única transición visible.
 *
 * `confirming` no cuenta: es la pregunta previa, el tema todavía no ha cambiado.
 * `out` sí cuenta: el velo aún está disolviéndose sobre el mundo nuevo.
 *
 * Función pura para que la compartan componentes, hooks y código imperativo sin
 * reimplementar la condición en cada capa.
 */
export function themeCeremonyActive({ portal, shift }: ThemeCeremonyPhases): boolean {
  return portal !== 'idle' || (shift !== 'idle' && shift !== 'confirming');
}
