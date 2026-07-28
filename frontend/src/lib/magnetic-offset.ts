export interface Point {
  x: number;
  y: number;
}

export interface MagneticRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calcula el desplazamiento magnético de un elemento hacia el puntero.
 *
 * Vector desde el centro del rectángulo hasta el puntero, normalizado contra
 * la mitad del tamaño del elemento y escalado por `max`, con la magnitud
 * final limitada a `max`. Es una función pura: sin estado, sin easing —
 * la sensación "orgánica, no elástica" (sin rebote/sobreimpulso) la aporta
 * el muelle suave de `Magnetic`, no esta función.
 */
export function magneticOffset(pointer: Point, rect: MagneticRect, max: number): Point {
  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;

  const halfWidth = rect.width / 2 || 1;
  const halfHeight = rect.height / 2 || 1;

  const deltaX = pointer.x - centerX;
  const deltaY = pointer.y - centerY;

  const rawX = (deltaX / halfWidth) * max;
  const rawY = (deltaY / halfHeight) * max;

  const magnitude = Math.hypot(rawX, rawY);
  if (magnitude <= max || magnitude === 0) {
    return { x: rawX, y: rawY };
  }

  const scale = max / magnitude;
  return { x: rawX * scale, y: rawY * scale };
}
