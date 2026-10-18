import { getTranslations } from 'next-intl/server';

import { AboutPaths } from '@/components/features/about/about-paths';
import { AboutStory } from '@/components/features/about/about-story';
import { AngelExperiences } from '@/components/features/about/angel-experiences';
import { VideoSlot } from '@/components/features/player/video-slot';
import { ButtonLink, PageShell, RealmHero } from '@/components/layout';
import { ArrowGlyph, EditorialBanner, arrowLinkClasses } from '@/components/ui';
import { getVideo } from '@/config/videos';
import { Link } from '@/i18n/navigation';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { videoPosterMedia } from '@/lib/video/poster';

type PageProps = { params: LocaleParams };

const ANGEL_ITEMS = ['sign', 'presence', 'message'] as const;

/** Cada camino lleva a su realm con el acento de ese realm. */
const PATHS = [
  { id: 'academia', href: '/academia', tone: 'teal' },
  { id: 'experiencias', href: '/experiencias', tone: 'lav' },
  { id: 'tienda', href: '/tienda', tone: 'gold' },
] as const;

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'about' });

  return { title: t('metaTitle') };
}

export default async function AboutMarisolPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'about' });
  const tVideo = await getTranslations({ locale, namespace: 'video' });

  const media = {
    hero: resolveEditorialMedia('about.hero', {
      alt: t('media.alt.hero'),
      sizes: '100vw',
    }),
    // El mismo retrato que el home, con el alt propio de esta vista.
    portrait: resolveEditorialMedia('home-marisol-portrait', {
      alt: t('media.alt.portrait'),
      priority: false,
    }),
    angels: resolveEditorialMedia('about.angels', { alt: t('media.alt.angels') }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <RealmHero
        media={media.hero}
        kicker={t('hero.kicker')}
        title={t('hero.title')}
        description={t('hero.description')}
      />

      <div className="py-section gap-section relative flex flex-col">
        <AboutStory
          media={media.portrait}
          kicker={t('story.kicker')}
          title={t('story.title')}
          p1={t('story.p1')}
          p2={t('story.p2')}
          quote={t('story.quote')}
        />

        {/* Su presentación en video: hasta que ella la grabe, «Próximamente». */}
        <section className="fm-editorial-full-bleed" aria-label={tVideo('titles.marisolIntro')}>
          <div className="fm-container">
            <VideoSlot
              video={getVideo('marisol-intro')}
              media={videoPosterMedia(getVideo('marisol-intro'), {
                alt: tVideo('titles.marisolIntro'),
                sizes: '(min-width: 1280px) 1240px, calc(100vw - 48px)',
              })}
              title={tVideo('titles.marisolIntro')}
              className="rounded-card-lg aspect-[16/9] sm:aspect-[16/7]"
            />
          </div>
        </section>

        <AngelExperiences
          media={media.angels}
          kicker={t('angels.kicker')}
          title={t('angels.title')}
          intro={t('angels.intro')}
          items={ANGEL_ITEMS.map((id) => ({
            id,
            title: t(`angels.items.${id}.title`),
            body: t(`angels.items.${id}.body`),
          }))}
          action={
            <Link href="/experiencias" className={arrowLinkClasses('lav')}>
              {t('angels.cta')}
              <ArrowGlyph />
            </Link>
          }
        />

        <AboutPaths
          kicker={t('paths.kicker')}
          title={t('paths.title')}
          paths={PATHS.map((path) => ({
            id: path.id,
            title: t(`paths.items.${path.id}.title`),
            body: t(`paths.items.${path.id}.body`),
            action: (
              <Link href={path.href} className={arrowLinkClasses(path.tone)}>
                {t(`paths.items.${path.id}.cta`)}
                <ArrowGlyph />
              </Link>
            ),
          }))}
        />

        <EditorialBanner
          eyebrow={t('closing.kicker')}
          title={t('closing.title')}
          body={t('closing.body')}
          align="center"
          action={
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink variant="primary" href="/descubrete">
                {t('closing.cta1')}
              </ButtonLink>
              <ButtonLink variant="outline" href="/resonario">
                {t('closing.cta2')}
              </ButtonLink>
            </div>
          }
        />
      </div>
    </PageShell>
  );
}
