import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { LazyMotion, domAnimation } from 'motion/react';

import { PlayerDock } from '@/components/features/player/player-dock';
import {
  OfflineVeil,
  RealmFooter,
  RealmNav,
  RouteTransition,
  SiteHeader,
  TalkFloat,
} from '@/components/layout';
import { AtmosphereProvider } from '@/components/world/atmosphere-provider';
import { RealmProvider } from '@/components/world/realm-provider';
import { SmoothScroll } from '@/components/world/smooth-scroll';
import { WorldEngine } from '@/components/world/world-engine';
import { ATMOSPHERES } from '@/config/atmospheres';
import { cormorant, jost } from '@/config/fonts';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { routing } from '@/i18n/routing';
import { atmosphereBootScript, SERVER_ATMOSPHERE } from '@/lib/atmosphere/boot-script';

import '../globals.css';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: LocaleParams;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Imagen al compartir el enlace (1200×630 JPEG: las redes no leen AVIF de forma fiable). */
const OG_IMAGE = { url: '/editorial/og-image.jpg', width: 1200, height: 630 } as const;

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale } = await params;
  const active = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: active, namespace: 'common' });
  const images = [{ ...OG_IMAGE, alt: t('ogImageAlt') }];

  return {
    // Las URLs de og:image deben ser absolutas: en producción define NEXT_PUBLIC_SITE_URL.
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
    title: {
      default: t('brand'),
      template: `%s · ${t('brand')}`,
    },
    description: t('tagline'),
    // Sin icono declarado, cada vista pedía un `/favicon.ico` que no existe (404).
    icons: { icon: '/logo.png', apple: '/logo.png' },
    openGraph: { type: 'website', siteName: t('brand'), images },
    twitter: { card: 'summary_large_image', images },
  };
}

export const viewport = {
  themeColor: '#0F1B2E',
  // La noche llega hasta los bordes del dispositivo y `env(safe-area-inset-*)`
  // deja de valer cero: de ahí salen los márgenes del header y de los flotantes.
  viewportFit: 'cover',
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
    <html
      lang={locale}
      className={`${cormorant.variable} ${jost.variable}`}
      data-atmosphere={SERVER_ATMOSPHERE}
      data-scheme={ATMOSPHERES[SERVER_ATMOSPHERE].scheme}
      suppressHydrationWarning
    >
      {/* Síncrono y en línea, antes del primer pintado: fija la atmósfera del
          sitio (o la elegida) en <html> para que una recarga directa no
          destelle con la noche. Ver lib/atmosphere/boot-script.ts. */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: atmosphereBootScript() }} />
      </head>
      {/* suppressHydrationWarning en los nodos raíz: extensiones de navegador
          (modo oscuro / auto-dark) inlinean los estilos computados del body en
          el atributo `style` antes de que React hidrate, y algunas tocan el
          `lang`. El HTML del servidor no lleva esos atributos (verificado); el
          mismatch es ambiental, no del código. React documenta este caso como
          el uso legítimo de suppressHydrationWarning. */}
      <body className="antialiased" suppressHydrationWarning>
        <LazyMotion features={domAnimation}>
          <NextIntlClientProvider>
            <RealmProvider>
              <AtmosphereProvider>
                <SmoothScroll>
                  <WorldEngine />
                  <SiteHeader />
                  <RealmNav />
                  <main id="contenido" className="z-content relative">
                    <RouteTransition>{children}</RouteTransition>
                    <RealmFooter />
                  </main>
                  {/* Una sola fila al pie: el reproductor ocupa lo que queda y
                    «Hablar ahora» cierra la esquina derecha, en línea con la
                    barra o con el disco recogido. */}
                  <div
                    data-layout-layer="float-controls"
                    className="z-player fm-float-dock pointer-events-none fixed inset-x-0 bottom-0 flex items-end"
                  >
                    <PlayerDock />
                    <TalkFloat />
                  </div>
                  <OfflineVeil />
                </SmoothScroll>
              </AtmosphereProvider>
            </RealmProvider>
          </NextIntlClientProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
