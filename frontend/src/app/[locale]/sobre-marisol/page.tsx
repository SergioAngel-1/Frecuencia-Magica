import { getTranslations } from 'next-intl/server';

import { AboutPaths } from '@/components/features/about/about-paths';
import { AboutStory } from '@/components/features/about/about-story';
import { AngelExperiences } from '@/components/features/about/angel-experiences';
import { ButtonLink, PageShell, RealmHero } from '@/components/layout';
import { ArrowGlyph, EditorialBanner, arrowLinkClasses } from '@/components/ui';
import { ATMOSPHERES } from '@/config/atmospheres';
import { Link } from '@/i18n/navigation';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { scrimToneFor } from '@/lib/atmosphere/painting';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

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

  const media = {
    // Sobre Marisol vive en la atmósfera `marisol` (lugar `story`).
    hero: resolveEditorialMedia('atmosphere.marisol', {
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
        scrimTone={scrimToneFor(ATMOSPHERES.marisol.scheme)}
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
