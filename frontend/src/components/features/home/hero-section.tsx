'use client';

import { div as Mdiv } from 'motion/react-m';

import {
  Button,
  Display,
  GradientText,
  Kicker,
  Prose,
  Stat,
  FullBleedSection,
} from '@/components/ui';
import { Halo, Isotype, OrbitalRings } from '@/components/world';
import { Link } from '@/i18n/navigation';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { DURATION, EASE, STAGGER } from '@/config/motion';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';
import type { EditorialMedia } from '@/types/editorial-media';

type StatData = {
  value: string;
  label: string;
};

type HeroSectionProps = {
  media: EditorialMedia;
  kicker: string;
  titlePre: string;
  titleEm: string;
  subtitle: string;
  cta1: string;
  cta2: string;
  stats: [StatData, StatData, StatData];
};

export function HeroSection({
  media,
  kicker,
  titlePre,
  titleEm,
  subtitle,
  cta1,
  cta2,
  stats,
}: HeroSectionProps) {
  const reduced = useReducedMotionSafe();
  const heroMedia = media;
  const container = reduced ? undefined : staggerContainer;
  const item = reduced ? undefined : staggerItem;

  return (
    <FullBleedSection
      media={heroMedia}
      // Héroe de la Home: un tercio más bajo que el portal (`split`, ~70vh),
      // para no competir con él ni pegarse a la primera banda de contenido.
      mode="split"
      overlay="left"
      fade="bottom"
      // En móvil la imagen ya llena el alto: su foco vertical no mueve nada.
      // La caja baja para que la figura quede entre los CTA y las cifras (que
      // bajan al pie del héroe) y funde su borde superior en la noche.
      mediaClassName="max-md:top-[45%] max-md:fm-fade-top"
      contentClassName="flex items-center"
    >
      {/* El isotipo, fuera de la imagen: en la esquina superior derecha, bajo
          los controles del header y alineado con ellos. Se desplaza con la
          página (no es fijo como los controles). */}
      <Mdiv
        aria-hidden="true"
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: DURATION.slow, delay: STAGGER[1], ease: EASE.soft }}
        className="pointer-events-none absolute top-[84px] right-5 z-20 md:top-[100px] md:right-[34px]"
        data-editorial-zone="brand"
      >
        <Isotype className="size-[48px] drop-shadow-[0_0_10px_rgb(var(--halo)/0.35)] md:size-[64px]" />
      </Mdiv>
      <div className="fm-container relative grid w-full grid-cols-1 items-center gap-10 pt-[112px] pb-[112px] md:pb-[140px] lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)] lg:gap-12 lg:pt-[126px] lg:pb-[78px]">
        <Mdiv
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative z-20 order-2 flex max-w-[680px] flex-col max-md:self-stretch lg:order-1"
          data-editorial-zone="reading"
        >
          <Mdiv variants={item} className="mb-[14px]">
            <Kicker tone="teal" spacing="wide">
              {kicker}
            </Kicker>
          </Mdiv>

          <Mdiv variants={item}>
            <Display size="xl" level="h1" className="max-w-measure-title-md">
              {titlePre} <GradientText>{titleEm}</GradientText>
            </Display>
          </Mdiv>

          <Mdiv variants={item}>
            <Prose size="base" maxWidth={52} className="text-fg-body max-w-measure-full mt-[24px]">
              {subtitle}
            </Prose>
          </Mdiv>

          <Mdiv
            variants={item}
            className="mt-[36px] flex flex-wrap gap-[16px] max-sm:flex-col max-sm:*:w-full"
          >
            <Button variant="primary" iconRight={<span aria-hidden="true">→</span>} asChild>
              <Link href="/descubrete">{cta1}</Link>
            </Button>
            <Button variant="glass" iconLeft={<PlayIcon />} asChild>
              <Link href="/resonario">{cta2}</Link>
            </Button>
          </Mdiv>

          <Mdiv
            variants={item}
            className="mt-[44px] grid grid-cols-3 gap-x-4 gap-y-[22px] max-md:mt-auto max-md:pt-10 sm:flex sm:flex-wrap sm:gap-x-[40px]"
          >
            <Stat value={stats[0].value} label={stats[0].label} tone="teal" />
            <Stat value={stats[1].value} label={stats[1].label} tone="gold" />
            <Stat value={stats[2].value} label={stats[2].label} tone="lav" />
          </Mdiv>
        </Mdiv>

        <div
          aria-hidden="true"
          // En móvil la energía baja con la imagen: los aros siguen rodeando la figura.
          className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-full items-center justify-center max-md:top-[45%] lg:w-[52%]"
          data-editorial-zone="energy"
        >
          <div className="absolute inset-0 bg-[radial-gradient(50%_58%_at_58%_48%,rgb(var(--halo)/0.16),transparent_70%)]" />
          <Halo
            color="rgb(var(--halo) / 0.2)"
            inset="-12%"
            className="!animate-fm-breathe"
            style={{ width: 'min(72vw, 560px)', filter: 'blur(18px)' }}
          />
          <OrbitalRings
            size={520}
            spin={130}
            className="relative h-[min(78vw,560px)] w-[min(78vw,560px)] opacity-75"
            style={{ width: 'min(78vw, 560px)', height: 'min(78vw, 560px)' }}
            rings={[
              { r: 238, stroke: 'rgb(var(--halo) / 0.2)' },
              { r: 188, stroke: 'color-mix(in srgb, var(--color-accent-2) 18%, transparent)' },
              { r: 134, stroke: 'color-mix(in srgb, var(--color-accent-3) 18%, transparent)' },
            ]}
          >
            <OrbitalRings.Node angle={0} radius={238} color="var(--color-accent)" size={5} />
            <OrbitalRings.Node angle={120} radius={188} color="var(--color-accent-2)" size={5} />
            <OrbitalRings.Node angle={240} radius={134} color="var(--color-accent-3)" size={5} />
          </OrbitalRings>
          {/* Sólo aros de ambiente alrededor de la figura: sin triángulo, que
              competía con ella. */}
          <svg viewBox="0 0 400 400" className="absolute h-auto w-[min(72vw,480px)] opacity-55">
            <circle
              cx="200"
              cy="200"
              r="92"
              fill="none"
              style={{ stroke: 'color-mix(in srgb, var(--color-accent-3) 12%, transparent)' }}
            />
          </svg>
        </div>
      </div>
    </FullBleedSection>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <polygon points="4,2 14,8 4,14" />
    </svg>
  );
}
