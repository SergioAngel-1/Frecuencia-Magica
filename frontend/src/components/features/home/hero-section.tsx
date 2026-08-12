'use client';

import Image from 'next/image';
import { div as Mdiv } from 'motion/react-m';

import { Button, Display, GradientText, Kicker, Prose, Stat } from '@/components/ui';
import { Halo, OrbitalRings } from '@/components/world';
import { Link } from '@/i18n/navigation';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';

type StatData = {
  value: string;
  label: string;
};

type HeroSectionProps = {
  kicker: string;
  titlePre: string;
  titleEm: string;
  subtitle: string;
  cta1: string;
  cta2: string;
  stats: [StatData, StatData, StatData];
};

export function HeroSection({ kicker, titlePre, titleEm, subtitle, cta1, cta2, stats }: HeroSectionProps) {
  const reduced = useReducedMotionSafe();

  const container = reduced ? undefined : staggerContainer;
  const item = reduced ? undefined : staggerItem;

  return (
    <section className="relative min-h-dvh overflow-hidden">
      <div className="mx-auto grid min-h-dvh max-w-[1440px] grid-cols-1 items-center gap-10 px-[8vw] pt-[120px] pb-[70px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Columna izquierda — texto */}
        <Mdiv
          variants={container}
          initial="hidden"
          animate="visible"
          className="order-2 flex flex-col gap-0 lg:order-1"
        >
          {/* Píldora de kicker */}
          <Mdiv variants={item} className="mb-[12px]">
            <span className="inline-flex items-center gap-[8px] rounded-pill border border-glass-brd bg-glass px-[16px] py-[8px] pr-[16px] pl-[10px] backdrop-blur-[10px]">
              <span
                aria-hidden="true"
                className="size-[6px] rounded-full bg-teal"
                style={{ boxShadow: '0 0 8px 1px var(--color-teal)', animation: 'fm-glow 3s ease-in-out infinite' }}
              />
              <Kicker tone="muted" as="span">
                {kicker}
              </Kicker>
            </span>
          </Mdiv>

          {/* Título */}
          <Mdiv variants={item}>
            <Display size="xl" level="h1" className="max-w-[15ch]">
              {titlePre}{' '}
              <GradientText>{titleEm}</GradientText>
            </Display>
          </Mdiv>

          {/* Subtítulo */}
          <Mdiv variants={item}>
            <Prose size="base" maxWidth={52} className="mt-[22px]">
              {subtitle}
            </Prose>
          </Mdiv>

          {/* Botones */}
          <Mdiv variants={item} className="mt-[36px] flex flex-wrap gap-[16px] max-sm:flex-col max-sm:*:w-full">
            <Button variant="primary" size="lg" iconRight={<span aria-hidden="true">→</span>} asChild>
              <Link href="/descubrete">{cta1}</Link>
            </Button>
            <Button variant="glass" size="lg" iconLeft={<PlayIcon />} asChild>
              <Link href="/biblioteca">{cta2}</Link>
            </Button>
          </Mdiv>

          {/* Estadísticas */}
          <Mdiv variants={item} className="mt-[44px] flex gap-[40px]">
            <Stat value={stats[0].value} label={stats[0].label} tone="teal" />
            <Stat value={stats[1].value} label={stats[1].label} tone="gold" />
            <Stat value={stats[2].value} label={stats[2].label} tone="lav" />
          </Mdiv>
        </Mdiv>

        {/* Columna derecha — geometría orbital */}
        <div
          className="relative order-1 flex min-h-[420px] items-center justify-center lg:order-2"
          style={{ animation: reduced ? undefined : 'fm-fade-in 1.4s ease both' }}
        >
          <Halo
            color="rgba(216,185,120,0.16)"
            inset="-10%"
            className="!animate-fm-breathe"
            style={{ width: 'min(80%, 440px)', filter: 'blur(18px)' }}
          />
          <OrbitalRings
            size={420}
            spin={130}
            className="opacity-75"
            rings={[
              { r: 192, stroke: 'rgba(216,185,120,0.18)' },
              { r: 150, stroke: 'rgba(150,198,188,0.16)' },
              { r: 108, stroke: 'rgba(185,176,214,0.16)' },
            ]}
          >
            <OrbitalRings.Node angle={0} radius={192} color="var(--color-gold)" size={5} />
            <OrbitalRings.Node angle={120} radius={150} color="var(--color-teal)" size={5} />
            <OrbitalRings.Node angle={240} radius={108} color="var(--color-lav)" size={5} />
          </OrbitalRings>
          <svg
            aria-hidden="true"
            viewBox="0 0 400 340"
            className="absolute animate-fm-spin-r opacity-50"
            style={{ width: 'min(80%, 400px)', animationDuration: '95s' }}
          >
            <polygon
              points="200,40 340,290 60,290"
              fill="none"
              stroke="rgba(150,198,188,0.12)"
              strokeWidth={1}
            />
          </svg>
          <Image
            src="/logo.png"
            alt=""
            width={300}
            height={300}
            sizes="(min-width: 768px) 300px, 60vw"
            className="animate-fm-float relative w-[60%] max-w-[300px] object-contain drop-shadow-[0_0_30px_rgba(216,185,120,0.42)]"
          />
        </div>
      </div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <polygon points="4,2 14,8 4,14" />
    </svg>
  );
}
