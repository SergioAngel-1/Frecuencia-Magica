'use client';

import { useLocale, useTranslations } from 'next-intl';

import { useRealm } from '@/hooks/use-realm';
import type { Locale } from '@/i18n/routing';

import { AudioToggle } from './audio-toggle';
import { BrandMark } from './brand-mark';
import { BreathingDialog } from './breathing-dialog';
import { ControlDock, DockDivider } from './control-dock';
import { CurrentSectionLabel } from './current-section-label';
import { LanguageToggle } from './language-toggle';
import { RealmMenu } from './realm-menu';
import { SessionLink } from './session-link';
import { StoreLink } from './store-link';
import { ThemeSwitcher } from './theme-switcher';

/**
 * Barra fija superior.
 *
 * El contenedor no captura el puntero (`pointer-events-none`): sólo lo hacen
 * las cápsulas de controles. Así el header flota sobre el contenido sin bloquear
 * lo que hay debajo, que es lo que permite que las vistas ocupen la pantalla entera.
 */
export function SiteHeader() {
  const t = useTranslations('header');
  const tCommon = useTranslations('common');
  const locale = useLocale() as Locale;
  const { realmId } = useRealm();
  // La tienda no se ofrece en el portal ni en el acceso, igual que el menú.
  const showStore = realmId !== 'portal' && realmId !== 'auth';
  // El menú de navegación tampoco se ofrece en el portal ni en el acceso (`RealmMenu`).
  const showMenu = showStore;

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

      {/* Dos cápsulas de la misma altura: las preferencias (idioma, sonido, tema) y la
          navegación (tienda, cuenta, menú). Antes eran siete controles sueltos, de tres
          formas distintas. La sección actual va delante, como texto, desde 1024 px. */}
      <div className="pointer-events-none flex items-center gap-2 md:gap-3">
        <CurrentSectionLabel />
        <ControlDock label={t('preferences')}>
          <LanguageToggle locale={locale} />
          <DockDivider />
          <AudioToggle />
          <DockDivider />
          <BreathingDialog />
          <DockDivider />
          <ThemeSwitcher />
        </ControlDock>
        <ControlDock label={t('shortcuts')}>
          {showStore && (
            <>
              <StoreLink active={realmId === 'tienda'} />
              <DockDivider className="max-[459px]:hidden" />
            </>
          )}
          <SessionLink label={t('signIn')} active={realmId === 'auth'} />
          {showMenu && (
            <>
              <DockDivider />
              <RealmMenu />
            </>
          )}
        </ControlDock>
      </div>
    </header>
  );
}
