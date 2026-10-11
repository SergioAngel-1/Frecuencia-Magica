import { getTranslations } from 'next-intl/server';

import { AboutSection } from '@/components/features/home/about-section';
import { DailyFrequency } from '@/components/features/home/daily-frequency';
import { HeroSection } from '@/components/features/home/hero-section';
import { MembershipSection } from '@/components/features/home/membership-section';
import { RealmsGrid } from '@/components/features/home/realms-grid';
import { ButtonLink, PageShell } from '@/components/layout';
import { Link } from '@/i18n/navigation';
import { AUDIOS } from '@/data';
import { BANDS } from '@/config/bands';
import { NAV_REALMS } from '@/config/realms';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';
import { ArrowGlyph, arrowLinkClasses, BandChain } from '@/components/ui';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'home' });

  return { title: t('heroTitlePre') };
}

export default async function HomePage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'home' });
  const common = await getTranslations('common');
  const tResonario = await getTranslations('resonario');
  const nav = await getTranslations('nav');

  const firstAudio = AUDIOS[0]!;
  // La del día ya ocupa el disco grande: la muestra sigue con las cuatro siguientes.
  const resonarioAudios = AUDIOS.slice(1, 5).map((a) => ({
    id: a.id,
    hz: a.hz,
    band: a.band,
    title: tResonario(`audios.${a.id}.title` as 'audios.a1.title'),
    meta: `${tResonario(`tags.${a.tagId}` as 'tags.meditation')} · ${a.duration}`,
  }));

  const bandKey = (accent: string): 'gold' | 'teal' | 'lav' =>
    accent === '#B9B0D6' ? 'lav' : accent === '#96C6BC' ? 'teal' : 'gold';

  const realmData = NAV_REALMS.map((r) => ({
    id: r.id,
    href: r.href,
    band: BANDS[bandKey(r.accent)],
    emotion: nav(`emotions.${r.id}` as 'emotions.descubrete'),
    title: nav(`realms.${r.id}` as 'realms.descubrete'),
    description: t(`realms.descriptions.${r.id}` as 'realms.descriptions.descubrete'),
  }));

  const academiaData = realmData.find((r) => r.id === 'academia')!;
  const otherRealms = realmData.filter((r) => r.id !== 'academia');
  const homeMedia = {
    hero: resolveEditorialMedia('home.hero', { alt: t('media.alt.hero') }),
    daily: resolveEditorialMedia('home.daily-frequency', {
      alt: t('media.alt.dailyFrequency'),
    }),
    realms: resolveEditorialMedia('home.realms-banner', { alt: t('media.alt.realmsBanner') }),
    marisol: resolveEditorialMedia('home-marisol-portrait', {
      alt: t('media.alt.marisolPortrait'),
    }),
    membership: resolveEditorialMedia('home-membership', { alt: t('media.alt.membership') }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      {/* Las bandas consecutivas se encadenan sin hueco y se encuentran en la
          noche; entre bloques que no son bandas, el ritmo es `section`. */}
      <BandChain>
        <HeroSection
          media={homeMedia.hero}
          kicker={t('heroKicker')}
          titlePre={t('heroTitlePre')}
          titleEm={t('heroTitleEm')}
          subtitle={t('heroSubtitle')}
          cta1={t('heroCta1')}
          cta2={t('heroCta2')}
          stats={[
            { value: t('stats.daily.value'), label: t('stats.daily.label') },
            { value: t('stats.meditations.value'), label: t('stats.meditations.label') },
            { value: t('stats.realms.value'), label: t('stats.realms.label') },
          ]}
        />

        <DailyFrequency
          media={homeMedia.daily}
          hz={firstAudio.hz}
          band={firstAudio.band}
          audioId={firstAudio.id}
          kicker={t('daily.kicker')}
          title={t('daily.title')}
          description={t('daily.description')}
          meta={`${t('daily.meta')} · ${firstAudio.duration}`}
          cta={t('daily.cta')}
          resonario={{
            kicker: t('audio.kicker'),
            title: t('audio.title'),
            action: (
              <Link href="/resonario" className={arrowLinkClasses('teal')}>
                {common('seeAll')}
                <ArrowGlyph />
              </Link>
            ),
            audios: resonarioAudios,
          }}
        />

        <RealmsGrid
          media={homeMedia.realms}
          kicker={t('realms.kicker')}
          title={t('realms.title')}
          intro={t('realms.intro')}
          academia={{
            ...academiaData,
            featuredCta: t('realms.featuredCta'),
            description: t('realms.featuredDescription'),
          }}
          realms={otherRealms}
          storeCta={t('realms.storeCta')}
          featuredBadge={t('realms.featuredBadge')}
        />
      </BandChain>

      {/* Ninguna sección trae su propio margen exterior: lo pone este contenedor.
          La membresía sigue al bento de realms y Marisol cierra la página antes
          de la despedida del footer: entre una y otra, el ritmo es `section`. */}
      <div className="py-section gap-section relative flex flex-col">
        <MembershipSection
          media={homeMedia.membership}
          kicker={t('membership.kicker')}
          title={t('membership.title')}
          description={t('membership.description')}
          cta={t('membership.cta')}
        />

        <AboutSection
          media={homeMedia.marisol}
          kicker={t('about.kicker')}
          title={t('about.title')}
          p1={t('about.p1')}
          p2={t('about.p2')}
          action={
            <ButtonLink variant="outline" href="/sobre-marisol">
              {t('about.cta')} →
            </ButtonLink>
          }
        />
      </div>
    </PageShell>
  );
}
