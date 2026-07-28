import type { routing } from '@/i18n/routing';

import type messages from '../../messages/es.json';

/**
 * Tipado de next-intl.
 *
 * Da autocompletado de claves y error de compilación si se usa una que no
 * existe. El catálogo español es la referencia; el test de paridad garantiza
 * que el inglés tiene exactamente las mismas claves.
 */
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
