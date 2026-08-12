import { EditorialBanner } from '@/components/ui';
import { WaveSeparator } from '@/components/world';
import { Link } from '@/i18n/navigation';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
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
  media?: EditorialMedia;
  kicker: string;
  title: string;
  academia: RealmDescription & { featuredCta: string };
  realms: RealmDescription[];
  storeCta: string;
  featuredBadge: string;
};

export function RealmsGrid({
  media,
  kicker,
  title,
  academia,
  realms,
  storeCta,
  featuredBadge,
}: RealmsGridProps) {
  const realmsMedia = media ?? resolveEditorialMedia('home.realms-banner');
  const panels = realms.slice(0, 5);

  return (
    <section className="w-full py-[clamp(46px,8vw,110px)]">
      <EditorialBanner
        media={realmsMedia}
        eyebrow={kicker}
        title={title}
        body={academia.description}
        tone="lav"
        action={
          <Link
            href={academia.href as '/academia'}
            className="border-lav/70 text-lav focus-visible:ring-lav inline-flex min-h-11 items-center border-b pb-1 font-sans text-[11px] tracking-[.18em] uppercase outline-none focus-visible:ring-2"
          >
            {academia.featuredCta}
            <span aria-hidden="true" className="ml-3 text-[18px] leading-none">
              →
            </span>
          </Link>
        }
        className="w-full"
      />

      <div className="mx-auto mt-[clamp(28px,5vw,64px)] grid max-w-[1280px] grid-cols-1 gap-4 px-6 sm:grid-cols-12 sm:gap-5 sm:px-[8vw]">
        <RealmCard
          href={academia.href}
          band={academia.band}
          emotion={academia.emotion}
          title={academia.title}
          description={academia.description}
          featured
          actionLabel={academia.featuredCta}
          className="sm:col-span-7"
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
            className={
              ['sm:col-span-5', 'sm:col-span-5', 'sm:col-span-4', 'sm:col-span-4', 'sm:col-span-4'][
                index
              ]
            }
          />
        ))}
      </div>

      <WaveSeparator className="mx-auto mt-[clamp(36px,6vw,72px)] max-w-[1000px]" />
    </section>
  );
}
