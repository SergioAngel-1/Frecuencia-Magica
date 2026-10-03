import { EditorialBanner } from '@/components/ui';
import { WaveSeparator } from '@/components/world';
import type { EditorialMedia } from '@/types/editorial-media';

import { RealmCard } from './realm-card';

type RealmDescription = {
  id: string;
  href: string;
  band: string;
  emotion: string;
  title: string;
  description: string;
};

type RealmsGridProps = {
  media: EditorialMedia;
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
 *   Biblioteca (4) | Experiencias (4) | Tienda (4, 2 filas)
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
  media,
  kicker,
  title,
  intro,
  academia,
  realms,
  storeCta,
  featuredBadge,
}: RealmsGridProps) {
  const realmsMedia = media;
  const panels = realms.slice(0, 5);

  return (
    <section className="fm-editorial-full-bleed">
      <EditorialBanner
        media={realmsMedia}
        eyebrow={kicker}
        title={title}
        body={intro}
        tone="lav"
        className="w-full"
      />

      <div className="fm-editorial-full-bleed fm-container mt-block grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-12">
        <RealmCard
          href={academia.href}
          band={academia.band}
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
