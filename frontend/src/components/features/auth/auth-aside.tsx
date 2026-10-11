import { getTranslations } from 'next-intl/server';

import { EditorialImage, Kicker } from '@/components/ui';
import { Halo, Isotype, OrbitalRings } from '@/components/world';
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
 * En móvil se convierte en un banner breve, anclado a su 16:9, que se
 * encadena con la atmósfera del formulario: el formulario sigue siendo la
 * acción principal. Con el panel partido recupera toda la altura.
 */
export async function AuthAside({ media }: AuthAsideProps) {
  const t = await getTranslations('auth');
  const brand = t('quoteBy');

  return (
    <aside
      aria-label={brand}
      className="relative isolate flex aspect-[16/9] flex-col overflow-hidden px-6 py-8 min-[900px]:aspect-auto min-[900px]:h-full min-[900px]:min-h-[100svh] min-[900px]:py-14 min-[900px]:pr-[clamp(32px,6vw,96px)] min-[900px]:pl-[var(--page-inset)]"
    >
      {/* El tinte del panel sólo existe con el panel partido: en móvil el
          héroe es una banda que se funde en la noche, sin caja alrededor. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden min-[900px]:block"
        style={{ backgroundImage: ASIDE_GRADIENT }}
      />
      {/* En móvil la imagen se ancla arriba a su 16:9 (el panel mide al menos
          eso y crece con su texto); con el panel partido ocupa toda la altura. */}
      <div className="absolute inset-x-0 top-0 aspect-[16/9] min-[900px]:inset-0 min-[900px]:aspect-auto">
        <EditorialImage
          media={media}
          aspect="16:9"
          bandMedia
          className="h-full"
          fade="bottom"
          // El arco de luz ocupa el 62–78 % del ancho de la imagen: con el foco
          // al 75 % queda entero en la columna, del panel partido de 1100 px
          // hacia arriba, y el texto descansa en la noche de la izquierda.
          focalPoint="75% 40%"
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
        className="pointer-events-none absolute inset-0 z-10 hidden min-[900px]:block"
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
          <Isotype
            label={brand}
            className="size-full drop-shadow-[0_0_24px_rgba(216,185,120,0.42)]"
          />
        </div>

        <div className="relative z-10 mt-4 min-[900px]:mt-8">
          <p className="text-fg-body max-w-[22ch] font-serif text-[clamp(24px,3vw,44px)] leading-[1.25] text-balance italic">
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
