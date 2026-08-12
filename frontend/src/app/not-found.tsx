import Link from 'next/link';

import { Display, FullBleedSection, Kicker, Prose } from '@/components/ui';
import { cormorant, jost } from '@/config/fonts';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

/**
 * 404 raíz — fuera del árbol de `[locale]`.
 *
 * No recibe un locale, así que conserva el idioma por defecto y usa el enlace
 * no localizado disponible fuera de `[locale]` para volver a `/`; el middleware
 * resolverá la entrada localizada al aterrizar. Comparte el mismo umbral
 * editorial y la misma ausencia de media con el 404 localizado, sin exponer el
 * nombre técnico del slot.
 */
export default function RootNotFound() {
  const media = resolveEditorialMedia('not-found.hero');

  return (
    <html lang="es" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <title>Frecuencia Mágica</title>
      </head>
      <body className="bg-void text-ivory m-0 min-h-dvh antialiased">
        <FullBleedSection
          media={media}
          mode="viewport"
          overlay="bottom"
          className="fm-editorial-full-bleed fm-editorial-shell"
          contentClassName="min-h-[100svh]"
        >
          <div className="relative z-20 flex min-h-[100svh] items-center justify-center px-6 pt-[96px] pb-[120px] text-center md:px-10 md:pb-[80px]">
            <div className="flex w-full max-w-[680px] flex-col items-center">
              <Kicker tone="gold" spacing="wide" className="relative mb-[18px]">
                404
              </Kicker>
              <Display
                size="lg"
                level="h1"
                className="text-ivory/85 relative max-w-[34ch] text-balance"
              >
                Este lugar aún no existe
              </Display>
              <Prose muted className="relative mt-[16px] max-w-[42ch] text-[15px] leading-[1.7]">
                El camino que buscabas se desvaneció. Vuelve al portal y elige otra puerta.
              </Prose>
              <Link
                href="/"
                className="rounded-pill text-ivory hover:text-ivory focus-visible:outline-gold relative mt-[32px] inline-flex min-h-14 items-center justify-center border border-[rgba(216,185,120,0.5)] bg-[rgba(216,185,120,0.06)] px-8 font-serif text-[18px] transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-3"
              >
                Volver al portal
              </Link>
            </div>
          </div>
        </FullBleedSection>
      </body>
    </html>
  );
}
