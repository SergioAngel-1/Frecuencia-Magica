import { getTranslations } from 'next-intl/server';

import { resolveLocale, type LocaleParams } from '@/i18n/resolve-locale';

type PortalPageProps = {
  params: LocaleParams;
};

/**
 * El Portal — el umbral del universo.
 *
 * Placeholder de la Fase 2: la escena completa (geometría sagrada, logo
 * flotante y cruce del portal) se construye en la Fase 6.
 */
export default async function PortalPage({ params }: PortalPageProps) {
  await resolveLocale(params);

  const t = await getTranslations('portal');

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="text-teal font-sans text-[11px] tracking-[0.5em] uppercase">{t('kicker')}</p>
      <h1 className="font-serif text-[clamp(46px,8vw,104px)] leading-[0.98] font-light">
        {t('title')}
      </h1>
      <p className="text-ivory/72 mt-6 max-w-[520px] text-[clamp(15px,1.6vw,19px)] leading-[1.75]">
        {t('subtitle')}
      </p>
    </div>
  );
}
