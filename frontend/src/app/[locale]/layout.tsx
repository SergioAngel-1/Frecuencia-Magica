import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { RealmFooter, RealmNav, RouteTransition, SiteHeader } from '@/components/layout';
import { RealmProvider } from '@/components/world/realm-provider';
import { SmoothScroll } from '@/components/world/smooth-scroll';
import { WorldEngine } from '@/components/world/world-engine';
import { cormorant, jost } from '@/config/fonts';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { routing } from '@/i18n/routing';

import '../globals.css';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: LocaleParams;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale } = await params;
  const active = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: active, namespace: 'common' });

  return {
    title: {
      default: t('brand'),
      template: `%s · ${t('brand')}`,
    },
    description: t('tagline'),
  };
}

export const viewport = {
  themeColor: '#0F1B2E',
};

/**
 * Layout raíz de la aplicación.
 *
 * Vive bajo `[locale]` en lugar de en `app/` para que `<html lang>` refleje el
 * idioma real de la página: un `lang` incorrecto rompe la pronunciación de los
 * lectores de pantalla y el SEO. Todas las rutas cuelgan de este segmento, así
 * que Next lo trata como layout raíz.
 */
export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = await resolveLocale(params);

  return (
    <html lang={locale} className={`${cormorant.variable} ${jost.variable}`}>
      <body className="antialiased">
        <NextIntlClientProvider>
          <RealmProvider>
            <SmoothScroll>
              <WorldEngine />
              <SiteHeader />
              <RealmNav />
              <main id="contenido" className="relative z-[100]">
                <RouteTransition>{children}</RouteTransition>
                <RealmFooter />
              </main>
            </SmoothScroll>
          </RealmProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
