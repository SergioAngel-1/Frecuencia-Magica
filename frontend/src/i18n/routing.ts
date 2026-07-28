import { defineRouting } from 'next-intl/routing';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

/**
 * Rutas localizadas: cada realm tiene su propio segmento en cada idioma.
 * `/biblioteca` en español, `/en/library` en inglés — nunca `/en/biblioteca`.
 *
 * El orden importa: `/tienda/carrito` se declara antes que `/tienda/[productId]`
 * para que el segmento dinámico no lo capture.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/inicio': { es: '/inicio', en: '/home' },
    '/acceso': { es: '/acceso', en: '/auth' },
    '/descubrete': { es: '/descubrete', en: '/discover' },
    '/biblioteca': { es: '/biblioteca', en: '/library' },
    '/academia': { es: '/academia', en: '/academy' },
    '/academia/[courseId]': {
      es: '/academia/[courseId]',
      en: '/academy/[courseId]',
    },
    '/academia/[courseId]/[lessonId]': {
      es: '/academia/[courseId]/[lessonId]',
      en: '/academy/[courseId]/[lessonId]',
    },
    '/experiencias': { es: '/experiencias', en: '/experiences' },
    '/experiencias/[experienceId]/reservar': {
      es: '/experiencias/[experienceId]/reservar',
      en: '/experiences/[experienceId]/book',
    },
    '/tienda': { es: '/tienda', en: '/store' },
    '/tienda/carrito': { es: '/tienda/carrito', en: '/store/cart' },
    '/tienda/[productId]': { es: '/tienda/[productId]', en: '/store/[productId]' },
    '/mi-santuario': { es: '/mi-santuario', en: '/my-sanctuary' },
  },
});

export type AppPathname = keyof typeof routing.pathnames;
