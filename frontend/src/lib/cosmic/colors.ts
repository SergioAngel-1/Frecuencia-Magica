export type Rgb = [number, number, number];

/**
 * Convierte un color hexadecimal de 6 dígitos en su tripleta RGB.
 * Acepta el color con o sin almohadilla (`#D8B978` o `D8B978`).
 */
export function hexToRgb(hex: string): Rgb {
  const clean = hex.startsWith('#') ? hex.slice(1) : hex;
  const value = parseInt(clean, 16);

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}
