import type { EditorialMediaAspect, EditorialMediaMode } from '@/types/editorial-media';

/** Ancho y alto del ratio, como se escriben en una media query (`16/9`). */
const RATIO_TERMS: Record<EditorialMediaAspect, readonly [number, number]> = {
  viewport: [16, 9],
  '16:9': [16, 9],
  '16:8': [16, 8],
  '3:4': [3, 4],
  '1:1': [1, 1],
};

/**
 * `sizes` de una imagen a sangre según cómo ocupa su caja. Una caja a viewport
 * escala la imagen por el alto (`object-fit: cover`) cuando la pantalla es más
 * estrecha que la imagen: ahí mide `100svh × ratio`, no `100vw`, y pedir por
 * ancho servía una variante varias veces más pequeña de lo que se pinta.
 * Las cajas ancladas y las bandas pintan la imagen a su ratio y a todo el ancho.
 */
export function mediaSizes(mode: EditorialMediaMode, aspect: EditorialMediaAspect): string {
  if (mode !== 'viewport') return '100vw';

  const [width, height] = RATIO_TERMS[aspect];
  return `(max-aspect-ratio: ${width}/${height}) calc(100svh * ${width} / ${height}), 100vw`;
}
