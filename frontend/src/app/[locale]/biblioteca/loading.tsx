import { getTranslations } from 'next-intl/server';

import { PageShell, REALM_HERO_HEIGHT } from '@/components/layout';
import { MediaSkeleton, Skeleton } from '@/components/ui';
import { cn } from '@/lib/cn';
import { discSlot } from '@/lib/library/layout-slots';

const SMALL_DISCS = Array.from({ length: 6 }, (_, i) => discSlot(i));

/**
 * Silueta editorial de la Biblioteca: conserva el hero, los filtros, el
 * banner del archivo y el campo destacado antes de resolver los discos.
 */
export default async function Loading() {
  const t = await getTranslations('library');

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <div aria-busy="true">
        <MediaSkeleton
          animated
          aspect="16:9"
          className={cn('fm-editorial-full-bleed', REALM_HERO_HEIGHT)}
          label={t('media.alt.hero')}
          slot="library.hero"
        />

        <div className="mx-auto w-full max-w-[1040px] px-6 pt-block pb-section">
          <div
            aria-label={t('filtersLabel')}
            className="mb-[38px] flex flex-wrap gap-[10px]"
            role="group"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} variant="band" className="h-11 w-[104px]" />
            ))}
          </div>

          <div
            aria-hidden="true"
            className="mb-block flex min-h-[clamp(280px,35vw,520px)] flex-col justify-end gap-4 py-[clamp(24px,6vw,84px)]"
          >
            <Skeleton variant="text" className="h-3 w-36" />
            <Skeleton variant="text" className="h-12 w-[min(560px,90vw)]" />
          </div>

          <div
            className="relative isolate mx-auto w-full max-w-[1040px]"
            data-editorial-stage="orbital"
          >
            {/* <1024px: campo destacado seguido de rejilla secundaria. */}
            <div className="mx-auto block lg:hidden">
              <MediaSkeleton
                animated
                aspect="16:8"
                className="min-h-[clamp(430px,58vw,680px)]"
                label={t('media.alt.featured')}
                slot="library.featured"
              />
              <div className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5">
                {SMALL_DISCS.map((_, i) => (
                  <Skeleton key={i} variant="disc" className="mx-auto w-[140px]" />
                ))}
              </div>
            </div>

            {/* >=1024px: el campo destacado y las posiciones orbitales. */}
            <div className="relative hidden min-h-[720px] lg:block">
              <MediaSkeleton
                animated
                aspect="16:8"
                className="absolute top-1/2 left-1/2 z-[4] min-h-[clamp(430px,58vw,680px)] w-[min(70%,720px)] -translate-x-1/2 -translate-y-1/2"
                label={t('media.alt.featured')}
                slot="library.featured"
              />
              {SMALL_DISCS.map((slot, i) => (
                <Skeleton
                  key={i}
                  variant="disc"
                  className="absolute z-[3]"
                  style={{ top: slot.top, left: slot.left, width: slot.size }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
