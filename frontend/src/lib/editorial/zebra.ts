/**
 * Variación determinista del skeleton zebra.
 *
 * Cada slot fija su propio ángulo de bandas y su fase de barrido a partir de
 * su id: dos bandas de la misma vista ya no son la misma textura ni laten en
 * sincronía, y el resultado es idéntico entre servidor y cliente (sin
 * `Math.random`, sin hidratación inestable).
 */

const ANGLES = [112, 118, 122, 128, 134] as const;

export type ZebraVariant = {
  /** Ángulo de las bandas, en grados. */
  angle: number;
  /** Desfase del barrido en segundos (negativo: arranca a mitad de ciclo). */
  delay: number;
};

/** Hash FNV-1a de 32 bits: estable, sin dependencias y suficiente para repartir. */
function hash(value: string): number {
  let h = 0x811c9dc5;

  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }

  return h >>> 0;
}

export function zebraVariant(slot: string): ZebraVariant {
  const h = hash(slot);

  return {
    angle: ANGLES[h % ANGLES.length]!,
    delay: -((h >>> 8) % 24) / 10,
  };
}
