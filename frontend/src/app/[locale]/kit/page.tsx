import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

import { KitCatalog } from './kit-catalog';

export const metadata: Metadata = {
  title: 'UI Kit',
  robots: { index: false, follow: false },
};

/**
 * Catálogo del UI Kit, sólo para desarrollo.
 *
 * El plan lo situaba en `_kit/`, pero en el App Router las carpetas con
 * guión bajo son privadas y no generan ruta: la página nunca habría sido
 * accesible. Vive en `kit/` y se cierra en producción con `notFound()`.
 *
 * `headers()` fuerza render dinámico por request: sin él, la página se
 * prerenderiza en build time, donde el guard `NODE_ENV === 'production'`
 * se evalúa contra el entorno de compilación (y Turbopack puede eliminar
 * el branch como código muerto), de modo que el catálogo se servía en
 * producción. Con headers(), el guard corre con el NODE_ENV real.
 */
export default async function KitPage({ params }: { params: LocaleParams }) {
  await headers();
  await resolveLocale(params);

  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <KitCatalog />;
}
