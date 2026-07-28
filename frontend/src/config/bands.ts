/**
 * Bandas de realm: los gradientes que sustituyen a las imágenes.
 *
 * Todas son diagonales a 150° de un tono desaturado hacia el vacío. Nunca
 * usar fotos ni cajas grises: el placeholder ya es arte final.
 */
export const BANDS = {
  gold: 'linear-gradient(150deg, rgba(216,185,120,0.42), rgba(15,27,46,0.5) 70%)',
  teal: 'linear-gradient(150deg, rgba(150,198,188,0.40), rgba(15,27,46,0.5) 70%)',
  lav: 'linear-gradient(150deg, rgba(185,176,214,0.42), rgba(15,27,46,0.5) 70%)',
  mix: 'linear-gradient(150deg, rgba(150,198,188,0.34), rgba(185,176,214,0.30) 60%, rgba(15,27,46,0.5))',
} as const;

export type BandKey = keyof typeof BANDS;
