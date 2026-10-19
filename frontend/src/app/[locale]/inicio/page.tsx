import { getTranslations } from 'next-intl/server';

import { AboutSection } from '@/components/features/home/about-section';
import { ArrivalSection } from '@/components/features/home/arrival-section';
import { StoreShowcase } from '@/components/features/home/store-showcase';
import { DailyFrequency } from '@/components/features/home/daily-frequency';
import { HeroSection } from '@/components/features/home/hero-section';
import { MembershipSection } from '@/components/features/home/membership-section';
import { RealmsGrid } from '@/components/features/home/realms-grid';
import { VideoSlot } from '@/components/features/player/video-slot';
import { ButtonLink, PageShell } from '@/components/layout';
import { Link } from '@/i18n/navigation';
import { PLAYABLE_AUDIOS } from '@/data/audios';
import { PRODUCTS } from '@/data/products';
import { getVideo } from '@/config/videos';
import { NAV_REALMS } from '@/config/realms';
import { STORE_SHOWCASE_IDS } from '@/config/store-showcase';
import { buildHomeMedia } from '@/lib/home/home-media';
import { buildRealmCards, arrangeBento } from '@/lib/home/realm-cards';
import { buildResonarioSamples } from '@/lib/home/resonario-samples';
import { buildStoreItems } from '@/lib/home/store-items';
import { featuredProducts } from '@/lib/store/showcase';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { videoPosterMedia } from '@/lib/video/poster';
import { ArrowGlyph, arrowLinkClasses, BandChain } from '@/components/ui';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'home' });

  return { title: t('heroTitlePre') };
}

export default async function HomePage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  // En paralelo: cada `getTranslations` es una espera independiente.
  const [t, common, tResonario, nav, tVideo, storeTranslations] = await Promise.all([
    getTranslations({ locale, namespace: 'home' }),
    getTranslations('common'),
    getTranslations('resonario'),
    getTranslations('nav'),
    getTranslations('video'),
    getTranslations('store'),
  ]);

  const firstAudio = PLAYABLE_AUDIOS[0]!;
  // La del día ya ocupa el disco grande: la muestra sigue con las cuatro siguientes.
  const resonarioAudios = buildResonarioSamples(PLAYABLE_AUDIOS.slice(1, 5), tResonario);
  const bento = arrangeBento(buildRealmCards(NAV_REALMS, { home: t, nav }));
  const storeItems = buildStoreItems(
    featuredProducts(STORE_SHOWCASE_IDS, PRODUCTS),
    storeTranslations,
  );
  const homeMedia = buildHomeMedia(t);

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      {/* Ritmo de la Home (spec §10): héroe (noche) → frecuencia del día →
          «¿Cómo llegas hoy?» (amanecer) → tienda → bento de realms (noche) →
          Marisol → pie. Las bandas consecutivas se encadenan sin hueco y se
          encuentran en la noche; las secciones con atmósfera funden su borde
          con ella y entre bloques que no son bandas el ritmo es `section`. */}
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
          meta={`${t('daily.meta')} · ${firstAudio.duration ?? ''}`}
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
      </BandChain>

      {/* «¿Cómo llegas hoy?» no es una banda: va fuera de la cadena, con el ritmo
          `section` que trae su propia sección. */}
      <ArrivalSection />

      {/* Tienda: unos pocos productos y la puerta a la tienda. */}
      <StoreShowcase
        kicker={t('storeShowcase.kicker')}
        title={t('storeShowcase.title')}
        description={t('storeShowcase.description')}
        cta={t('storeShowcase.cta')}
        items={storeItems}
      />

      <div className="py-section">
        <RealmsGrid
          media={homeMedia.realms}
          kicker={t('realms.kicker')}
          title={t('realms.title')}
          intro={t('realms.intro')}
          academia={{
            ...bento.academia,
            featuredCta: t('realms.featuredCta'),
            description: t('realms.featuredDescription'),
          }}
          realms={bento.others}
          storeCta={t('realms.storeCta')}
          featuredBadge={t('realms.featuredBadge')}
        />
      </div>

      {/* Ninguna sección trae su propio margen exterior: lo pone el contenedor.
          La membresía sigue al bento y Marisol cierra la página antes de la
          despedida del footer. */}
      <div className="pb-section relative">
        <MembershipSection
          media={homeMedia.membership}
          kicker={t('membership.kicker')}
          title={t('membership.title')}
          description={t('membership.description')}
          cta={t('membership.cta')}
        />
      </div>

      <div className="fm-editorial-full-bleed py-section relative isolate">
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
          video={
            <VideoSlot
              video={getVideo('welcome')}
              media={videoPosterMedia(getVideo('welcome'), {
                alt: tVideo('titles.welcome'),
                sizes: '(min-width: 1280px) 1240px, calc(100vw - 48px)',
              })}
              title={tVideo('titles.welcome')}
              className="rounded-card-lg aspect-[16/9] sm:aspect-[16/7]"
            />
          }
        />
      </div>
    </PageShell>
  );
}
