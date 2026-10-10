import { EDITORIAL_ASSET_WIDTHS } from '@/config/editorial-assets.generated';

export interface EditorialLoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Loader de `next/image` (`images.loaderFile`). Las imágenes editoriales ya
 * vienen comprimidas una sola vez, desde el original, en variantes por ancho
 * (`npm run editorial:ingest`): el loader elige la menor que cubre el ancho
 * pedido, o la mayor si ninguna llega. Así `next/image` sigue escribiendo el
 * `srcset` y el `sizes`, pero no vuelve a codificar nada.
 *
 * Un `src` que no está en el manifiesto se devuelve tal cual.
 */
export default function editorialImageLoader({ src, width }: EditorialLoaderArgs): string {
  const queryStart = src.indexOf('?');
  const path = queryStart === -1 ? src : src.slice(0, queryStart);
  const query = queryStart === -1 ? '' : src.slice(queryStart);
  const widths = EDITORIAL_ASSET_WIDTHS[path];

  if (!widths || widths.length === 0) return src;

  const chosen = widths.find((candidate) => candidate >= width) ?? widths[widths.length - 1]!;
  return `${path.replace(/\.avif$/, `-${chosen}.avif`)}${query}`;
}
