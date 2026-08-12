import Image from 'next/image';

import { Display, EditorialImage, FullBleedSection, Kicker, Prose } from '@/components/ui';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { Halo, OrbitalRings } from '@/components/world';

import { EnterButton } from './enter-button';

type PortalSceneProps = {
  kicker: string;
  title: string;
  subtitle: string;
  cta: string;
  hint: string;
};

/**
 * Escena completa del Portal — un umbral editorial de viewport completa.
 *
 * Server Component: nada aquí tiene estado propio. El texto llega ya
 * traducido por props (namespace `portal`); el único nodo interactivo es
 * `EnterButton`, que es quien entra en el árbol cliente y cablea el cruce.
 * Las dos capas de media se resuelven aunque todavía no haya fotografía: el
 * contrato conserva el slot y deja que `EditorialImage` pinte el zebra.
 */
export function PortalScene({ kicker, title, subtitle, cta, hint }: PortalSceneProps) {
  const heroMedia = resolveEditorialMedia('portal.hero');
  const portalFieldMedia = resolveEditorialMedia('portal.portal-field');

  return (
    <FullBleedSection
      media={heroMedia}
      mode="viewport"
      overlay="bottom"
      className="fm-editorial-full-bleed fm-editorial-shell"
      contentClassName="min-h-[100svh]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
      >
        <EditorialImage
          aspect="16:8"
          className="absolute inset-x-[7%] top-[12%] h-[58%] opacity-35 mix-blend-screen md:inset-x-[16%] md:top-[8%] md:h-[72%]"
          media={portalFieldMedia}
          overlay={false}
          scrim={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(52%_52%_at_50%_45%,rgba(216,185,120,0.10),transparent_72%)]" />
        <div className="absolute top-1/2 left-1/2 size-[min(86vw,560px)] -translate-x-1/2 -translate-y-1/2 md:size-[min(70vh,720px)]">
          <OrbitalRings
            size={720}
            spin={120}
            className="absolute inset-0 h-full w-full opacity-90"
            rings={[
              { r: 340, stroke: 'rgba(216,185,120,0.18)' },
              { r: 270, stroke: 'rgba(150,198,188,0.16)', dash: '2 10' },
              { r: 204, stroke: 'rgba(185,176,214,0.16)' },
            ]}
          >
            <g stroke="rgba(216,185,120,0.22)" strokeWidth={0.7}>
              <line x1="0" y1="-340" x2="0" y2="340" />
              <line x1="-340" y1="0" x2="340" y2="0" />
              <line x1="-240" y1="-240" x2="240" y2="240" />
              <line x1="240" y1="-240" x2="-240" y2="240" />
            </g>
          </OrbitalRings>
          <OrbitalRings
            size={720}
            spin={90}
            direction="ccw"
            className="absolute inset-0 h-full w-full"
            rings={[{ r: 340, stroke: 'transparent' }]}
          >
            <polygon points="0,-260 226,136 -226,136" fill="none" stroke="rgba(216,185,120,0.14)" />
            <polygon
              points="0,260 -226,-136 226,-136"
              fill="none"
              stroke="rgba(150,198,188,0.12)"
            />
          </OrbitalRings>
        </div>
      </div>

      <div className="relative z-20 flex min-h-[100svh] items-center justify-center px-6 pt-[84px] pb-[150px] text-center md:px-10 md:pt-[110px] md:pb-[90px]">
        <div
          className="mx-auto flex w-full max-w-[820px] flex-col items-center"
          style={{ animation: 'fm-fade-in 2s ease both' }}
        >
          <div className="animate-fm-float relative mb-[26px] size-[128px] md:mb-[30px] md:size-[190px]">
            <Halo color="rgba(216,185,120,0.22), rgba(150,198,188,0.10) 55%" inset="-8%" />
            <Image
              src="/logo.png"
              alt={title}
              width={210}
              height={210}
              priority
              sizes="(min-width: 768px) 190px, 128px"
              className="relative block size-[128px] object-contain drop-shadow-[0_0_26px_rgba(216,185,120,0.4)] md:size-[190px]"
            />
            <div
              aria-hidden="true"
              className="animate-fm-ring absolute -inset-[16px] rounded-full border border-[rgba(247,244,234,0.30)]"
            />
          </div>

          <Kicker tone="teal" spacing="widest" className="mb-[18px] tracking-[.5em] opacity-85">
            {kicker}
          </Kicker>

          <Display size="hero" level="h1" className="text-balance">
            {title}
          </Display>

          <Prose
            size="lg"
            className="text-ivory/72 mx-auto mt-[24px] mb-[38px] max-w-[520px] leading-[1.75] md:mb-[46px]"
          >
            {subtitle}
          </Prose>

          <EnterButton>{cta}</EnterButton>
        </div>
      </div>

      <p className="text-ivory/55 absolute bottom-[28px] left-1/2 z-20 -translate-x-1/2 px-6 text-center font-sans text-[15px] tracking-[.22em] whitespace-nowrap uppercase md:bottom-[34px] md:text-[11px] md:tracking-[.32em]">
        {hint}
      </p>
    </FullBleedSection>
  );
}
