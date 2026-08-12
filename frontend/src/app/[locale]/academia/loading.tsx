import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { MediaSkeleton, Skeleton } from '@/components/ui';

/** Silueta editorial de Academia: hero, curso destacado y archivo de prácticas. */
export default async function Loading() {
  const t = await getTranslations('academy');

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <div aria-busy="true">
        <MediaSkeleton
          aspect="16:9"
          className="fm-editorial-full-bleed motion-safe:animate-fm-fade-up min-h-[clamp(420px,52vw,680px)]"
          label={t('media.alt.hero')}
          slot="academy.hero"
        />

        <div className="mx-auto w-full max-w-[1200px] px-6 pt-[clamp(30px,5vw,76px)] pb-[220px] md:px-[8vw]">
          <MediaSkeleton
            aspect="16:8"
            className="motion-safe:animate-fm-fade-up mb-[clamp(42px,7vw,90px)] min-h-[clamp(420px,42vw,600px)]"
            label={t('media.alt.featured')}
            slot="academy.featured-course"
          />

          <section data-editorial-archive="true" aria-labelledby="academy-loading-archive-title">
            <div className="mb-7 max-w-[58ch]">
              <Skeleton variant="text" className="h-3 w-36" />
              <div id="academy-loading-archive-title">
                <Skeleton variant="text" className="mt-4 h-12 w-[min(520px,90vw)]" />
              </div>
              <Skeleton variant="text" className="mt-4 h-5 w-[min(620px,90vw)]" />
            </div>
            <div>
              {Array.from({ length: 2 }, (_, index) => (
                <div
                  key={index}
                  className="border-gold/20 grid gap-5 border-b py-5 md:grid-cols-[minmax(180px,0.8fr)_minmax(0,1.2fr)] md:items-center md:gap-8"
                >
                  <MediaSkeleton
                    aspect="16:8"
                    className="motion-safe:animate-fm-fade-up"
                    label={t('media.alt.courseCover', { title: t('allCourses') })}
                    slot="academy-course-cover"
                  />
                  <Skeleton variant="text" className="mt-5 h-8 w-3/4" />
                  <Skeleton variant="text" className="mt-3 h-4 w-1/2" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
