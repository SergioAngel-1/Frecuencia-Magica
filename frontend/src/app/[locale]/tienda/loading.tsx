import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { MediaSkeleton, Skeleton } from '@/components/ui';
import { cn } from '@/lib/cn';

/** Silhouette of a whole product card: media band, title block and action row. */
function CardSkeleton({
  label,
  bandClass,
  cardClass,
  featured,
}: {
  label: string;
  bandClass: string;
  cardClass: string;
  featured?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-card-lg border-gold/20 bg-glass flex flex-col overflow-hidden border',
        cardClass,
      )}
    >
      <MediaSkeleton
        animated
        aspect={featured ? '16:8' : '1:1'}
        className={bandClass}
        label={label}
        slot="store-product-visual"
      />
      <div className={cn('flex flex-col gap-2', featured ? 'p-5' : 'p-4')}>
        {featured ? null : <div className="bg-ivory/10 h-3 w-16 rounded-full" />}
        <div className="bg-ivory/8 h-5 w-3/4 rounded-full" />
        <div className="bg-ivory/8 h-5 w-1/2 rounded-full" />
      </div>
      <div className="mt-auto flex items-center justify-between gap-4 p-4 pt-2">
        <div className="bg-gold/25 h-5 w-14 rounded-full" />
        <div className="border-gold/30 bg-gold/10 h-11 w-24 rounded-full border" />
      </div>
    </div>
  );
}

/** The loading spread keeps the same hero, bento rhythm and zebra fallbacks. */
export default async function Loading() {
  const t = await getTranslations('store');
  const productLabel = t('media.alt.product', { title: t('gridTitle') });
  const standardBand = 'h-[clamp(190px,22vw,260px)]';
  const standardCard = 'min-h-[390px]';
  const featuredBand = 'h-[clamp(210px,26vw,340px)]';
  const featuredCard = 'min-h-[520px]';

  return (
    <PageShell width="store" padding="none" fullBleed editorial>
      <div aria-busy="true" className="motion-safe:animate-fm-fade-up">
        <MediaSkeleton
          animated
          aspect="16:9"
          className="fm-editorial-full-bleed min-h-[clamp(420px,52vw,680px)]"
          label={t('media.alt.hero')}
          slot="store.hero"
        />

        <div className="fm-editorial-full-bleed fm-container pt-[clamp(30px,5vw,76px)] pb-[220px]">
          <section data-editorial-archive="true" aria-label={t('gridTitle')}>
            <div className="mb-8 max-w-[58ch]">
              <div className="bg-gold/20 h-3 w-28 rounded-full" />
              <div className="bg-ivory/10 mt-4 h-12 w-3/4 max-w-[420px] rounded-full" />
            </div>

            <div className="grid gap-5 md:gap-7">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-7">
                <CardSkeleton
                  label={productLabel}
                  bandClass={standardBand}
                  cardClass={standardCard}
                />
                <CardSkeleton
                  label={productLabel}
                  bandClass={standardBand}
                  cardClass={standardCard}
                />
                <CardSkeleton
                  label={productLabel}
                  bandClass={standardBand}
                  cardClass={standardCard}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
                <CardSkeleton
                  label={productLabel}
                  bandClass={cn(featuredBand, 'md:col-span-2')}
                  cardClass={cn(featuredCard, 'md:col-span-2')}
                  featured
                />
                <CardSkeleton
                  label={productLabel}
                  bandClass={standardBand}
                  cardClass={cn(standardCard, 'md:mt-auto')}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-7">
                <CardSkeleton
                  label={productLabel}
                  bandClass={standardBand}
                  cardClass={standardCard}
                />
                <CardSkeleton
                  label={productLabel}
                  bandClass={standardBand}
                  cardClass={standardCard}
                />
                <CardSkeleton
                  label={productLabel}
                  bandClass={standardBand}
                  cardClass={standardCard}
                />
              </div>
            </div>
          </section>

          <div
            aria-hidden="true"
            className="mt-[clamp(60px,10vw,140px)] flex min-h-[clamp(280px,35vw,520px)] flex-col justify-end gap-4 py-[clamp(24px,6vw,84px)]"
          >
            <Skeleton variant="text" className="h-3 w-36" />
            <Skeleton variant="text" className="h-12 w-[min(560px,90vw)]" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
