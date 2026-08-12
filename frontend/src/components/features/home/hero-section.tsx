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
import { Halo, OrbitalRings } from '@/components/world';
import { Link } from '@/i18n/navigation';
import { useReducedMotionSafe } from '@/hooks/use-reduced-motion-safe';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { staggerContainer, staggerItem } from '@/lib/motion-variants';
import type { EditorialMedia } from '@/types/editorial-media';

type StatData = {
  value: string;
  label: string;
};

type HeroSectionProps = {
  media?: EditorialMedia;
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
  const heroMedia = media ?? resolveEditorialMedia('home.hero');
  const container = reduced ? undefined : staggerContainer;
  const item = reduced ? undefined : staggerItem;

  return (
    <FullBleedSection
      media={heroMedia}
      mode="viewport"
      overlay="left"
      className="fm-editorial-viewport-media"
      contentClassName="flex min-h-[100svh] items-center"
    >
      <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-6 pt-[112px] pb-[64px] sm:px-[8vw] lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)] lg:gap-12 lg:px-[7vw] lg:pt-[126px] lg:pb-[78px]">
        <Mdiv
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative z-20 order-2 flex max-w-[680px] flex-col lg:order-1"
          data-editorial-zone="reading"
        >
          <Mdiv variants={item} className="mb-[14px]">
            <Kicker tone="teal" spacing="wide">
              {kicker}
            </Kicker>
          </Mdiv>

          <Mdiv variants={item}>
            <Display size="xl" level="h1" className="max-w-[14ch]">
              {titlePre} <GradientText>{titleEm}</GradientText>
            </Display>
          </Mdiv>

          <Mdiv variants={item}>
            <Prose size="base" maxWidth={52} className="text-ivory/86 mt-[24px]">
              {subtitle}
            </Prose>
          </Mdiv>

          <Mdiv
            variants={item}
            className="mt-[36px] flex flex-wrap gap-[16px] max-sm:flex-col max-sm:*:w-full"
          >
            <Button
              variant="primary"
              size="lg"
              iconRight={<span aria-hidden="true">→</span>}
              asChild
            >
              <Link href="/descubrete">{cta1}</Link>
            </Button>
            <Button variant="glass" size="lg" iconLeft={<PlayIcon />} asChild>
              <Link href="/biblioteca">{cta2}</Link>
            </Button>
          </Mdiv>

          <Mdiv variants={item} className="mt-[44px] flex flex-wrap gap-x-[40px] gap-y-[22px]">
            <Stat value={stats[0].value} label={stats[0].label} tone="teal" />
            <Stat value={stats[1].value} label={stats[1].label} tone="gold" />
            <Stat value={stats[2].value} label={stats[2].label} tone="lav" />
          </Mdiv>
        </Mdiv>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-full items-center justify-center lg:w-[52%]"
          data-editorial-zone="energy"
        >
          <div className="absolute inset-0 bg-[radial-gradient(50%_58%_at_58%_48%,rgba(216,185,120,0.16),transparent_70%)]" />
          <Halo
            color="rgba(216,185,120,0.2)"
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
              { r: 238, stroke: 'rgba(216,185,120,0.2)' },
              { r: 188, stroke: 'rgba(150,198,188,0.18)' },
              { r: 134, stroke: 'rgba(185,176,214,0.18)' },
            ]}
          >
            <OrbitalRings.Node angle={0} radius={238} color="var(--color-gold)" size={5} />
            <OrbitalRings.Node angle={120} radius={188} color="var(--color-teal)" size={5} />
            <OrbitalRings.Node angle={240} radius={134} color="var(--color-lav)" size={5} />
          </OrbitalRings>
          <svg
            viewBox="0 0 400 340"
            className="animate-fm-spin-r absolute h-auto w-[min(72vw,480px)] opacity-55"
          >
            <polygon
              points="200,40 340,290 60,290"
              fill="none"
              stroke="rgba(150,198,188,0.14)"
              strokeWidth={1}
            />
            <circle cx="200" cy="172" r="92" fill="none" stroke="rgba(185,176,214,0.12)" />
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
