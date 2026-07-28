import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { routing, type Locale } from './routing';

/** Los `params` que Next entrega a cualquier página o layout bajo `[locale]`. */
export type LocaleParams = Promise<{ locale: string }>;

/**
 * Valida el locale de la ruta y lo activa para el render.
 *
 * Next tipa `params.locale` como `string`, así que el estrechamiento a
 * `Locale` tiene que ocurrir en tiempo de ejecución. Toda página bajo
 * `[locale]` empieza llamando a esta función:
 *
 *     const locale = await resolveLocale(params);
 *
 * Además llama a `setRequestLocale`, que es lo que permite el render estático.
 */
export async function resolveLocale(params: LocaleParams): Promise<Locale> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return locale;
}
