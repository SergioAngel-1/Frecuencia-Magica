import type { EditorialMedia, EditorialVisual } from '@/types/editorial-media';

/**
 * Lo que pinta un slot resuelto: la foto si existe y, si no, el fallback de
 * su contrato. Un slot `band` sin gradiente cae a la zebra en vez de quedarse
 * vacío, para que olvidar pasar `band` nunca deje un hueco.
 */
export function editorialVisual(media: EditorialMedia): EditorialVisual {
  if (media.src) return 'photo';
  if (media.fallback === 'band') return media.band ? 'band' : 'zebra';
  return media.fallback;
}

/** `false` cuando el slot no pinta nada: la vista puede omitir su marco. */
export function hasEditorialVisual(media: EditorialMedia): boolean {
  return editorialVisual(media) !== 'none';
}
