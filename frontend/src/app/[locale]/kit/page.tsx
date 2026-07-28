import type { Metadata } from 'next';
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
 */
export default async function KitPage({ params }: { params: LocaleParams }) {
  await resolveLocale(params);

  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <KitCatalog />;
}
