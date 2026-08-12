import { getTranslations } from 'next-intl/server';

import { AuthAside, AuthForm } from '@/components/features/auth';
import { PageShell } from '@/components/layout';
import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';
import { resolveEditorialMedia } from '@/lib/editorial/asset-registry';

type PageProps = { params: LocaleParams };

export async function generateMetadata({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'auth' });

  return { title: t('login.title') };
}

export default async function AuthPage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: 'auth' });
  const authMedia = {
    hero: resolveEditorialMedia('auth.hero', { alt: t('media.alt.hero') }),
    formAtmosphere: resolveEditorialMedia('auth.form-atmosphere', {
      alt: t('media.alt.formAtmosphere'),
    }),
  };

  return (
    <PageShell width="wide" padding="none" fullBleed editorial>
      <div
        data-auth-layout="split"
        className="grid min-h-[100svh] grid-cols-1 min-[900px]:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]"
      >
        <AuthAside media={authMedia.hero} />
        <AuthForm media={authMedia.formAtmosphere} />
      </div>
    </PageShell>
  );
}
