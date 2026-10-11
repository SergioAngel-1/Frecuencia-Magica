import { getTranslations } from 'next-intl/server';

import { AuthAside, AuthForm } from '@/components/features/auth';
import { PageShell } from '@/components/layout';
import { BandChain } from '@/components/ui';
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
      {/* El módulo ocupa el viewport entero: el formulario conserva su ancho
          (hasta 512 px) y la imagen absorbe el resto, así no queda una caja
          de 1280 px recortada en las pantallas anchas. En móvil el héroe y
          la atmósfera del formulario son bandas consecutivas: la cadena las
          une sin hueco ni filete. */}
      <div data-auth-layout="split" className="fm-editorial-full-bleed">
        <BandChain className="grid min-h-[100svh] grid-cols-1 min-[900px]:grid-cols-[minmax(0,1fr)_minmax(360px,512px)]">
          <AuthAside media={authMedia.hero} />
          <AuthForm media={authMedia.formAtmosphere} />
        </BandChain>
      </div>
    </PageShell>
  );
}
