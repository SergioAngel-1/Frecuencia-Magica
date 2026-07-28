'use client';

import { useLocale, useTranslations } from 'next-intl';

import { useRealm } from '@/hooks/use-realm';
import type { Locale } from '@/i18n/routing';

import { AudioToggle } from './audio-toggle';
import { BrandMark } from './brand-mark';
import { LanguageToggle } from './language-toggle';
import { SessionLink } from './session-link';

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

  return (
    <header
      role="banner"
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] flex items-center justify-between px-5 py-4 md:px-[34px] md:py-[22px]"
    >
      <a
        href="#contenido"
        className="text-ivory rounded-pill border-glass-brd pointer-events-auto sr-only bg-[rgba(15,27,46,0.92)] px-5 py-3 font-sans text-[13px] tracking-[.1em] focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-5 focus-visible:border"
      >
        {t('skipToContent')}
      </a>

      <BrandMark label={tCommon('brand')} />

      <div className="pointer-events-none flex items-center gap-2 md:gap-[10px]">
        <LanguageToggle locale={locale} />
        <AudioToggle />
        <SessionLink label={t('signIn')} active={realmId === 'auth'} />
      </div>
    </header>
  );
}
