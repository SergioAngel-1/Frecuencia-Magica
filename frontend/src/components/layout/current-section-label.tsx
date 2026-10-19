'use client';

import { useTranslations } from 'next-intl';

import { usePathname } from '@/i18n/navigation';
import { currentSection } from '@/lib/navigation/current-section';
import { placeFromPathname } from '@/lib/realm-from-pathname';

/**
 * Nombre de la sección en la que está la persona, delante de las cápsulas del header.
 *
 * Desde 1024px: por debajo no cabe con el resto de controles, y la sección
 * actual sigue marcada dentro del menú. En tienda no se muestra: el enlace
 * «Tienda» ya la indica con `aria-current`. El portal y el
 * acceso no tienen sección y no muestran nada.
 */
export function CurrentSectionLabel() {
  const t = useTranslations('nav');
  const section = currentSection(placeFromPathname(usePathname()));

  // En tienda la etiqueta repetiría el enlace, que ya lleva `aria-current`.
  if (section === null || section.key === 'tienda') return null;

  const { key } = section;
  const label =
    key === 'home' ? t('current.home') : key === 'story' ? t('story.label') : t(`realms.${key}`);

  return (
    <span className="text-fg-meta text-label tracking-caps mr-1 hidden font-sans whitespace-nowrap uppercase lg:inline-block">
      {label}
    </span>
  );
}
