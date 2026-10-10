import { defineRouting } from 'next-intl/routing';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

/**
 * Rutas localizadas: cada realm tiene su propio segmento en cada idioma.
 * `/resonario` en español, `/en/resonarium` en inglés — nunca `/en/resonario`.
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
    // Vista interna del home: no es un realm, hereda el suyo.
    '/sobre-marisol': { es: '/sobre-marisol', en: '/about-marisol' },
    '/acceso': { es: '/acceso', en: '/auth' },
    '/descubrete': { es: '/descubrete', en: '/discover' },
    '/resonario': { es: '/resonario', en: '/resonarium' },
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
    // Catálogo interno del UI Kit. Sólo existe en desarrollo: la página
    // devuelve 404 en producción. Mismo segmento en ambos idiomas.
    '/kit': '/kit',
  },
});

export type AppPathname = keyof typeof routing.pathnames;
