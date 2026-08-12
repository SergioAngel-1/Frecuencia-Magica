import Image from 'next/image';

import { Display, Kicker, Prose } from '@/components/ui';
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
 * Escena completa del Portal — el umbral del universo (prototipo líneas
 * 214–260).
 *
 * Server Component: nada aquí tiene estado propio. El texto llega ya
 * traducido por props (namespace `portal`); el único nodo interactivo es
 * `EnterButton`, que es quien entra en el árbol cliente y cablea el cruce.
 */
export function PortalScene({ kicker, title, subtitle, cta, hint }: PortalSceneProps) {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-20 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[min(70vh,380px)] -translate-x-1/2 -translate-y-1/2 md:size-[min(78vh,640px)]"
      >
        <OrbitalRings
          size={640}
          spin={120}
          className="absolute inset-0 opacity-90"
          style={{ width: '100%', height: '100%' }}
          rings={[
            { r: 300, stroke: 'rgba(216,185,120,0.18)' },
            { r: 240, stroke: 'rgba(150,198,188,0.16)', dash: '2 10' },
            { r: 180, stroke: 'rgba(185,176,214,0.16)' },
          ]}
        >
          <g stroke="rgba(216,185,120,0.22)" strokeWidth={0.7}>
            <line x1="0" y1="-300" x2="0" y2="300" />
            <line x1="-300" y1="0" x2="300" y2="0" />
            <line x1="-212" y1="-212" x2="212" y2="212" />
            <line x1="212" y1="-212" x2="-212" y2="212" />
          </g>
        </OrbitalRings>
        <OrbitalRings
          size={640}
          spin={90}
          direction="ccw"
          className="absolute inset-0"
          style={{ width: '100%', height: '100%' }}
          rings={[{ r: 300, stroke: 'transparent' }]}
        >
          <polygon points="0,-230 200,120 -200,120" fill="none" stroke="rgba(216,185,120,0.14)" />
          <polygon points="0,230 -200,-120 200,-120" fill="none" stroke="rgba(150,198,188,0.12)" />
        </OrbitalRings>
      </div>

      <div
        className="relative z-[2] mx-auto w-[90%] md:w-auto"
        style={{ animation: 'fm-fade-in 2s ease both' }}
      >
        <div className="animate-fm-float relative mx-auto mb-[30px] size-[140px] md:size-[210px]">
          <Halo color="rgba(216,185,120,0.22), rgba(150,198,188,0.10) 55%" inset="-8%" />
          <Image
            src="/logo.png"
            alt={title}
            width={210}
            height={210}
            priority
            sizes="(min-width: 768px) 210px, 140px"
            className="relative block size-[140px] object-contain drop-shadow-[0_0_26px_rgba(216,185,120,0.4)] md:size-[210px]"
          />
          <div
            aria-hidden="true"
            className="animate-fm-ring absolute -inset-[18px] rounded-full border border-[rgba(247,244,234,0.30)]"
          />
        </div>

        <Kicker tone="teal" spacing="widest" className="mb-[18px] tracking-[.5em] opacity-85">
          {kicker}
        </Kicker>

        <Display size="hero" level="h1">
          {title}
        </Display>

        <Prose
          size="lg"
          className="text-ivory/72 mx-auto mt-[26px] mb-[46px] max-w-[520px] leading-[1.75]"
        >
          {subtitle}
        </Prose>

        <EnterButton>{cta}</EnterButton>
      </div>

      <p className="text-ivory/55 absolute bottom-[34px] left-1/2 z-[2] -translate-x-1/2 font-sans text-[11px] tracking-[.32em] uppercase">
        {hint}
      </p>
    </section>
  );
}
