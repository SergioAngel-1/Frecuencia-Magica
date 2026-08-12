import { getTranslations } from 'next-intl/server';

import { Display, FullBleedSection, Kicker, Prose } from '@/components/ui';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { OrbitalRings } from '@/components/world';

import { NotFoundActions } from './not-found-actions';

/**
 * 404 localizado: el mismo umbral editorial que el Portal, pero con una
 * geometría incompleta para señalar que el camino se interrumpió. El layout
 * padre ya fijó el locale, por eso el copy y los enlaces permanecen traducidos.
 */
export default async function NotFound() {
  const t = await getTranslations('states');
  const media = resolveEditorialMedia('not-found.hero');

  return (
    <FullBleedSection
      media={media}
      mode="viewport"
      overlay="bottom"
      className="fm-editorial-full-bleed fm-editorial-shell"
      contentClassName="min-h-[100svh]"
    >
      <div className="relative z-20 flex min-h-[100svh] items-center justify-center px-6 pt-[108px] pb-[150px] text-center md:px-10 md:pb-[90px]">
        <div className="flex w-full max-w-[680px] flex-col items-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 size-[min(72vw,360px)] -translate-x-1/2 -translate-y-[62%] opacity-90 md:size-[min(48vh,460px)]"
          >
            <OrbitalRings
              size={460}
              spin={220}
              direction="ccw"
              className="h-full w-full"
              rings={[
                { r: 170, stroke: 'rgba(216,185,120,0.4)', width: 1, dash: '470 133' },
                { r: 112, stroke: 'rgba(247,244,234,0.12)', width: 0.7 },
              ]}
            >
              <OrbitalRings.Node angle={-90} radius={170} color="rgba(216,185,120,0.55)" size={6} />
            </OrbitalRings>
          </div>

          <Kicker tone="gold" spacing="wide" className="relative mb-[18px]">
            404
          </Kicker>
          <Display
            size="lg"
            level="h1"
            className="text-ivory/85 relative max-w-[34ch] text-balance"
          >
            {t('notFoundTitle')}
          </Display>
          <Prose muted className="relative mt-[16px] max-w-[42ch] text-[15px] leading-[1.7]">
            {t('notFoundBody')}
          </Prose>

          <div className="relative">
            <NotFoundActions homeLabel={t('notFoundCta')} realmsLabel={t('notFoundRealmsCta')} />
          </div>
        </div>
      </div>
    </FullBleedSection>
  );
}
