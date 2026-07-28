'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';

import { Pill } from '@/components/ui';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Cambia de idioma conservando la ruta actual.
 *
 * Navega al pathname **interno** con el otro locale, de modo que
 * `/biblioteca` lleva a `/en/library` y no a `/en/biblioteca`. Los segmentos
 * dinámicos viajan en `params`.
 */
export function LanguageToggle({ locale }: { locale: Locale }) {
  const t = useTranslations('header');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const next = routing.locales.find((candidate) => candidate !== locale) ?? routing.defaultLocale;

  const switchLocale = () => {
    startTransition(() => {
      router.replace(
        // TypeScript no puede correlacionar un pathname dinámico con sus
        // params en tiempo de compilación; la validación ocurre en next-intl.
        // @ts-expect-error -- pathname y params se validan en tiempo de ejecución
        { pathname, params },
        { locale: next },
      );
    });
  };

  return (
    <Pill
      onClick={switchLocale}
      aria-label={t('switchLanguage')}
      disabled={isPending}
      className="pointer-events-auto"
    >
      {t('languageLabel')}
    </Pill>
  );
}
