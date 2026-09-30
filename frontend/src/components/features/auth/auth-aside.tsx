import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { EditorialImage, Kicker } from '@/components/ui';
import { Halo, OrbitalRings } from '@/components/world';
import type { EditorialMedia } from '@/types/editorial-media';

const ASIDE_GRADIENT =
  'linear-gradient(150deg, rgba(150,198,188,0.16), rgba(15,27,46,0.55) 55%, rgba(185,176,214,0.14))';
const ASIDE_GLOW = 'radial-gradient(60% 55% at 50% 44%, rgba(216,185,120,0.18), transparent 62%)';
const ASIDE_FADE = 'linear-gradient(180deg, transparent 60%, rgba(10,18,32,0.78))';

export interface AuthAsideProps {
  media: EditorialMedia;
}

/**
 * Umbral editorial del acceso: la materia de la imagen ocupa el panel y el
 * world engine permanece visible en forma de aros, halos y logo respirando.
 *
 * En móvil se convierte en un banner breve para que el formulario siga siendo
 * la acción principal. En desktop recupera toda la altura de la pantalla.
 */
export async function AuthAside({ media }: AuthAsideProps) {
  const t = await getTranslations('auth');
  const brand = t('quoteBy');

  return (
    <aside
      aria-label={brand}
      className="relative isolate flex h-[clamp(230px,42vw,360px)] flex-col overflow-hidden px-6 py-8 min-[900px]:h-full min-[900px]:min-h-[100svh] min-[900px]:px-[clamp(32px,6vw,96px)] min-[900px]:py-14"
      style={{ backgroundImage: ASIDE_GRADIENT }}
    >
      <div className="absolute inset-0">
        <EditorialImage
          media={media}
          aspect="16:9"
          className="h-full"
          overlay="bottom"
          scrim="left"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{ backgroundImage: ASIDE_GLOW }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{ backgroundImage: ASIDE_FADE }}
      />

      <div className="relative z-20 flex min-h-full flex-1 flex-col items-center justify-center text-center min-[900px]:items-start min-[900px]:justify-center min-[900px]:text-left">
        <div className="absolute hidden size-[min(78%,460px)] min-[900px]:block min-[1280px]:size-[min(78%,520px)]">
          <OrbitalRings
            size={460}
            spin={120}
            className="opacity-55"
            style={{ width: '100%', height: '100%' }}
            rings={[
              { r: 180, stroke: 'rgba(216,185,120,0.4)', width: 0.7 },
              { r: 130, stroke: 'rgba(150,198,188,0.4)', width: 0.7, dash: '2 10' },
              { r: 82, stroke: 'rgba(185,176,214,0.4)', width: 0.7 },
            ]}
          >
            <OrbitalRings.Node angle={270} radius={180} color="var(--color-gold)" size={6} />
            <OrbitalRings.Node angle={0} radius={180} color="var(--color-teal)" size={4.8} />
            <OrbitalRings.Node angle={90} radius={180} color="var(--color-lav)" size={4.8} />
          </OrbitalRings>
        </div>

        <div className="animate-fm-float relative size-[clamp(90px,16vw,170px)]">
          <Halo color="rgba(216,185,120,0.28), transparent 68%" blur={12} inset="-16%" />
          <Image
            src="/logo.png"
            alt={brand}
            width={170}
            height={170}
            sizes="(min-width: 900px) 170px, 110px"
            className="relative block size-full object-contain drop-shadow-[0_0_24px_rgba(216,185,120,0.42)]"
          />
        </div>

        <div className="relative z-10 mt-4 max-w-[38ch] min-[900px]:mt-8">
          <p className="text-fg-body font-serif text-[clamp(20px,2.2vw,28px)] leading-[1.35] italic">
            &ldquo;{t('quote')}&rdquo;
          </p>
          <Kicker tone="gold" className="mt-3">
            — {brand}
          </Kicker>
        </div>
      </div>
    </aside>
  );
}
