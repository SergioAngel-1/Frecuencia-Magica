'use client';

import { useLocale, useTranslations } from 'next-intl';

import { useRealm } from '@/hooks/use-realm';
import type { Locale } from '@/i18n/routing';

import { AudioToggle } from './audio-toggle';
import { BrandMark } from './brand-mark';
import { CurrentSectionLabel } from './current-section-label';
import { LanguageToggle } from './language-toggle';
import { RealmMenu } from './realm-menu';
import { SessionLink } from './session-link';
import { StoreLink } from './store-link';

/**
 * Barra fija superior.
 *
 * El contenedor no captura el puntero (`pointer-events-none`): sólo lo hacen
 * los controles. Así el header flota sobre el contenido sin bloquear lo que
 * hay debajo, que es lo que permite que las vistas ocupen la pantalla entera.
 */
export function SiteHeader() {
  const t = useTranslations('header');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const { realmId } = useRealm();
  // La tienda no se ofrece en el portal ni en el acceso, igual que el menú.
  const showStore = realmId !== 'portal' && realmId !== 'auth';

  return (
    <header className="fm-safe-area-top z-header pointer-events-none fixed inset-x-0 top-0 flex items-center justify-between py-4 pr-[max(20px,env(safe-area-inset-right))] pl-[max(20px,env(safe-area-inset-left))] md:py-[22px] md:pr-[max(34px,env(safe-area-inset-right))] md:pl-[max(34px,env(safe-area-inset-left))]">
      {/* Scrim: sin superficie, el logo y los controles flotan sobre el texto
          que pasa por debajo al hacer scroll. Sólo luz de fondo, sin borde. */}
      <div
        aria-hidden="true"
        className="from-scrim/85 via-scrim/45 pointer-events-none absolute inset-x-0 top-0 -z-10 h-[150%] bg-gradient-to-b to-transparent"
      />
      <a
        href="#contenido"
        className="text-fg rounded-pill border-line bg-scrim/92 text-meta tracking-ui pointer-events-auto sr-only px-5 py-3 font-sans focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-5 focus-visible:border"
      >
        {t('skipToContent')}
      </a>

      <BrandMark label={tCommon('brand')} />

      <div className="pointer-events-none flex items-center gap-2 md:gap-[10px]">
        <LanguageToggle locale={locale} />
        <AudioToggle />
        <SessionLink label={t('signIn')} active={realmId === 'auth'} />
        {showStore && <StoreLink active={realmId === 'tienda'} />}
        <CurrentSectionLabel />
        <RealmMenu />
      </div>
    </header>
  );
}
