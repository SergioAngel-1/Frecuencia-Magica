import { Display, Kicker } from '@/components/ui';
import { WaveSeparator } from '@/components/world';
import type { EditorialMedia } from '@/types/editorial-media';

import { RealmCard } from './realm-card';

type RealmDescription = {
  id: string;
  href: string;
  band: string;
  media: EditorialMedia;
  emotion: string;
  title: string;
  description: string;
};

type RealmsGridProps = {
  kicker: string;
  title: string;
  intro: string;
  academia: RealmDescription & { featuredCta: string };
  realms: RealmDescription[];
  storeCta: string;
  featuredBadge: string;
};

/**
 * Bento de 12 columnas: cada fila suma 12 y Tienda ocupa dos filas.
 *
 *   Academia (7)        | Descúbrete (5)
 *   Resonario (4) | Experiencias (4) | Tienda (4, 2 filas)
 *   Mi Santuario (8)                  | ↑
 *
 * En tablet (2 columnas) Academia y Mi Santuario ocupan la fila entera.
 */
const BENTO_SPANS = [
  'lg:col-span-5',
  'lg:col-span-4',
  'lg:col-span-4',
  'lg:col-span-4 lg:row-span-2',
  'sm:col-span-2 lg:col-span-8',
] as const;

export function RealmsGrid({
  kicker,
  title,
  intro,
  academia,
  realms,
  storeCta,
  featuredBadge,
}: RealmsGridProps) {
  const panels = realms.slice(0, 5);

  return (
    <section
      className="fm-editorial-full-bleed text-fg py-section relative"
      aria-labelledby="realms-grid-title"
    >
      {/* Encabezado de texto sobre la noche: la Home no pega dos bandas. */}
      <div className="fm-container flex flex-col items-start gap-4">
        <Kicker tone="teal" spacing="wide">
          {kicker}
        </Kicker>
        <Display level="h2" size="lg" id="realms-grid-title" className="max-w-measure-title-xl">
          {title}
        </Display>
        <p className="text-fg-body text-body max-w-measure-wide leading-[1.8]">{intro}</p>
      </div>

      <div className="fm-container mt-block grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12">
        <RealmCard
          href={academia.href}
          band={academia.band}
          media={academia.media}
          emotion={academia.emotion}
          title={academia.title}
          description={academia.description}
          featured
          actionLabel={academia.featuredCta}
          className="sm:col-span-2 lg:col-span-7"
        />

        {panels.map((realm, index) => (
          <RealmCard
            key={realm.id}
            href={realm.href}
            band={realm.band}
            media={realm.media}
            order={index + 1}
            emotion={realm.emotion}
            title={realm.title}
            description={realm.description}
            store={realm.id === 'tienda'}
            actionLabel={realm.id === 'tienda' ? `${featuredBadge} · ${storeCta}` : undefined}
            className={BENTO_SPANS[index]}
          />
        ))}
      </div>

      <WaveSeparator className="mt-block mx-auto max-w-[1000px]" />
    </section>
  );
}
