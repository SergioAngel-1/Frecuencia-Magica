import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { MediaSkeleton } from '@/components/ui';

/** The loading spread keeps the same hero, bento rhythm, and zebra fallbacks. */
export default async function Loading() {
  const t = await getTranslations('store');
  const productLabel = t('media.alt.product', { title: t('gridTitle') });

  return (
    <PageShell width="store" padding="none" fullBleed editorial>
      <div aria-busy="true" className="motion-safe:animate-fm-fade-up">
        <MediaSkeleton
          aspect="16:9"
          className="fm-editorial-full-bleed min-h-[clamp(420px,52vw,680px)]"
          label={t('media.alt.hero')}
          slot="store.hero"
        />

        <div className="mx-auto w-full max-w-[1240px] px-6 pt-[clamp(30px,5vw,76px)] pb-[220px] md:px-[8vw]">
          <section data-editorial-archive="true" aria-label={t('gridTitle')}>
            <div className="mb-8 max-w-[58ch]">
              <div className="bg-gold/20 h-3 w-28 rounded-full" />
              <div className="bg-ivory/10 mt-4 h-12 w-3/4 max-w-[420px] rounded-full" />
            </div>

            <div className="grid gap-5 md:gap-7">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-7">
                <MediaSkeleton
                  aspect="1:1"
                  className="min-h-[390px]"
                  label={productLabel}
                  slot="store-product-visual"
                />
                <MediaSkeleton
                  aspect="1:1"
                  className="min-h-[390px]"
                  label={productLabel}
                  slot="store-product-visual"
                />
                <MediaSkeleton
                  aspect="1:1"
                  className="min-h-[390px]"
                  label={productLabel}
                  slot="store-product-visual"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
                <MediaSkeleton
                  aspect="16:8"
                  className="min-h-[520px] md:col-span-2"
                  label={productLabel}
                  slot="store-product-visual"
                />
                <MediaSkeleton
                  aspect="1:1"
                  className="min-h-[390px]"
                  label={productLabel}
                  slot="store-product-visual"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 md:gap-7">
                <MediaSkeleton
                  aspect="1:1"
                  className="min-h-[390px]"
                  label={productLabel}
                  slot="store-product-visual"
                />
                <MediaSkeleton
                  aspect="1:1"
                  className="min-h-[390px]"
                  label={productLabel}
                  slot="store-product-visual"
                />
                <MediaSkeleton
                  aspect="1:1"
                  className="min-h-[390px]"
                  label={productLabel}
                  slot="store-product-visual"
                />
              </div>
            </div>
          </section>

          <MediaSkeleton
            aspect="16:9"
            className="fm-editorial-full-bleed mt-[clamp(60px,10vw,140px)]"
            label={t('media.alt.ritualBanner')}
            slot="store.ritual-banner"
          />
        </div>
      </div>
    </PageShell>
  );
}
