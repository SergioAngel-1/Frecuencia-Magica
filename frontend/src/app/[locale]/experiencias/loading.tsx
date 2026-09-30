import { getTranslations } from 'next-intl/server';

import { PageShell } from '@/components/layout';
import { MediaSkeleton } from '@/components/ui';

/** Silueta editorial de Experiencias: umbral, encuentro destacado y filas. */
export default async function Loading() {
  const t = await getTranslations('experiences');

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <div aria-busy="true">
        <MediaSkeleton
          aspect="16:9"
          className="fm-editorial-full-bleed motion-safe:animate-fm-fade-up min-h-[clamp(420px,52vw,680px)]"
          label={t('media.alt.hero')}
          slot="experiences.hero"
        />

        <div className="fm-editorial-full-bleed fm-container pt-[clamp(30px,5vw,76px)] pb-[220px]">
          <MediaSkeleton
            aspect="16:8"
            className="fm-editorial-full-bleed motion-safe:animate-fm-fade-up mb-[clamp(46px,8vw,96px)] min-h-[clamp(430px,42vw,620px)]"
            label={t('media.alt.featured', { title: t('items.e1.title') })}
            slot="experiences.featured"
          />

          <section aria-labelledby="experiences-loading-title" data-editorial-archive="true">
            <div className="mb-8 max-w-[58ch]">
              <div id="experiences-loading-title">
                <MediaSkeleton
                  aspect="16:9"
                  className="motion-safe:animate-fm-fade-up"
                  label={t('media.alt.row', { title: t('all') })}
                  slot="experiences-visual"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5">
              {Array.from({ length: 3 }, (_, index) => (
                <MediaSkeleton
                  key={index}
                  aspect="16:9"
                  className="motion-safe:animate-fm-fade-up min-h-[clamp(320px,34vw,470px)]"
                  label={t('media.alt.row', { title: t('all') })}
                  slot="experiences-visual"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
