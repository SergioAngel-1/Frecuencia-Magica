import { getTranslations } from 'next-intl/server';

import { ExperienceList } from '@/components/features/experiences/experience-list';
import { PageShell, RealmHero } from '@/components/layout';
import { ATMOSPHERES } from '@/config/atmospheres';
import { EXPERIENCES } from '@/data';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { scrimToneFor } from '@/lib/atmosphere/painting';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'experiences' });

  return { title: t('title') };
}

export default async function ExperiencesPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'experiences' });
  const featuredTitle = t('items.e1.title');
  const experienceMedia = {
    // Las experiencias viven en la atmósfera `gathering`: su paisaje, no la foto del realm.
    hero: resolveEditorialMedia('atmosphere.gathering', {
      alt: t('media.alt.hero'),
      sizes: '100vw',
    }),
    featured: resolveEditorialMedia('experiences.featured', {
      alt: t('media.alt.featured', { title: featuredTitle }),
      sizes: '100vw',
    }),
    row: resolveEditorialMedia('experiences-visual', {
      sizes: '(min-width: 1280px) 1200px, calc(100vw - 48px)',
    }),
    // Una foto por experiencia: la que no tenga publicada pinta la banda del ítem.
    rows: Object.fromEntries(
      EXPERIENCES.map((experience) => [
        experience.id,
        resolveEditorialMedia('experiences-visual', {
          instance: experience.id,
          sizes: '(min-width: 1280px) 1200px, calc(100vw - 48px)',
        }),
      ]),
    ),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      {/* El héroe se encadena con la experiencia destacada dentro de la lista. */}
      <ExperienceList
        media={experienceMedia}
        hero={
          <RealmHero
            media={experienceMedia.hero}
            kicker={t('kicker')}
            title={t('title')}
            description={t('description')}
            scrimTone={scrimToneFor(ATMOSPHERES.gathering.scheme)}
          />
        }
      />
    </PageShell>
  );
}
