import { getTranslations } from 'next-intl/server';

import { PageShell, REALM_HERO_HEIGHT } from '@/components/layout';
import { MediaSkeleton, Skeleton } from '@/components/ui';
import { cn } from '@/lib/cn';

/**
 * Silhouette of a whole product card, with the same boxes as the real one:
 * the product visual at 1:1 and, for the featured card, image and text side
 * by side from `md`.
 */
function CardSkeleton({
  label,
  className,
  featured,
}: {
  label: string;
  className?: string;
  featured?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'rounded-card-lg border-gold/20 bg-glass flex flex-col overflow-hidden border',
        featured && 'md:flex-row',
        className,
      )}
    >
      <MediaSkeleton
        animated
        aspect="1:1"
        className={cn('aspect-square shrink-0', featured && 'md:w-1/2 md:self-center')}
        label={label}
        slot="store-product-visual"
      />
      <div className={cn('flex flex-1 flex-col', featured && 'md:justify-center')}>
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
    </div>
  );
}

/** The loading spread keeps the same hero, bento rhythm and zebra fallbacks. */
export default async function Loading() {
  const t = await getTranslations('store');
  const productLabel = t('media.alt.product', { title: t('gridTitle') });

  return (
    <PageShell width="store" padding="none" fullBleed editorial>
      <div aria-busy="true" className="motion-safe:animate-fm-fade-up">
        <MediaSkeleton
          animated
          aspect="16:9"
          className={cn('fm-editorial-full-bleed', REALM_HERO_HEIGHT)}
          label={t('media.alt.hero')}
          slot="store.hero"
        />

        <div className="fm-editorial-full-bleed fm-container pt-block pb-section">
          <section data-editorial-archive="true" aria-label={t('gridTitle')}>
            <div className="mb-8 max-w-[58ch]">
              <div className="bg-gold/20 h-3 w-28 rounded-full" />
              <div className="bg-ivory/10 mt-4 h-12 w-3/4 max-w-[420px] rounded-full" />
            </div>

            <div className="grid gap-5 md:gap-7">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-7">
                <CardSkeleton label={productLabel} />
                <CardSkeleton label={productLabel} />
                <CardSkeleton label={productLabel} />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
                <CardSkeleton label={productLabel} className="md:col-span-2" featured />
                <CardSkeleton label={productLabel} />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-7">
                <CardSkeleton label={productLabel} />
                <CardSkeleton label={productLabel} />
                <CardSkeleton label={productLabel} />
              </div>
            </div>
          </section>

          <div aria-hidden="true" className="mt-section flex flex-col items-center gap-4">
            <Skeleton variant="text" className="h-3 w-36" />
            <Skeleton variant="text" className="h-12 w-[min(560px,90vw)]" />
            <Skeleton variant="text" className="h-4 w-[min(420px,80vw)]" />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
