import { notFound } from 'next/navigation';

/**
 * Catch-all de rutas no reconocidas dentro de un `[locale]` ya resuelto.
 *
 * Sin este segmento, una ruta como `/biblioteca/lo-que-sea` no dispara
 * ningún `not-found.tsx`: Next simplemente no encuentra página y renderiza
 * el 404 raíz de la aplicación (sin locale, sin `WorldEngine`, sin
 * traducciones). Este archivo hace que CUALQUIER ruta bajo `[locale]` sin
 * página propia llame a `notFound()`, lo que dispara el `not-found.tsx`
 * localizado de este mismo segmento. Patrón canónico de next-intl para
 * "Catching unknown routes".
 */
export default function CatchAllPage() {
  notFound();
}
