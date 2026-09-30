import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { GlassPanel, MediaSkeleton, Skeleton } from '@/components/ui';

/** La silueta de Mi Santuario: banda, cuatro cifras, dos tarjetas y el diario. */
export default async function Loading() {
  const t = await getTranslations('sanctuary');

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <div aria-busy="true" className="motion-safe:animate-fm-fade-up">
        <MediaSkeleton
          aspect="16:9"
          className="fm-editorial-full-bleed min-h-[clamp(300px,34vw,460px)]"
          label={t('media.alt.hero')}
          slot="sanctuary.hero"
        />

        <div className="fm-editorial-full-bleed fm-container pt-8 pb-[220px]">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} variant="card" className="h-[104px]" />
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
            <GlassPanel aria-hidden="true" className="overflow-hidden">
              <MediaSkeleton
                aspect="16:8"
                label={t('media.alt.continue')}
                slot="sanctuary.continue"
              />
              <div className="flex flex-col gap-4 p-5 sm:p-7">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-[5px]" />
              </div>
            </GlassPanel>
            <GlassPanel aria-hidden="true" className="flex flex-col items-center gap-5 p-7">
              <Skeleton className="h-3 w-32" />
              <Skeleton variant="disc" className="max-w-[150px]" />
              <Skeleton className="h-4 w-40" />
            </GlassPanel>
          </div>

          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:gap-8">
            <GlassPanel aria-hidden="true" className="flex flex-col gap-4 p-5 sm:p-7">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-7 w-2/3" />
              <Skeleton variant="band" className="h-[132px]" />
            </GlassPanel>
            <MediaSkeleton
              aspect="3:4"
              className="rounded-card-lg max-lg:hidden"
              label={t('media.alt.journal')}
              slot="sanctuary.journal"
            />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
