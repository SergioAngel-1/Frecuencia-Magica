'use client';

import { useTranslations } from 'next-intl';

import { usePathname } from '@/i18n/navigation';
import { currentSection } from '@/lib/navigation/current-section';
import { placeFromPathname } from '@/lib/realm-from-pathname';

/**
 * Nombre de la sección en la que está la persona, junto al botón de menú.
 *
 * Desde 640px: por debajo no cabe con el resto de controles, y la sección
 * actual sigue marcada dentro del menú y en la constelación. El portal y el
 * acceso no tienen sección y no muestran nada.
 */
export function CurrentSectionLabel() {
  const t = useTranslations('nav');
  const section = currentSection(placeFromPathname(usePathname()));

  if (section === null) return null;

  const { key } = section;
  const label =
    key === 'home'
      ? t('current.home')
      : key === 'story'
        ? t('story.label')
        : t(`realms.${key}` as 'realms.resonario');

  return (
    <span className="text-fg-soft text-meta tracking-ui hidden font-sans whitespace-nowrap sm:inline-block">
      {label}
    </span>
  );
}
