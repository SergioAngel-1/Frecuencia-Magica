import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { PortalScene } from '@/components/features/portal/portal-scene';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

type PortalPageProps = {
  params: LocaleParams;
};

/**
 * Es la raíz del sitio: título sin plantilla (el layout aplica `%s · marca`
 * al resto de rutas) y la descripción de marca, ya traducida.
 */
export async function generateMetadata({ params }: PortalPageProps): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: t('brand'),
    description: t('tagline'),
  };
}

/**
 * El Portal — el umbral del universo.
 *
 * La página sólo resuelve el idioma y el copy; toda la escena (geometría
 * sagrada, logo flotante y botón de entrada) vive en `PortalScene`, que es
 * Server Component salvo por su hijo interactivo `EnterButton`.
 */
export default async function PortalPage({ params }: PortalPageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'portal' });

  return (
    <PortalScene
      kicker={t('kicker')}
      title={t('title')}
      subtitle={t('subtitle')}
      cta={t('cta')}
      hint={t('hint')}
      heroAlt={t('media.alt.hero')}
      fieldAlt={t('media.alt.field')}
    />
  );
}
