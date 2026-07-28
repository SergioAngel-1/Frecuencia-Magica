import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { Halo, OrbitalRings } from '@/components/world';

/** Valores exactos del brief 13.1 (prototipo líneas 188–207). */
const ASIDE_GRADIENT =
  'linear-gradient(150deg, rgba(150,198,188,0.16), rgba(15,27,46,0.55) 55%, rgba(185,176,214,0.14))';
const ASIDE_GLOW = 'radial-gradient(60% 55% at 50% 44%, rgba(216,185,120,0.18), transparent 62%)';
const ASIDE_FADE = 'linear-gradient(180deg, transparent 60%, rgba(10,18,32,0.78))';

/**
 * Panel decorativo del acceso: aros orbitales, logo flotante con halo
 * respirando y la cita de marca (prototipo líneas 188–207).
 *
 * Server Component puro: nada aquí tiene estado ni listeners — el único nodo
 * interactivo del acceso vive en `AuthForm`.
 *
 * Responsive (brief paso 4): por debajo de 900px pasa arriba con 40dvh de
 * alto (así el logo y la cita reciben primero); por debajo de 640px el logo
 * se reduce a 110px y los aros exteriores se ocultan.
 */
export async function AuthAside() {
  const t = await getTranslations('auth');
  const brand = t('quoteBy');

  return (
    <aside
      aria-label={brand}
      className="relative flex h-[40dvh] flex-col overflow-hidden px-6 py-8 max-[639px]:h-[34dvh] min-[900px]:h-auto min-[900px]:min-h-dvh min-[900px]:justify-center min-[900px]:px-[4vw] min-[900px]:py-14"
      style={{ backgroundImage: ASIDE_GRADIENT }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: ASIDE_GLOW }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: ASIDE_FADE }}
      />

      <div className="relative flex w-full flex-1 items-center justify-center">
        <div className="absolute size-[min(78%,460px)] max-[639px]:hidden">
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

        <div className="animate-fm-float relative size-[170px] max-[639px]:size-[110px]">
          <Halo color="rgba(216,185,120,0.28), transparent 68%" blur={12} inset="-16%" />
          <Image
            src="/logo.png"
            alt={brand}
            width={170}
            height={170}
            className="relative block size-full object-contain drop-shadow-[0_0_24px_rgba(216,185,120,0.42)]"
          />
        </div>
      </div>

      <div className="relative z-[1] pt-6 text-center max-[639px]:pt-3">
        <p className="mx-auto max-w-[30ch] font-serif text-[clamp(20px,2.2vw,28px)] leading-[1.4] text-ivory/90 italic">
          &ldquo;{t('quote')}&rdquo;
        </p>
        <p className="mt-3 font-sans text-[11px] tracking-[.32em] text-gold uppercase">
          — {brand}
        </p>
      </div>
    </aside>
  );
}
